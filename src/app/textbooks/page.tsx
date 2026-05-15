'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Grade, Subject, Semester } from '@/data/lessons';
import { useStore } from '@/store/useStore';

interface Textbook {
  id: string;
  title: string;
  author?: string;
  content: string;
  type: string;
  translation?: string;
  notes?: string;
  grade: string;
  subject: string;
  lessonNumber: number;
  chapter?: string;
  semester: string;
}

interface TextbookGroup {
  grade: string;
  subject: string;
  semester: string;
  lessons: Textbook[];
}

interface FetchResult {
  textbooks: Textbook[];
  groups: TextbookGroup[];
  totalCount: number;
  source: 'web' | 'local';
}

export default function TextbookLibraryPage() {
  const router = useRouter();
  const { selectedGrade: globalGrade } = useStore();
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState<FetchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState<number>(0);
  const [selectedGrade, setSelectedGrade] = useState<string>(globalGrade);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [dataSource, setDataSource] = useState<'auto' | 'web' | 'local'>('auto');

  // 页面加载时自动获取
  useEffect(() => {
    fetchTextbooks('auto');
  }, []);

  const fetchTextbooks = async (source: 'auto' | 'web' | 'local') => {
    setFetching(true);
    setError(null);
    setDataSource(source);
    try {
      const response = await fetch(`/api/textbooks/fetch?source=${source}`);
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        setSelectedIds(new Set());
      } else {
        setError('获取课本数据失败');
      }
    } catch (e) {
      setError('网络请求失败，请检查网络连接');
    } finally {
      setFetching(false);
    }
  };

  const allTextbooks = result?.textbooks || [];

  // 筛选
  const filteredTextbooks = useMemo(() => {
    return allTextbooks.filter(l => {
      if (selectedGrade !== 'all' && l.grade !== selectedGrade) return false;
      if (selectedSubject !== 'all' && l.subject !== selectedSubject) return false;
      if (selectedSemester !== 'all' && l.semester !== selectedSemester) return false;
      return true;
    });
  }, [allTextbooks, selectedGrade, selectedSubject, selectedSemester]);

  // 分组
  const groupedTextbooks = useMemo(() => {
    return filteredTextbooks.reduce((acc, lesson) => {
      const key = `${lesson.grade}年级${lesson.semester}${lesson.subject}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(lesson);
      return acc;
    }, {} as Record<string, Textbook[]>);
  }, [filteredTextbooks]);

  const allGrades = useMemo(() => {
    const set = new Set(allTextbooks.map(l => l.grade));
    return Array.from(set).sort();
  }, [allTextbooks]);

  const allSubjects = useMemo(() => {
    const set = new Set(allTextbooks.map(l => l.subject));
    return Array.from(set);
  }, [allTextbooks]);

  const allSemesters = useMemo(() => {
    const set = new Set(allTextbooks.map(l => l.semester));
    return Array.from(set);
  }, [allTextbooks]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTextbooks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTextbooks.map(l => l.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleImport = async () => {
    const selected = filteredTextbooks.filter(l => selectedIds.has(l.id));
    if (selected.length === 0) return;

    setImporting(true);
    setImported(0);

    for (let i = 0; i < selected.length; i++) {
      const lesson = selected[i];
      try {
        const response = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `第${lesson.lessonNumber}课 ${lesson.title}${lesson.author ? ` - ${lesson.author}` : ''}`,
            content: lesson.content +
              (lesson.translation ? `\n\n【译文】\n${lesson.translation}` : '') +
              (lesson.notes ? `\n\n【注释】\n${lesson.notes}` : ''),
            language: lesson.subject === '英语' ? 'en-US' : 'zh-CN',
            grade: `${lesson.grade}年级`,
            subject: lesson.subject,
            lesson_number: lesson.lessonNumber,
            chapter: lesson.chapter || '',
            author: lesson.author,
          }),
        });
        if (response.ok) setImported(i + 1);
      } catch (error) {
        console.error(`导入失败: ${lesson.title}`, error);
      }
    }

    setImporting(false);
    router.push('/books');
  };

  const dataSourceLabel = dataSource === 'web' ? '网络' : dataSource === 'local' ? '本地' : '自动';
  const actualSourceLabel = result?.source === 'web' ? '🌐 网络来源' : '📁 本地数据';

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">课本库</h1>
            <p className="text-gray-600 mt-1">
              浏览和导入小学全年级语文、英语课本
              {result && (
                <span className="ml-2 text-sm text-gray-400">
                  ({actualSourceLabel} · 共 {result.totalCount} 篇)
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => fetchTextbooks('auto')}
              disabled={fetching}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-2"
            >
              {fetching ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  获取中...
                </>
              ) : (
                '🔄 从网络获取课本'
              )}
            </button>
            <button
              onClick={() => fetchTextbooks('local')}
              disabled={fetching}
              className="px-4 py-2 border rounded-lg font-medium hover:bg-gray-100 transition disabled:opacity-50"
            >
              📂 使用本地数据
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">筛选条件</h2>
            <div className="flex flex-wrap gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">年级</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                >
                  <option value="all">全部年级</option>
                  {allGrades.map(g => (
                    <option key={g} value={g}>{g}年级</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">学科</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                >
                  <option value="all">全部学科</option>
                  {allSubjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">学期</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                >
                  <option value="all">全部学期</option>
                  {allSemesters.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-4">
              <p className="text-gray-600">
                已选择 <strong className="text-blue-600">{selectedIds.size} 篇课本</strong>（共 {filteredTextbooks.length} 篇）
              </p>
              <button
                onClick={toggleSelectAll}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 transition"
              >
                {selectedIds.size === filteredTextbooks.length ? '取消全选' : '全选'}
              </button>
              {result?.source === 'web' && (
                <span className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded-full border border-green-200">
                  🌐 已从网络获取
                </span>
              )}
            </div>

            {Object.entries(groupedTextbooks).map(([group, groupLessons]) => (
              <div key={group} className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-blue-600">{group}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {groupLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => toggleSelect(lesson.id)}
                      className={`p-3 rounded-lg border transition cursor-pointer ${
                        selectedIds.has(lesson.id)
                          ? 'bg-blue-50 border-blue-400 hover:bg-blue-100'
                          : 'bg-gray-50 border hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(lesson.id)}
                          onChange={() => {}}
                          className="accent-blue-500"
                        />
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                          第{lesson.lessonNumber}课
                        </span>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">
                          {lesson.type === 'ancient_poem' ? '古诗' :
                           lesson.type === 'modern_poem' ? '现代诗' :
                           lesson.type === 'fable' ? '寓言' :
                           lesson.type === 'legend' ? '传说' :
                           lesson.type === 'dialogue' ? '对话' :
                           lesson.type === 'song' ? '歌曲' :
                           lesson.type === 'vocabulary' ? '词汇' :
                           lesson.type === 'revision' ? '复习' : '课文'}
                        </span>
                      </div>
                      <div className="font-medium text-sm ml-6">
                        {lesson.title}
                        {lesson.author && (
                          <span className="text-gray-500 text-xs ml-1">
                            {lesson.author}
                          </span>
                        )}
                      </div>
                      {lesson.chapter && (
                        <div className="text-xs text-gray-400 mt-1 ml-6">
                          {lesson.chapter}
                        </div>
                      )}
                      {!lesson.content && (
                        <div className="text-xs text-orange-500 mt-1 ml-6">
                          ⚠️ 需从本地补充内容
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {importing && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all"
                    style={{ width: `${selectedIds.size > 0 ? (imported / selectedIds.size) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-center text-gray-600 mt-2">
                  已导入 {imported} / {selectedIds.size} 篇课本
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleImport}
                disabled={importing || selectedIds.size === 0}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? '正在导入...' : `导入 ${selectedIds.size} 篇课本到书架`}
              </button>
              <button
                onClick={() => router.push('/books')}
                className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-100 transition"
              >
                返回书架
              </button>
            </div>
          </div>
        )}

        {!result && !fetching && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-xl font-bold mb-2">小学全年级课本库</h2>
            <p className="text-gray-600 mb-6">
              点击「从网络获取课本」按钮，从互联网获取小学1-6年级语文和英语课本信息。
              <br />
              也可以点击「使用本地数据」直接浏览已内置的课文内容。
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => fetchTextbooks('auto')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
              >
                🌐 从网络获取课本
              </button>
              <button
                onClick={() => fetchTextbooks('local')}
                className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-100 transition"
              >
                📁 使用本地数据
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
