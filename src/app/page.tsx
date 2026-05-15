'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface QuickStat {
  totalBooks: number;
  totalCredits: number;
  level: string;
}

interface ReadingRecordPreview {
  id: string;
  book_title?: string;
  book_id: string;
  total_score: number;
  created_at: string;
}

export default function Home() {
  const [stat, setStat] = useState<QuickStat>({ totalBooks: 0, totalCredits: 0, level: '新手' });
  const [recentReadings, setRecentReadings] = useState<ReadingRecordPreview[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/books').then(r => r.json()),
      fetch('/api/credits').then(r => r.json()),
      fetch('/api/scores').then(r => r.json()),
    ]).then(([booksData, creditsData, scoresData]) => {
      setStat({
        totalBooks: (booksData.data || []).length,
        totalCredits: creditsData.data?.points || 0,
        level: creditsData.data?.level || '新手',
      });
      const records: ReadingRecordPreview[] = (scoresData.data || [])
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      setRecentReadings(records);
    }).catch(() => {});
  }, []);

  // 进入页面时预热浏览器 TTS 引擎
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // 立即触发获取（部分浏览器异步加载语音列表）
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          儿童伴读
        </h1>
        
        <p className="text-lg text-gray-500 mb-8">
          AI 智能阅读助手，帮助孩子爱上阅读
        </p>

        {/* Quick Stats Bar */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-10">
          <Link href="/stats" className="flex items-center gap-1.5 px-4 py-2 bg-yellow-50 rounded-full text-sm font-medium text-yellow-700 hover:bg-yellow-100 transition">
            <span>🪙</span> {stat.totalCredits} 积分
          </Link>
          <Link href="/stats" className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 rounded-full text-sm font-medium text-blue-700 hover:bg-blue-100 transition">
            <span>📚</span> {stat.totalBooks} 本书
          </Link>
          <Link href="/stats" className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 rounded-full text-sm font-medium text-purple-700 hover:bg-purple-100 transition">
            <span>⭐</span> {stat.level}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link href="/books" className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="text-lg font-bold mb-2">开始阅读</h3>
            <p className="text-gray-500 text-sm">
              从书架选择书籍，AI 语音朗读，逐段跟读评分
            </p>
          </Link>
          
          <Link href="/books/new" className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="text-4xl mb-3">✏️</div>
            <h3 className="text-lg font-bold mb-2">添加书籍</h3>
            <p className="text-gray-500 text-sm">
              手动输入、上传文件或拍照 OCR 识别添加新书
            </p>
          </Link>
          
          <Link href="/textbooks" className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="text-lg font-bold mb-2">课本库</h3>
            <p className="text-gray-500 text-sm">
              从网络获取小学 1-6 年级语文/英语课本，一键导入书架
            </p>
          </Link>
          
          <Link href="/stats" className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-bold mb-2">学习统计</h3>
            <p className="text-gray-500 text-sm">
              查看阅读记录、积分等级和成就徽章
            </p>
          </Link>
        </div>

        {/* Recent Readings */}
        {recentReadings.length > 0 && (
          <div className="mt-12 text-left max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-700 flex items-center gap-2">
              <span>📖</span> 最近阅读
            </h2>
            <div className="space-y-2">
              {recentReadings.map((record) => (
                <Link
                  key={record.id}
                  href={`/books/${record.book_id}/replays`}
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📝</span>
                    <div>
                      <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">
                        {record.book_title || '未知书籍'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(record.created_at).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${record.total_score >= 88 ? 'text-green-500' : record.total_score >= 60 ? 'text-yellow-500' : 'text-gray-400'}`}>
                    {record.total_score}分
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-3">
              <Link href="/stats" className="text-sm text-blue-500 hover:underline">查看完整统计 →</Link>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-700">如何使用？</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '1', icon: '📥', title: '添加书籍', desc: '手动输入、上传文件或拍照识别' },
              { step: '2', icon: '🔊', title: '听朗读', desc: 'AI 语音朗读示范，学习发音' },
              { step: '3', icon: '🎤', title: '跟读录音', desc: '跟着朗读并录音' },
              { step: '4', icon: '⭐', title: '获得评分', desc: 'AI 多维评分，赚取积分' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center p-4">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3">
                  {item.step}
                </div>
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-medium mb-1">{item.title}</div>
                <div className="text-sm text-gray-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">100%</div>
            <div className="text-sm text-gray-500">免费使用</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">双语</div>
            <div className="text-sm text-gray-500">中英文支持</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">AI</div>
            <div className="text-sm text-gray-500">智能评分</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">隐私</div>
            <div className="text-sm text-gray-500">本地处理</div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>© 2025 儿童伴读 - 基于开源技术构建</p>
        <p className="mt-1">
          Next.js + Tesseract.js + Web Speech API + Meyda
        </p>
      </footer>
    </div>
  );
}
