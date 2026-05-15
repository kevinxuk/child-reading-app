/**
 * fill-gz-english.cjs — 添加广州版（教科版）小学英语 2-6 年级
 * 运行: node fill-gz-english.cjs
 */
const fs = require('fs');
const path = require('path');
const DATA_PATH = path.join(__dirname, 'src/data/textbooks-data.json');
const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const entries = [];
function add(grade, semester, num, title, content, type, chapter, translation) {
  const s = semester === '上册' ? '1' : '2';
  const id = 'gzb-' + grade + '-' + s + '-' + String(num).padStart(3, '0');
  const item = {
    id, title, content,
    type: type || 'dialogue',
    grade: String(grade),
    subject: '英语',
    lessonNumber: num,
    chapter, semester
  };
  if (translation) item.translation = translation;
  entries.push(item);
}
