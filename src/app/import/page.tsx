'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { lessons, type Grade, type Subject, type Semester } from '@/data/lessons';

export default function ImportLessonsPage() {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState<number>(0);
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  const [selectedSemester, setSelectedSemester] = useState<Semester | 'all'>('all');

  const grades: Grade[] = ['1', '2', '3', '4', '5', '6'];
  const subjects: Subject[] = ['语文', '英语'];
  const semesters: Semester[] = ['上册', '下册'];

  const filteredLessons = lessons.filter(lesson => {
    if (selectedGrade !== 'all' && lesson.grade !== selectedGrade) return false;
    if (selectedSubject !== 'all' && lesson.subject !== selectedSubject) return false;
    if (selectedSemester !== 'all' && lesson.semester !== selectedSemester) return false;
    return true;
  });

  const groupedLessons = filteredLessons.reduce((acc, lesson) => {
    const key = `${lesson.grade}年级${lesson.semester}${lesson.subject}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(lesson);
    return acc;
  }, {} as Record<string, typeof lessons>);

  const handleImport = async () => {
    setImporting(true);
    setImported(0);

    for (let i = 0; i < filteredLessons.length; i++) {
      const lesson = filteredLessons[i];
      
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
            author: lesson.author,
          }),
        });

        if (response.ok) {
          setImported(i + 1);
        }
      } catch (error) {
        console.error(`导入失败: ${lesson.title}`, error);
      }
    }

    setImporting(false);
    router.push('/books');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">导入课文</h1>
        <p className="text-gray-600 mb-6">从教材数据导入课文到书架</p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">筛选条件</h2>
          
          <div className="flex flex-wrap gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">年级</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as Grade | 'all')}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-w-[120px]"
              >
                <option value="all">全部年级</option>
                {grades.map(g => (
                  <option key={g} value={g}>{g}年级</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">学科</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as Subject | 'all')}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-w-[120px]"
              >
                <option value="all">全部学科</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">学期</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value as Semester | 'all')}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-w-[120px]"
              >
                <option value="all">全部学期</option>
                {semesters.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              已选择 <strong className="text-blue-600">{filteredLessons.length} 篇课文</strong> 进行导入
            </p>
          </div>

          {Object.entries(groupedLessons).map(([group, groupLessons]) => (
            <div key={group} className="mb-6">
              <h3 className="text-lg font-bold mb-3 text-blue-600">{group}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {groupLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                        第{lesson.lessonNumber}课
                      </span>
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">
                        {lesson.type === 'ancient_poem' ? '古诗' : 
                         lesson.type === 'modern_poem' ? '现代诗' : 
                         lesson.type === 'fable' ? '寓言' : 
                         lesson.type === 'legend' ? '传说' : '课文'}
                      </span>
                    </div>
                    <div className="font-medium text-sm">
                      {lesson.title}
                      {lesson.author && (
                        <span className="text-gray-500 text-xs ml-1">
                          {lesson.author}
                        </span>
                      )}
                    </div>
                    {lesson.chapter && (
                      <div className="text-xs text-gray-400 mt-1">
                        {lesson.chapter}
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
                  style={{ width: `${(imported / filteredLessons.length) * 100}%` }}
                />
              </div>
              <p className="text-center text-gray-600 mt-2">
                已导入 {imported} / {filteredLessons.length} 篇课文
              </p>
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={handleImport}
              disabled={importing || filteredLessons.length === 0}
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? '正在导入...' : `导入 ${filteredLessons.length} 篇课文`}
            </button>
            <button
              onClick={() => router.push('/books')}
              className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-100 transition"
            >
              返回书架
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}