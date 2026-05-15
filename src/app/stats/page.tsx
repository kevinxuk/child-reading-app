'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Book, ReadingRecord } from '@/types';

interface StatData {
  totalBooks: number;
  completedBooks: number;
  totalReadings: number;
  totalCredits: number;
  level: string;
  averageScore: number;
  recentRecords: ReadingRecord[];
  bookScores: Record<string, { title: string; scores: number[]; avg: number }>;
  weeklyData: { day: string; count: number }[];
  creditHistory: { reason: string; amount: number; created_at: string }[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [booksRes, scoresRes, creditsRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/scores'),
        fetch('/api/credits'),
      ]);

      const booksData = await booksRes.json();
      const scoresData = await scoresRes.json();
      const creditsData = await creditsRes.json();

      const books: Book[] = booksData.data || [];
      const records: ReadingRecord[] = scoresData.data?.records || [];
      const credits = creditsData.data?.points || 0;
      const level = creditsData.data?.level || '新手';
      const creditHistory = creditsData.data?.history || [];

      const completedBooks = books.filter(b => b.completed).length;
      const totalReadings = records.length;

      const totalScoreSum = records.reduce((sum, r) => sum + r.total_score, 0);
      const averageScore = totalReadings > 0 ? Math.round(totalScoreSum / totalReadings) : 0;

      // 每本书的评分统计
      const bookScores: Record<string, { title: string; scores: number[]; avg: number }> = {};
      records.forEach(r => {
        const key = r.book_id;
        if (!bookScores[key]) {
          bookScores[key] = { title: r.book_title || '未知', scores: [], avg: 0 };
        }
        bookScores[key].scores.push(r.total_score);
      });
      Object.values(bookScores).forEach(bs => {
        bs.avg = Math.round(bs.scores.reduce((a, b) => a + b, 0) / bs.scores.length);
      });

      // 最近 10 条记录
      const recentRecords = [...records]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      // 本周每天阅读次数
      const weeklyData = getWeeklyData(records);

      setStats({
        totalBooks: books.length,
        completedBooks,
        totalReadings,
        totalCredits: credits,
        level,
        averageScore,
        recentRecords,
        bookScores,
        weeklyData,
        creditHistory,
      });
    } catch (error) {
      console.error('Stats Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeeklyData = (records: ReadingRecord[]) => {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const data: { day: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const dayStr = days[day.getDay()];
      const dayStart = new Date(day);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      const count = records.filter(r => {
        const d = new Date(r.created_at);
        return d >= dayStart && d <= dayEnd;
      }).length;

      data.push({ day: `周${dayStr}`, count });
    }
    return data;
  };

  const getLevelInfo = (level: string) => {
    const levels: Record<string, { icon: string; color: string; next: string; range: string }> = {
      '新手': { icon: '🌱', color: 'text-green-500', next: '阅读爱好者', range: '0-50' },
      '阅读爱好者': { icon: '📖', color: 'text-blue-500', next: '阅读达人', range: '50-200' },
      '阅读达人': { icon: '⭐', color: 'text-yellow-500', next: '阅读专家', range: '200-1000' },
      '阅读专家': { icon: '🏆', color: 'text-purple-500', next: '阅读大师', range: '1000-5000' },
      '阅读大师': { icon: '👑', color: 'text-orange-500', next: '最高等级', range: '5000+' },
    };
    return levels[level] || levels['新手'];
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-50';
    if (score >= 80) return 'bg-blue-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">📊</div>
          <p className="text-gray-500">加载统计数据中...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">加载失败</p>
      </div>
    );
  }

  const levelInfo = getLevelInfo(stats.level);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl sm:text-3xl">{levelInfo.icon}</span>
                <h1 className="text-xl sm:text-2xl font-bold truncate">{stats.level}</h1>
              </div>
              <p className="text-white/80 text-xs sm:text-sm">
                {levelInfo.next !== '最高等级' ? `距 ${levelInfo.next} 还需继续努力` : '已达到最高等级！'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl sm:text-3xl font-bold">🪙 {stats.totalCredits}</div>
              <div className="text-white/80 text-xs sm:text-sm">累计积分</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, (stats.totalCredits / 1000) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 -mt-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.totalBooks}</div>
            <div className="text-sm text-gray-500">书籍总数</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.completedBooks}</div>
            <div className="text-sm text-gray-500">已读完成</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{stats.totalReadings}</div>
            <div className="text-sm text-gray-500">朗读次数</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
              {stats.averageScore}
            </div>
            <div className="text-sm text-gray-500">平均得分</div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <h2 className="text-lg font-bold mb-4">📅 本周阅读活动</h2>
          <div className="flex items-end justify-between gap-2 h-32">
            {stats.weeklyData.map((d, i) => {
              const maxCount = Math.max(...stats.weeklyData.map(w => w.count), 1);
              const height = (d.count / maxCount) * 100;
              const isToday = i === new Date().getDay();
              return (
                <div key={d.day} className="flex flex-col items-center flex-1">
                  <div className="text-xs text-gray-500 mb-1">
                    {d.count > 0 ? d.count : ''}
                  </div>
                  <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '80px' }}>
                    <div
                      className={`absolute bottom-0 w-full rounded-t transition-all ${
                        isToday ? 'bg-blue-500' : d.count > 0 ? 'bg-blue-300' : 'bg-gray-200'
                      }`}
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                  <div className={`text-xs mt-1 ${isToday ? 'font-bold text-blue-600' : 'text-gray-400'}`}>
                    {d.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Book Scores */}
        {Object.keys(stats.bookScores).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h2 className="text-lg font-bold mb-4">📚 书籍评分排名</h2>
            <div className="space-y-3">
              {Object.entries(stats.bookScores)
                .sort(([, a], [, b]) => b.avg - a.avg)
                .slice(0, 5)
                .map(([bookId, bs]) => (
                  <Link
                    key={bookId}
                    href={`/read/${bookId}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {bs.avg >= 90 ? '🌟' : bs.avg >= 80 ? '⭐' : bs.avg >= 60 ? '📝' : '💪'}
                      </span>
                      <div>
                        <div className="font-medium text-sm">{bs.title}</div>
                        <div className="text-xs text-gray-400">朗读 {bs.scores.length} 次</div>
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${getScoreColor(bs.avg)}`}>
                      {bs.avg}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Recent Records */}
        {stats.recentRecords.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h2 className="text-lg font-bold mb-4">🕐 最近朗读记录</h2>
            <div className="space-y-2">
              {stats.recentRecords.map((record) => (
                <div
                  key={record.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${getScoreBg(record.total_score)}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">{formatDate(record.created_at)}</span>
                    <div>
                      <div className="text-sm font-medium">{record.book_title || '未知'}</div>
                      <div className="text-xs text-gray-400">第 {record.paragraph_index + 1} 段</div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${getScoreColor(record.total_score)}`}>
                    {record.total_score}分
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-bold mb-4">🏅 成就徽章</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: '初次朗读', icon: '🐣', unlocked: stats.totalReadings >= 1 },
              { name: '朗读10次', icon: '🎤', unlocked: stats.totalReadings >= 10 },
              { name: '朗读50次', icon: '🎙️', unlocked: stats.totalReadings >= 50 },
              { name: '完成1本书', icon: '📗', unlocked: stats.completedBooks >= 1 },
              { name: '完成5本书', icon: '📚', unlocked: stats.completedBooks >= 5 },
              { name: '得分90+', icon: '🌟', unlocked: stats.recentRecords.some(r => r.total_score >= 90) },
              { name: '积分50+', icon: '🪙', unlocked: stats.totalCredits >= 50 },
              { name: '积分200+', icon: '💎', unlocked: stats.totalCredits >= 200 },
              { name: '阅读达人', icon: '⭐', unlocked: stats.level === '阅读达人' || stats.level === '阅读专家' || stats.level === '阅读大师' },
              { name: '阅读专家', icon: '🏆', unlocked: stats.level === '阅读专家' || stats.level === '阅读大师' },
              { name: '阅读大师', icon: '👑', unlocked: stats.level === '阅读大师' },
              { name: '满分', icon: '💯', unlocked: stats.recentRecords.some(r => r.total_score >= 100) },
            ].map((badge) => (
              <div
                key={badge.name}
                className={`text-center p-3 rounded-lg transition ${
                  badge.unlocked
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-gray-50 opacity-40 grayscale'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs text-gray-600">{badge.name}</div>
                {badge.unlocked && <div className="text-xs text-yellow-500 mt-0.5">✓</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Credit History */}
        {stats.creditHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-bold mb-4">🪙 积分记录</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[...stats.creditHistory]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 20)
                .map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-700">{item.reason}</div>
                      <div className="text-xs text-gray-400">{formatDate(item.created_at)}</div>
                    </div>
                    <div className={`font-bold text-lg ${item.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.amount > 0 ? '+' : ''}{item.amount}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
