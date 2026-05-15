import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(__dirname, 'src/data/textbooks-data.json'), 'utf8'));

let empty = data.filter(x => !x.content || !x.content.trim());
let has = data.filter(x => x.content && x.content.trim());

console.log('有内容课文:', has.length);
console.log('空内容课文:', empty.length);
console.log('');

for (let l of empty) {
  console.log(`  [${l.id}] ${l.title} (${l.grade}年级${l.subject}${l.semester})`);
}
