const fs = require('fs');
const filePath = 'src/data/textbooks-data.json';
const d = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const before = d.length;
console.log('清洗前总数:', before);

// 删除 gzb-1- 和 gzb-2- 开头的条目
const cleaned = d.filter(x => {
  if (x.id && (x.id.startsWith('gzb-1') || x.id.startsWith('gzb-2'))) {
    return false;
  }
  return true;
});

console.log('删除条数:', before - cleaned.length);
console.log('清洗后总数:', cleaned.length);

// 确认剩余的广州版条目
const g = cleaned.filter(x => x.id && x.id.startsWith('gzb'));
console.log('剩余广州版条目:');
[3,4,5,6].forEach(grd => {
  const items = g.filter(x=>x.id.startsWith('gzb-'+grd));
  console.log(grd+'年级: '+items.length+' 篇');
});

fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf8');
console.log('\n✅ 已保存');
