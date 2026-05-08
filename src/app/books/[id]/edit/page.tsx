'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Book } from '@/types';

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState<'zh-CN' | 'en-US' | 'mixed'>('zh-CN');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books?id=${bookId}`);
      const data = await response.json();
      if (data.success && data.data) {
        const book: Book = data.data;
        setTitle(book.title);
        setContent(book.content);
        setLanguage(book.language);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      alert('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('标题和内容不能为空');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/books', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookId, title, content, language }),
      });

      if (response.ok) {
        router.push('/books');
      } else {
        alert('保存失败');
      }
    } catch (error) {
      console.error('Save Error:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">编辑文章</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">文章标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="输入文章标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">语言</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as typeof language)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="zh-CN">中文</option>
              <option value="en-US">英文</option>
              <option value="mixed">中英文混合</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">文章内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[300px]"
              placeholder="编辑文章内容，段落之间用空行分隔"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
            <button
              onClick={() => router.push('/books')}
              className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-100 transition"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}