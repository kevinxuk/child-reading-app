const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/data/textbooks-data.json','utf8'));

// 只保留gzb相关
const g = d.filter(x => x.id && x.id.startsWith('gzb'));
console.log('广州版总数:', g.length);
console.log('1年级:', g.filter(x=>x.id.startsWith('gzb-1')).length);
console.log('2年级:', g.filter(x=>x.id.startsWith('gzb-2')).length);
console.log('3年级:', g.filter(x=>x.id.startsWith('gzb-3')).length);
console.log('4年级:', g.filter(x=>x.id.startsWith('gzb-4')).length);
console.log('5年级:', g.filter(x=>x.id.startsWith('gzb-5')).length);
console.log('6年级:', g.filter(x=>x.id.startsWith('gzb-6')).length);

// 看看这些条目的标题
[1,2,3,4,5,6].forEach(grd => {
  const items = g.filter(x=>x.id.startsWith('gzb-'+grd));
  if (items.length > 0) {
    console.log('\n=== 年级', grd, '===');
    items.forEach(x => console.log(x.id, '-', x.title));
  }
});
