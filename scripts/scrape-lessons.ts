// 运行方式: npx ts-node --esm scripts/scrape-lessons.ts

import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const BASE_URL_YW = 'https://yw.suyang123.com';
const BASE_URL_YY = 'https://yy.suyang123.com';

// 语文年级路径映射
const ywGrades = [
  { grade: '1', semester: 'shang', name: '一年级上册', path: '/xiaoxue/yinianji/shangce.html' },
  { grade: '1', semester: 'xia', name: '一年级下册', path: '/xiaoxue/yinianji/xiace.html' },
  { grade: '2', semester: 'shang', name: '二年级上册', path: '/xiaoxue/ernianji/shangce.html' },
  { grade: '2', semester: 'xia', name: '二年级下册', path: '/xiaoxue/ernianji/xiace.html' },
  { grade: '3', semester: 'shang', name: '三年级上册', path: '/xiaoxue/sannianji/shangce.html' },
  { grade: '3', semester: 'xia', name: '三年级下册', path: '/xiaoxue/sannianji/xiace.html' },
  { grade: '4', semester: 'shang', name: '四年级上册', path: '/xiaoxue/sinianji/shangce.html' },
  { grade: '4', semester: 'xia', name: '四年级下册', path: '/xiaoxue/sinianji/xiace.html' },
  { grade: '5', semester: 'shang', name: '五年级上册', path: '/xiaoxue/wunianji/shangce.html' },
  { grade: '5', semester: 'xia', name: '五年级下册', path: '/xiaoxue/wunianji/xiace.html' },
  { grade: '6', semester: 'shang', name: '六年级上册', path: '/xiaoxue/liunianji/shangce.html' },
  { grade: '6', semester: 'xia', name: '六年级下册', path: '/xiaoxue/liunianji/xiace.html' },
];

interface Lesson {
  id: string;
  title: string;
  author?: string;
  content: string;
  type: 'ancient_poem' | 'modern_poem' | 'prose' | 'fable' | 'legend' | 'other';
  translation?: string;
  notes?: string;
  grade: string;
  subject: '语文' | '英语';
  lessonNumber: number;
  chapter?: string;
  semester: '上册' | '下册';
  audioUrl?: string;
}

interface LessonLink {
  title: string;
  url: string;
  id: string;
  chapter?: string;
}

// 获取课文类型
function getLessonType(title: string): Lesson['type'] {
  const ancientPoemKeywords = ['古诗', '绝句', '咏', '村居', '晓出', '咏柳', '画'];
  const modernPoemKeywords = ['小小的船', '四季', '植物妈妈', '找春天'];
  const fableKeywords = ['寓言', '亡羊补牢', '揠苗助长', '狐假虎威'];
  const legendKeywords = ['传说', '羿射九日', '女娲补天', '盘古开天地'];

  for (const keyword of ancientPoemKeywords) {
    if (title.includes(keyword)) return 'ancient_poem';
  }
  for (const keyword of modernPoemKeywords) {
    if (title.includes(keyword)) return 'modern_poem';
  }
  for (const keyword of fableKeywords) {
    if (title.includes(keyword)) return 'fable';
  }
  for (const keyword of legendKeywords) {
    if (title.includes(keyword)) return 'legend';
  }
  return 'prose';
}

// 从列表页面提取所有课文链接
function parseLessonList(html: string, grade: string, semester: string): LessonLink[] {
  const $ = cheerio.load(html);
  const lessons: LessonLink[] = [];
  let currentChapter = '';
  let lessonCounter = 0;

  // 遍历每个 book-item
  $('.book-item').each((_, bookItem) => {
    const $bookItem = $(bookItem);
    const chapterTitle = $bookItem.find('h1.title').text().trim();
    currentChapter = chapterTitle;

    // 遍历课文链接
    $bookItem.find('.item-box .item a').each((_, link) => {
      const $link = $(link);
      const href = $link.attr('href') || '';
      const title = $link.text().trim();
      
      // 提取ID（如 /xiaoxue/ernianji/402_langdu.html -> 402）
      const idMatch = href.match(/\/(\d+)_langdu\.html$/);
      if (idMatch && !title.includes('语文园地') && !title.includes('快乐读书吧')) {
        lessonCounter++;
        lessons.push({
          title: title.replace(/^\d+\s*/, '').trim(), // 移除序号
          url: href,
          id: idMatch[1],
          chapter: currentChapter,
        });
      }
    });
  });

  return lessons;
}

// 从课文详情页面提取内容和音频
async function parseLessonPage(url: string): Promise<Partial<Lesson>> {
  try {
    const response = await fetch(`${BASE_URL_YW}${url}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    const lesson: Partial<Lesson> = {};

    // 提取标题
    const title = $('h1').first().text().trim();
    lesson.title = title.replace(/课文朗读.*$/, '').trim();

    // 提取作者
    const authorText = $('.content').text();
    const authorMatch = authorText.match(/作者[：:]\s*([^\n]+)/);
    if (authorMatch) {
      lesson.author = authorMatch[1].trim();
    }

    // 提取正文内容 - 尝试多种选择器
    let content = '';
    
    // 尝试查找包含拼音图片的段落
    const contentDiv = $('.content-box, .article-content, .lesson-content, .text-content').first();
    if (contentDiv.length) {
      content = contentDiv.text().trim();
    } else {
      // 尝试提取所有段落
      const paragraphs: string[] = [];
      $('p').each((_, p) => {
        const text = $(p).text().trim();
        if (text.length > 10 && !text.includes('版权') && !text.includes('转载')) {
          paragraphs.push(text);
        }
      });
      content = paragraphs.join('\n\n');
    }

    // 清理内容
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
    
    lesson.content = content;

    // 提取音频URL
    const audioSrc = $('audio').attr('src') || $('source[type="audio/mpeg"]').attr('src');
    if (audioSrc) {
      lesson.audioUrl = audioSrc.startsWith('http') ? audioSrc : `${BASE_URL_YW}${audioSrc}`;
    }

    // 提取译文（如有）
    const translationDiv = $('.translation, .fanyi');
    if (translationDiv.length) {
      lesson.translation = translationDiv.text().trim();
    }

    // 提取注释（如有）
    const notesDiv = $('.notes, .zhushi');
    if (notesDiv.length) {
      lesson.notes = notesDiv.text().trim();
    }

    // 延迟，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));

    return lesson;
  } catch (error) {
    console.error(`Error parsing ${url}:`, error);
    return {};
  }
}

// 主抓取函数
async function scrapeLessons(gradeFilter?: string, semesterFilter?: string) {
  console.log('开始抓取课文数据...\n');

  const allLessons: Lesson[] = [];
  const gradesToScrape = gradeFilter 
    ? ywGrades.filter(g => g.grade === gradeFilter)
    : ywGrades;

  for (const grade of gradesToScrape) {
    if (semesterFilter && grade.semester !== semesterFilter) continue;

    console.log(`\n📚 正在抓取 ${grade.name}...`);
    console.log(`   URL: ${BASE_URL_YW}${grade.path}`);

    try {
      // 获取列表页
      const response = await fetch(`${BASE_URL_YW}${grade.path}`);
      const html = await response.text();

      // 解析课文列表
      const lessonLinks = parseLessonList(html, grade.grade, grade.semester);
      console.log(`   找到 ${lessonLinks.length} 篇课文`);

      // 抓取每篇课文的详情
      let lessonNumber = 1;
      for (const link of lessonLinks) {
        console.log(`   📖 正在抓取: ${link.title}`);
        
        const lessonDetail = await parseLessonPage(link.url);
        
        const lesson: Lesson = {
          id: `${grade.grade}-${grade.semester === 'shang' ? '1' : '2'}-${String(lessonNumber).padStart(3, '0')}`,
          title: lessonDetail.title || link.title,
          author: lessonDetail.author,
          content: lessonDetail.content || '',
          type: getLessonType(link.title),
          translation: lessonDetail.translation,
          notes: lessonDetail.notes,
          grade: grade.grade,
          subject: '语文',
          lessonNumber: lessonNumber,
          chapter: link.chapter,
          semester: grade.semester === 'shang' ? '上册' : '下册',
          audioUrl: lessonDetail.audioUrl,
        };

        if (lesson.content) {
          allLessons.push(lesson);
        }
        lessonNumber++;
      }

      // 每个年级之间暂停
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`   ❌ 抓取失败:`, error);
    }
  }

  return allLessons;
}

// 导出数据
function exportLessonsData(lessons: Lesson[], outputPath: string) {
  const content = `// 自动生成的课文数据 - ${new Date().toISOString()}
// 来源: ${BASE_URL_YW}

import { Lesson } from '@/data/lessons';

export const lessons: Lesson[] = ${JSON.stringify(lessons, null, 2)};

export default lessons;
`;
  fs.writeFileSync(outputPath, content);
  console.log(`\n✅ 已导出 ${lessons.length} 篇课文到 ${outputPath}`);
}

// 命令行运行
async function main() {
  const args = process.argv.slice(2);
  const gradeArg = args.find(a => a.startsWith('--grade='))?.split('=')[1];
  const semesterArg = args.find(a => a.startsWith('--semester='))?.split('=')[1];
  const outputPath = args.find(a => a.startsWith('--output='))?.split('=')[1] 
    || './src/data/lessons-scraped.ts';

  console.log('========================================');
  console.log('    小学语文课文抓取工具');
  console.log('========================================');
  console.log(`年级: ${gradeArg || '全部'}`);
  console.log(`学期: ${semesterArg || '全部'}`);
  console.log(`输出: ${outputPath}`);
  console.log('========================================\n');

  const lessons = await scrapeLessons(gradeArg, semesterArg);
  exportLessonsData(lessons, outputPath);

  console.log('\n📊 统计信息:');
  const byGrade: Record<string, number> = {};
  lessons.forEach(l => {
    byGrade[l.grade] = (byGrade[l.grade] || 0) + 1;
  });
  Object.entries(byGrade).forEach(([grade, count]) => {
    console.log(`   ${grade}年级: ${count} 篇`);
  });
}

// 检查是否直接运行
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { scrapeLessons, parseLessonPage, parseLessonList, exportLessonsData };