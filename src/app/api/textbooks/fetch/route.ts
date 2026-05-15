import { NextResponse } from 'next/server';
import { lessons, type Lesson, type Grade, type Subject, type Semester } from '@/data/lessons';
import * as cheerio from 'cheerio';

/**
 * 尝试从电子课本网 (dzkbw.com) 抓取指定年级/学科/学期的课文列表
 */
async function scrapeFromDzkbw(grade: string, subject: string, semester: string): Promise<Partial<Lesson>[] | null> {
  try {
    // 构建URL: http://www.dzkbw.com/books/rjb/{subject-url}/{grade}-{semester}/
    const subjectMap: Record<string, string> = { '语文': 'xiaoxue-yuwen', '英语': 'xiaoxue-yingyu' };
    const semesterMap: Record<string, string> = { '上册': 'shang', '下册': 'xia' };
    const url = `http://www.dzkbw.com/books/rjb/${subjectMap[subject] || 'xiaoxue-yuwen'}/${grade}-${semesterMap[semester] || 'shang'}/`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });

    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);

    const fetchedLessons: Partial<Lesson>[] = [];
    // 电子课本网通常以列表形式展示课文目录
    $('a[href*=".html"], .lesson-item, .catalog-item, li a').each((i: number, el: any) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href') || '';
      if (!text || text.length < 2) return;

      // 尝试提取课号
      const lessonMatch = text.match(/(?:第)?(\d+)\s*(?:课|单元|节)/);
      const lessonNumber = lessonMatch ? parseInt(lessonMatch[1]) : i + 1;

      // 去除课号前缀获取标题
      const title = text.replace(/^(?:第)?\d+\s*(?:课|单元|节)\s*/, '').trim() || text;

      fetchedLessons.push({
        id: `web-${grade}-${semester === '上册' ? '1' : '2'}-${String(lessonNumber).padStart(3, '0')}`,
        title,
        lessonNumber,
        grade: grade as Grade,
        subject: subject as Subject,
        semester: semester as Semester,
        chapter: '课文',
        content: '', // 内容需要进一步抓取
        type: 'prose',
      });
    });

    return fetchedLessons.length > 0 ? fetchedLessons : null;
  } catch {
    return null;
  }
}

/**
 * 尝试从多个公开教育资源网站抓取课本信息
 */
async function fetchFromWeb(): Promise<Lesson[]> {
  const grades = ['1', '2', '3', '4', '5', '6'];
  const subjects: Subject[] = ['语文', '英语'];
  const semesters: Semester[] = ['上册', '下册'];
  const allFetched: Lesson[] = [];

  for (const grade of grades) {
    for (const subject of subjects) {
      for (const semester of semesters) {
        try {
          const fetched = await scrapeFromDzkbw(grade, subject, semester);
          if (fetched && fetched.length > 0) {
            // 尝试获取每篇课文的详细内容
            for (const lesson of fetched) {
              const existing = lessons.find(l =>
                l.grade === lesson.grade &&
                l.subject === lesson.subject &&
                l.semester === lesson.semester &&
                l.lessonNumber === lesson.lessonNumber
              );
              if (existing) {
                // 使用已有数据的内容
                lesson.content = existing.content;
                lesson.type = existing.type;
                lesson.author = existing.author;
                lesson.translation = existing.translation;
                lesson.notes = existing.notes;
                lesson.chapter = existing.chapter || lesson.chapter;
              }
            }
            allFetched.push(...fetched as Lesson[]);
          }
        } catch {
          // 单个抓取失败，继续
        }
      }
    }
  }

  return allFetched;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') || 'auto'; // auto | web | local

  let textbooks: Lesson[] = [];

  if (source === 'web') {
    // 仅从网络获取
    textbooks = await fetchFromWeb();
  } else if (source === 'local') {
    // 仅从本地数据获取
    textbooks = [...lessons];
  } else {
    // auto: 先尝试网络，失败则用本地数据
    try {
      textbooks = await fetchFromWeb();
    } catch {
      textbooks = [...lessons];
    }
    if (textbooks.length === 0) {
      textbooks = [...lessons];
    }
  }

  // 按年级、学科、学期分组
  const groups = textbooks.reduce((acc, lesson) => {
    const key = `${lesson.grade}年级${lesson.semester}${lesson.subject}`;
    if (!acc[key]) {
      acc[key] = { grade: lesson.grade, subject: lesson.subject, semester: lesson.semester, lessons: [] };
    }
    acc[key].lessons.push(lesson);
    return acc;
  }, {} as Record<string, { grade: string; subject: string; semester: string; lessons: Lesson[] }>);

  return NextResponse.json({
    success: true,
    data: {
      textbooks,
      groups: Object.values(groups).sort((a, b) => {
        // 按年级排序
        const gradeOrder = parseInt(a.grade) - parseInt(b.grade);
        if (gradeOrder !== 0) return gradeOrder;
        // 同年级按学科排序：语文优先
        if (a.subject !== b.subject) return a.subject === '语文' ? -1 : 1;
        // 同年级同学科按学期排序：上册优先
        return a.semester === '上册' ? -1 : 1;
      }),
      totalCount: textbooks.length,
      source: textbooks.length > 0 && textbooks.some(l => l.id.startsWith('web-')) ? 'web' : 'local',
    },
  });
}
