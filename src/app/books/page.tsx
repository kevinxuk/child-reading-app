'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Book, Reward } from '@/types';

function SortableBookCard({ book, router, handleDelete }: {
  book: Book;
  router: any;
  handleDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: book.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 text-center cursor-grab active:cursor-grabbing"
    >
      <div className="mb-2">
        <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${book.language === 'en-US' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
          {book.language === 'en-US' ? '英语' : '语文'}
        </span>
      </div>
      <div className="text-lg font-bold mb-1">
        {book.lesson_number ? `第${book.lesson_number}课` : book.title}
      </div>
      {book.completed ? (
        <div className="text-sm text-green-600 mb-2">
          ✓ {book.average_score != null ? `🏆${book.average_score}分` : '已完成'}
        </div>
      ) : (
        <div className="text-sm text-gray-400 mb-2">未读</div>
      )}
      <div className="flex gap-1 justify-center">
        <button onClick={(e) => { e.stopPropagation(); router.push(`/read/${book.id}`); }} className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg font-medium hover:bg-blue-600 transition">阅读</button>
        <button onClick={(e) => { e.stopPropagation(); router.push(`/books/${book.id}/edit`); }} className="px-2 py-1 border text-xs rounded-lg hover:bg-gray-50 transition">编辑</button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(book.id); }} className="px-2 py-1 border border-red-300 text-red-500 text-xs rounded-lg hover:bg-red-50 transition">删除</button>
      </div>
    </div>
  );
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [orderedBookIds, setOrderedBookIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [showExchange, setShowExchange] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardIcon, setNewRewardIcon] = useState('🎁');
  const [newRewardCost, setNewRewardCost] = useState(10);
  const [newRewardDesc, setNewRewardDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [languageFilter, setLanguageFilter] = useState<'all' | 'zh-CN' | 'en-US'>('all');
  const [savedLanguageFilter, setSavedLanguageFilter] = useState<'all' | 'zh-CN' | 'en-US'>('all');
  const [isSortingMode, setIsSortingMode] = useState(false);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getSortedBooks = useCallback(() => {
    if (orderedBookIds.length > 0) {
      return [...books].sort((a, b) => {
        const aIdx = orderedBookIds.indexOf(a.id);
        const bIdx = orderedBookIds.indexOf(b.id);
        const aOrder = aIdx === -1 ? 999 : aIdx;
        const bOrder = bIdx === -1 ? 999 : bIdx;
        return aOrder - bOrder;
      });
    }
    return [...books].sort((a, b) => {
      const aNum = a.lesson_number ?? (parseInt(a.id) || 0);
      const bNum = b.lesson_number ?? (parseInt(b.id) || 0);
      if (aNum !== bNum) return aNum - bNum;
      const aCompleted = a.completed && (a.average_score ?? 0) >= 88;
      const bCompleted = b.completed && (b.average_score ?? 0) >= 88;
      return aCompleted ? 1 : -1;
    });
  }, [books, orderedBookIds]);

  const sortedBooks = getSortedBooks();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const currentIds = [...orderedBookIds];
      const oldIndex = currentIds.indexOf(active.id as string);
      const newIndex = currentIds.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) {
        const allIds = sortedBooks.map(b => b.id);
        setOrderedBookIds(allIds);
        return;
      }
      setOrderedBookIds(arrayMove(currentIds, oldIndex, newIndex));
    }
  };

  const saveOrder = async () => {
    try {
      localStorage.setItem('bookOrder', JSON.stringify(orderedBookIds));
      setIsSortingMode(false);
      alert('排序已保存！');
    } catch (error) {
      console.error('Save order error:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCredits();
  }, []);

  useEffect(() => {
    if (books.length > 0 && orderedBookIds.length === 0) {
      const saved = localStorage.getItem('bookOrder');
      if (saved) {
        const parsed = JSON.parse(saved);
        const validIds = parsed.filter((id: string) => books.some((b: Book) => b.id === id));
        if (validIds.length > 0) setOrderedBookIds(validIds);
      }
    }
  }, [books]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      if (data.success) {
        setBooks(data.data);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/credits');
      const data = await response.json();
      if (data.success) { setCredits(data.data.points ?? 0); }
    } catch (error) {
      console.error('Credits Error:', error);
    }
  };

  const fetchRewards = async () => {
    try {
      const response = await fetch('/api/rewards');
      const data = await response.json();
      if (data.success) { setRewards(data.data); }
    } catch (error) {
      console.error('Rewards Error:', error);
    }
  };

  const openExchange = () => {
    setShowExchange(true);
    fetchRewards();
    setEditingReward(null);
    setShowAddForm(false);
  };

  const handleAddReward = async () => {
    if (!newRewardName.trim()) return;
    try {
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRewardName, icon: newRewardIcon, cost: newRewardCost, description: newRewardDesc }),
      });
      if (response.ok) {
        setNewRewardName(''); setNewRewardIcon('🎁'); setNewRewardCost(10); setNewRewardDesc('');
        setShowAddForm(false);
        fetchRewards();
      }
    } catch (error) { console.error('Add Reward Error:', error); }
  };

  const handleUpdateReward = async () => {
    if (!editingReward) return;
    try {
      await fetch('/api/rewards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingReward),
      });
      setEditingReward(null);
      fetchRewards();
    } catch (error) { console.error('Update Reward Error:', error); }
  };

  const handleDeleteReward = async (id: string) => {
    if (!confirm('确定删除此奖励？')) return;
    try {
      await fetch(`/api/rewards?id=${id}`, { method: 'DELETE' });
      fetchRewards();
    } catch (error) { console.error('Delete Reward Error:', error); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这本书吗？相关的阅读回放也会一起删除。')) return;
    try {
      const response = await fetch(`/api/books?id=${id}`, { method: 'DELETE' });
      if (response.ok) { setBooks(books.filter((b) => b.id !== id)); }
    } catch (error) { console.error('Delete Error:', error); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">我的书架</h1>
            <div className="flex gap-1 ml-4">
              <button onClick={() => setLanguageFilter('all')} className={`px-3 py-1 text-sm rounded-lg transition ${languageFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>全部</button>
              <button onClick={() => setLanguageFilter('zh-CN')} className={`px-3 py-1 text-sm rounded-lg transition ${languageFilter === 'zh-CN' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>语文</button>
              <button onClick={() => setLanguageFilter('en-US')} className={`px-3 py-1 text-sm rounded-lg transition ${languageFilter === 'en-US' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>英语</button>
              <button onClick={() => { if (isSortingMode) { setIsSortingMode(false); setLanguageFilter(savedLanguageFilter); } else { setSavedLanguageFilter(languageFilter); setLanguageFilter('all'); setIsSortingMode(true); } }} className={`ml-2 px-3 py-1 text-sm rounded-lg transition ${isSortingMode ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {isSortingMode ? '完成排序' : '拖拽排序'}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-lg">🪙</span>
              <span className="text-lg font-bold text-yellow-600">{credits}</span>
            </div>
            <button onClick={openExchange} className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition">积分兑换</button>
            <button onClick={() => router.push('/import')} className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition">导入课文</button>
            <button onClick={() => router.push('/books/new')} className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition">添加书籍</button>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">还没有添加任何书籍</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => router.push('/import')} className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition">导入课文</button>
              <button onClick={() => router.push('/books/new')} className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition">添加书籍</button>
            </div>
          </div>
        ) : isSortingMode ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedBooks.map(b => b.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {sortedBooks.filter(b => savedLanguageFilter === 'all' || b.language === savedLanguageFilter).map((book) => (
                  <SortableBookCard key={book.id} book={book} router={router} handleDelete={handleDelete} />
                ))}
              </div>
            </SortableContext>
            <div className="mt-6 text-center">
              <button onClick={saveOrder} className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition">保存排序</button>
            </div>
          </DndContext>
          ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedBooks.filter(b => languageFilter === 'all' || b.language === languageFilter).map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 text-center">
                <div className="mb-2">
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${book.language === 'en-US' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    {book.language === 'en-US' ? '英语' : '语文'}
                  </span>
                </div>
                <div className="text-lg font-bold mb-1">
                  {book.lesson_number ? `第${book.lesson_number}课` : book.title}
                </div>
                {book.completed ? (
                  <div className="text-sm text-green-600 mb-2">
                    ✓ {book.average_score != null ? `🏆${book.average_score}分` : '已完成'}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 mb-2">未读</div>
                )}
                <div className="flex gap-1 justify-center">
                  <button onClick={() => router.push(`/read/${book.id}`)} className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg font-medium hover:bg-blue-600 transition">阅读</button>
                  <button onClick={() => router.push(`/books/${book.id}/edit`)} className="px-2 py-1 border text-xs rounded-lg hover:bg-gray-50 transition">编辑</button>
                  <button onClick={() => handleDelete(book.id)} className="px-2 py-1 border border-red-300 text-red-500 text-xs rounded-lg hover:bg-red-50 transition">删除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showExchange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">积分兑换</h2>
              <button onClick={() => setShowExchange(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="text-center mb-6 p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">🪙 {credits}</div>
              <div className="text-sm text-gray-500">当前积分</div>
            </div>

            <div className="text-xs text-gray-400 mb-4">💡 获得方式：每段评分 ≥ 88 分 +1 积分，完成整篇朗读 +1 积分</div>

            <div className="space-y-3 mb-4">
              {rewards.map((reward) => (
                <div key={reward.id} className="p-3 bg-gray-50 rounded-lg">
                  {editingReward?.id === reward.id ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input type="text" value={editingReward.icon} onChange={(e) => setEditingReward({ ...editingReward, icon: e.target.value })} className="w-14 p-1 border rounded text-center text-lg" maxLength={2} />
                        <input type="text" value={editingReward.name} onChange={(e) => setEditingReward({ ...editingReward, name: e.target.value })} className="flex-1 p-1 border rounded text-sm" />
                      </div>
                      <div className="flex gap-2">
                        <input type="number" value={editingReward.cost} onChange={(e) => setEditingReward({ ...editingReward, cost: Number(e.target.value) })} className="w-20 p-1 border rounded text-sm" min={1} />
                        <span className="text-sm text-gray-400 self-center">积分</span>
                        <input type="text" value={editingReward.description || ''} onChange={(e) => setEditingReward({ ...editingReward, description: e.target.value })} className="flex-1 p-1 border rounded text-sm" placeholder="描述（可选）" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleUpdateReward} className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">保存</button>
                        <button onClick={() => setEditingReward(null)} className="px-3 py-1 border text-sm rounded hover:bg-gray-50">取消</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{reward.icon}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{reward.name}</div>
                          {reward.description && <div className="text-xs text-gray-400 truncate">{reward.description}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          disabled={credits < reward.cost}
                          className={`px-3 py-1 text-sm rounded-lg font-medium transition ${credits >= reward.cost ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                          onClick={() => { if (credits >= reward.cost) alert(`兑换「${reward.name}」功能即将上线！`); }}
                        >
                          {reward.cost} 🪙
                        </button>
                        <button onClick={() => setEditingReward({ ...reward })} className="text-gray-400 hover:text-gray-600 text-sm">✏️</button>
                        <button onClick={() => handleDeleteReward(reward.id)} className="text-gray-400 hover:text-red-500 text-sm">🗑️</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {showAddForm ? (
              <div className="p-3 bg-blue-50 rounded-lg mb-4 space-y-2">
                <input type="text" value={newRewardName} onChange={(e) => setNewRewardName(e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="奖励名称" autoFocus />
                <div className="flex gap-2">
                  <input type="text" value={newRewardIcon} onChange={(e) => setNewRewardIcon(e.target.value)} className="w-14 p-1.5 border rounded text-center text-lg" maxLength={2} placeholder="🎁" />
                  <input type="number" value={newRewardCost} onChange={(e) => setNewRewardCost(Number(e.target.value))} className="w-20 p-1.5 border rounded text-sm" min={1} />
                  <span className="text-sm text-gray-400 self-center">积分</span>
                  <input type="text" value={newRewardDesc} onChange={(e) => setNewRewardDesc(e.target.value)} className="flex-1 p-1.5 border rounded text-sm" placeholder="描述（可选）" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddReward} className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">添加</button>
                  <button onClick={() => setShowAddForm(false)} className="px-3 py-1 border text-sm rounded hover:bg-gray-50">取消</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:border-blue-400 hover:text-blue-500 transition"
              >
                + 添加奖励
              </button>
            )}

            <div className="mt-4 text-center">
              <button onClick={() => setShowExchange(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition">关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}