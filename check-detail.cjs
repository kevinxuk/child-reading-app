const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/data/textbooks-data.json', 'utf8'));

const g = d.filter(x => x.id && x.id.indexOf('gzb') === 0);

console.log('总计广州版条目: ' + g.length);
console.log('');

// 按年级-学期分组
const groups = {};
g.forEach(x => {
  const k = (x.grade || '?') + '-' + (x.semester || '?');
  if (!groups[k]) groups[k] = [];
  groups[k].push(x);
});

Object.keys(groups).sort().forEach(k => {
  const items = groups[k];
  console.log(k + ': ' + items.length + ' 篇');
  items.forEach(x => console.log('  ' + x.id + ' - ' + x.title));
  console.log('');
});

// 检查哪些内容可能是之前AI生成的 vs 新的
// 看translations是否存在
console.log('---');
let hasT = 0, noT = 0;
g.forEach(x => {
  if (x.translation) hasT++; else noT++;
});
console.log('有翻译: ' + hasT + ', 无翻译: ' + noT);
