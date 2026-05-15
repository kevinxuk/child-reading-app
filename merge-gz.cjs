const fs = require('fs');
const path = require('path');

// Read all part files
const base = __dirname;
let parts = [];
for (let g = 2; g <= 6; g++) {
  for (const s of ['上', '下']) {
    const f = path.join(base, `gz-${g}-${s}.json`);
    if (fs.existsSync(f)) {
      const chunk = JSON.parse(fs.readFileSync(f, 'utf8'));
      parts = parts.concat(chunk);
    }
  }
}

// Read main data
const DATA_PATH = path.join(base, 'src/data/textbooks-data.json');
const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const existingIds = new Set(data.map(x => x.id));
let added = 0;
for (const item of parts) {
  if (!existingIds.has(item.id)) {
    data.push(item);
    added++;
  }
}

const remaining = data.filter(x => !x.content || !x.content.trim());
console.log('新增 ' + added + ' 篇广州英语，总量 ' + data.length + ' 篇，剩余 ' + remaining.length + ' 篇空内容');
fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log('已保存到 ' + DATA_PATH);
