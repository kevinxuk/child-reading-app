// 课本数据已从内联代码迁移到 textbooks-data.json
// 由 /api/textbooks/fetch 接口抓取并持久化
// 运行 node save-data.js 可重新抓取并更新

import data from './textbooks-data.json';

export type Grade = '1' | '2' | '3' | '4' | '5' | '6';
export type Subject = '语文' | '英语';
export type LessonType = 'ancient_poem' | 'modern_poem' | 'prose' | 'fable' | 'legend' | 'list' | 'dialogue' | 'song' | 'rhyme' | 'story' | 'vocabulary' | 'revision' | 'names';
export type Semester = '上册' | '下册';

export interface Lesson {
  id: string;
  title: string;
  author?: string;
  content: string;
  type: LessonType;
  translation?: string;
  notes?: string;
  grade: Grade;
  subject: Subject;
  lessonNumber: number;
  chapter?: string;
  semester: Semester;
  audioUrl?: string;
}

export const lessons: Lesson[] = data as Lesson[];

export default lessons;
