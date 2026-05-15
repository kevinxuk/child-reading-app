'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Book, ReadingRecord, Reward } from '@/types';
import { useStore } from '@/store/useStore';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [showExchange, setShowExchange] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [languageFilter, setLanguageFilter] = useState<'all' | 'zh-CN' | 'en-US'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { selectedGrade } = useStore();

  const [showBookDetail, setShowBookDetail] = useState<Book | null>(null);
  const [bookReadings, setBookReadings] = useState<ReadingRecord[]>([]);

  // 批量删除
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = (ids: string[]) => {
    const next = new Set(selectedIds);
    const allSelected = ids.every(id => next.has(id));
    if (allSelected) {
      ids.forEach(id => next.delete(id));
    } else {
      ids.forEach(id => next.add(id));
    }
    setSelectedIds(next);
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 本书吗？相关的阅读回放也会一起删除。`)) return;
    setIsBatchDeleting(true);
    try {
      const ids = Array.from(selectedIds).join(',');
      const response = await fetch(`/api/books?id=${ids}`, { method: 'DELETE' });
      if (response.ok) {
        setBooks(books.filter((b) => !selectedIds.has(b.id)));
        setSelectedIds(new Set());
      }
    } catch (error) { console.error('Batch Delete Error:', error); }
    finally { setIsBatchDeleting(false); }
  };

  // Expanded sections state: key = "grade|subject|chapter"
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (key: string) => {
    const next = new Set(expandedSections);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpandedSections(next);
  };

  const getSortedBooks = useCallback(() => {
    return [...books].sort((a, b) => {
      // Sort by grade first
      const aGrade = a.grade || '';
      const bGrade = b.grade || '';
      if (aGrade !== bGrade) return aGrade.localeCompare(bGrade);
      // Then by subject
      const aSub = a.subject || '';
      const bSub = b.subject || '';
      if (aSub !== bSub) return aSub.localeCompare(bSub);
      // Then by lesson_number
      const aNum = a.lesson_number ?? 999;
      const bNum = b.lesson_number ?? 999;
      if (aNum !== bNum) return aNum - bNum;
      return 0;
    });
  }, [books]);

  const sortedBooks = getSortedBooks();

  // Group books by grade → subject → chapter
  const groupedBooks = useMemo(() => {
    const groups: { key: string; label: string; grade: string; subject: string; chapter: string; books: Book[] }[] = [];

    const filtered = sortedBooks.filter(b => {
      if (languageFilter !== 'all' && b.language !== languageFilter) return false;
      if (searchQuery && !b.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedGrade !== 'all' && b.grade !== `${selectedGrade}年级`) return false;
      return true;
    });

    const map = new Map<string, Book[]>();
    filtered.forEach(book => {
      const grade = book.grade || '未分类';
      const subject = book.subject || '';
      const chapter = book.chapter || '';
      const key = `${grade}|${subject}|${chapter}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(book);
    });

    // Sort keys for display
    const sortedKeys = Array.from(map.keys()).sort();
    sortedKeys.forEach(key => {
      const [grade, subject, chapter] = key.split('|');
      let label = grade;
      if (subject) label += ` · ${subject}`;
      if (chapter) label += ` · ${chapter}`;
      groups.push({ key, label, grade, subject, chapter, books: map.get(key)! });
    });

    return groups;
  }, [selectedGrade, sortedBooks, languageFilter, searchQuery]);

  // Auto-expand first section on load
  useEffect(() => {
    if (groupedBooks.length > 0 && expandedSections.size === 0) {
      setExpandedSections(new Set([groupedBooks[0].key]));
    }
  }, [groupedBooks, expandedSections.size]);

  useEffect(() => {
    fetchBooks();
  }, []);

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
  };

  const handleRedeem = async (reward: Reward) => {
    if (credits < reward.cost) return;
    if (!confirm(`确定用 ${reward.cost} 积分兑换「${reward.name}」吗？`)) return;
    try {
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'redeem', rewardId: reward.id }),
      });
      const data = await response.json();
      if (data.success) {
        setCredits(data.data.remainingPoints);
        alert(`🎉 兑换成功！获得「${reward.name}」`);
      } else {
        alert(data.error || '兑换失败');
      }
    } catch (error) {
      console.error('Redeem Error:', error);
      alert('兑换失败，请重试');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这本书吗？相关的阅读回放也会一起删除。')) return;
    try {
      const response = await fetch(`/api/books?id=${id}`, { method: 'DELETE' });
      if (response.ok) { setBooks(books.filter((b) => b.id !== id)); }
    } catch (error) { console.error('Delete Error:', error); }
  };

  const openBookDetail = async (book: Book) => {
    setShowBookDetail(book);
    try {
      const res = await fetch(`/api/scores?book_id=${book.id}`);
      const data = await res.json();
      if (data.success) setBookReadings(data.data || []);
    } catch {}
  };

  const closeBookDetail = () => {
    setShowBookDetail(null);
    setBookReadings([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold shrink-0">我的书架</h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索书名..."
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 w-48"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setLanguageFilter('all')} className={`px-3 py-1 text-sm rounded-full transition ${languageFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>全部</button>
              <button onClick={() => setLanguageFilter('zh-CN')} className={`px-3 py-1 text-sm rounded-full transition ${languageFilter === 'zh-CN' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>语文</button>
              <button onClick={() => setLanguageFilter('en-US')} className={`px-3 py-1 text-sm rounded-full transition ${languageFilter === 'en-US' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>英语</button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-auto">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-lg">🪙</span>
              <span className="text-lg font-bold text-yellow-600">{credits}</span>
            </div>
            <button onClick={openExchange} className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition">积分兑换</button>
            <button onClick={() => router.push('/textbooks')} className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition">课本库</button>
            <button onClick={() => router.push('/books/new')} className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition">添加书籍</button>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">还没有添加任何书籍</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => router.push('/textbooks')} className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition">课本库</button>
              <button onClick={() => router.push('/books/new')} className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition">添加书籍</button>
            </div>
          </div>
        ) : groupedBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">没有匹配的书籍，试试其他筛选条件</p>
          </div>
        ) : (
          <>
            {/* 批量操作栏 */}
            <div className="flex items-center justify-between mb-3 px-1">
              <button
                onClick={() => {
                  const allIds = groupedBooks.flatMap(g => g.books.map(b => b.id));
                  const allSelected = allIds.every(id => selectedIds.has(id));
                  if (allSelected) setSelectedIds(new Set());
                  else setSelectedIds(new Set(allIds));
                }}
                className="text-sm text-gray-600 hover:text-blue-600 transition"
              >
                {groupedBooks.flatMap(g => g.books).every(b => selectedIds.has(b.id))
                  ? '☑ 取消全选'
                  : '☐ 全选所有'}
              </button>
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">已选 {selectedIds.size} 本</span>
                  <button
                    onClick={handleBatchDelete}
                    disabled={isBatchDeleting}
                    className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50"
                  >
                    {isBatchDeleting ? '删除中...' : '🗑 批量删除'}
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="px-3 py-1.5 border text-sm rounded-lg hover:bg-gray-50 transition"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {groupedBooks.map((group) => {
                const isExpanded = expandedSections.has(group.key);
                const groupBookIds = group.books.map(b => b.id);
                const allGroupSelected = groupBookIds.every(id => selectedIds.has(id));
                return (
                  <div key={group.key} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Section Header */}
                    <div className="flex items-stretch">
                      <label
                        className="flex items-center px-3 cursor-pointer hover:bg-gray-50 shrink-0 border-r border-gray-100"
                        onClick={(e) => { e.stopPropagation(); toggleSelectAll(groupBookIds); }}
                      >
                        <input
                          type="checkbox"
                          checked={allGroupSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-500 rounded"
                        />
                      </label>
                      <button
                        onClick={() => toggleSection(group.key)}
                        className="flex-1 flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-lg shrink-0">{isExpanded ? '▼' : '▶'}</span>
                          <div className="min-w-0">
                            <span className="font-bold text-gray-800">{group.label}</span>
                            <span className="ml-2 text-sm text-gray-400">共 {group.books.length} 本</span>
                          </div>
                        </div>
                        {group.chapter && group.grade !== '未分类' && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                            {group.chapter}
                          </span>
                        )}
                      </button>
                    </div>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {group.books.map((book) => (
                          <div key={book.id} className="bg-white border rounded-lg hover:shadow-md transition p-3 text-center relative">
                            <label
                              className="absolute top-2 left-2 cursor-pointer"
                              onClick={(e) => { e.stopPropagation(); toggleSelect(book.id); }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedIds.has(book.id)}
                                onChange={() => {}}
                                className="w-4 h-4 text-blue-500 rounded"
                              />
                            </label>
                            <div className="mb-1.5 pl-5">
                              <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${book.language === 'en-US' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                {book.language === 'en-US' ? '英语' : '语文'}
                              </span>
                              {book.lesson_number && (
                                <span className="ml-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                                  第{book.lesson_number}课
                                </span>
                              )}
                            </div>
                            <div
                              className="text-sm font-bold mb-1 cursor-pointer hover:text-blue-600 transition truncate"
                              onClick={() => openBookDetail(book)}
                            >
                              {book.lesson_number ? `第${book.lesson_number}课` : book.title}
                            </div>
                            {book.title && book.lesson_number && (
                              <div className="text-xs text-gray-400 mb-1 truncate" title={book.title}>
                                {book.title}
                              </div>
                            )}
                            {book.completed ? (
                              <div className="text-xs text-green-600 mb-1.5">
                                ✓ {book.average_score != null ? `🏆${book.average_score}分` : '已完成'}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 mb-1.5">未读</div>
                            )}
                            <div className="flex gap-1 justify-center">
                              <button onClick={() => router.push(`/read/${book.id}`)} className="px-2.5 py-1 bg-blue-500 text-white text-xs rounded-lg font-medium hover:bg-blue-600 transition">阅读</button>
                              <button onClick={() => router.push(`/books/${book.id}/edit`)} className="px-2 py-1 border text-xs rounded-lg hover:bg-gray-50 transition">编辑</button>
                              <button onClick={() => handleDelete(book.id)} className="px-2 py-1 border border-red-300 text-red-500 text-xs rounded-lg hover:bg-red-50 transition">删除</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </>
        )}
      </div>

      {/* Exchange Modal */}
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
                        onClick={() => { if (credits >= reward.cost) handleRedeem(reward); }}
                      >
                        {reward.cost} 🪙
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button onClick={() => setShowExchange(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* Book Detail Modal */}
      {showBookDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeBookDetail}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${showBookDetail.language === 'en-US' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    {showBookDetail.language === 'en-US' ? '英语' : '语文'}
                  </span>
                  {showBookDetail.grade && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {showBookDetail.grade}
                    </span>
                  )}
                  {showBookDetail.chapter && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                      {showBookDetail.chapter}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold">{showBookDetail.title}</h2>
                {showBookDetail.author && (
                  <p className="text-sm text-gray-400 mt-1">作者：{showBookDetail.author}</p>
                )}
              </div>
              <button onClick={closeBookDetail} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">×</button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-500">
                  {showBookDetail.content.split('\n\n').filter(Boolean).length}
                </div>
                <div className="text-xs text-gray-600">段落数</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-500">{bookReadings.length}</div>
                <div className="text-xs text-gray-600">阅读次数</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-500">
                  {showBookDetail.completed
                    ? (showBookDetail.average_score != null ? `${showBookDetail.average_score}分` : '✓')
                    : '进行中'}
                </div>
                <div className="text-xs text-gray-600">状态</div>
              </div>
            </div>

            {/* Content Preview */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">内容预览</h3>
              <div className="p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {showBookDetail.content.slice(0, 200)}
                  {showBookDetail.content.length > 200 ? '...' : ''}
                </p>
              </div>
            </div>

            {/* Reading History */}
            {bookReadings.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">阅读记录</h3>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {[...bookReadings]
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 10)
                    .map((r) => (
                      <div key={r.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-500">
                          第{r.paragraph_index + 1}段 · {new Date(r.created_at).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${r.total_score >= 88 ? 'text-green-500' : r.total_score >= 60 ? 'text-yellow-500' : 'text-red-400'}`}>
                            {r.total_score}分
                          </span>
                          {r.credit_awarded && <span className="text-xs">🪙</span>}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { closeBookDetail(); router.push(`/read/${showBookDetail.id}`); }}
                className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
              >
                📖 开始阅读
              </button>
              <button
                onClick={() => { closeBookDetail(); router.push(`/books/${showBookDetail.id}/replays`); }}
                className="flex-1 px-4 py-2.5 border border-purple-300 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition"
              >
                📋 查看回放
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}