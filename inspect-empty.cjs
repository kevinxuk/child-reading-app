const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/textbooks-data.json', 'utf8'));
const empty = data.filter(x => !x.content || !x.content.trim());
console.log('First 3 empty entries:');
console.log(JSON.stringify(empty.slice(0, 3), null, 2));
console.log('\n---');
// Show id pattern distribution
const groups = {};
for (const l of empty) {
  const prefix = l.id.replace(/-\d+$/, '');
  if (!groups[prefix]) groups[prefix] = [];
  groups[prefix].push(l.id);
}
for (const [k, v] of Object.entries(groups).sort()) {
  console.log(`${k}: ${v.length} items (${v[0]} ~ ${v[v.length-1]})`);
}
