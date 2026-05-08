'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { ReadingRecord } from '@/types';

export default function ReplaysPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, [bookId]);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`/api/scores?book_id=${bookId}`);
      const data = await response.json();
      if (data.success) {
        setRecords(data.data || []);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push('/books')}
            className="text-blue-500 hover:underline text-sm mr-4"
          >
            ← 返回书架
          </button>
          <h1 className="text-2xl font-bold">阅读回放</h1>
        </div>

        {records.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500">还没有阅读记录</p>
            <p className="text-gray-400 text-sm mt-2">完成跟读练习后，记录会出现在这里</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                    className="w-full p-5 text-left hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{formatDate(record.created_at)}</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          第 {record.paragraph_index + 1} 段
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-500">{record.total_score}</div>
                          <div className="text-xs text-gray-400">总分</div>
                        </div>
                        <span className={`transform transition ${expandedId === record.id ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </div>
                    </div>
                  </button>

                  {expandedId === record.id && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <div className="grid grid-cols-3 gap-3 my-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-500">{record.accuracy_score}</div>
                          <div className="text-xs text-gray-600">准确度</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-500">{record.fluency_score}</div>
                          <div className="text-xs text-gray-600">流畅度</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-xl font-bold text-purple-500">{record.completion_score}</div>
                          <div className="text-xs text-gray-600">完成度</div>
                        </div>
                      </div>

                      {record.recognized_text && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">识别文字</h4>
                          <p className="text-sm text-gray-800">{record.recognized_text}</p>
                        </div>
                      )}

                      {record.missed_words?.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-red-500">
                            遗漏的词：{record.missed_words.join('、')}
                          </span>
                        </div>
                      )}

                      {record.extra_words?.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-orange-500">
                            多读的词：{record.extra_words.join('、')}
                          </span>
                        </div>
                      )}

                      {record.audio_url && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">🎧 录音回放</h4>
                          <audio
                            src={record.audio_url}
                            controls
                            className="w-full"
                            preload="metadata"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}