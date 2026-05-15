const fs = require('fs');
const c = fs.readFileSync('fill-gz-english.cjs', 'utf8');
const lines = c.split('\n');
// Show raw bytes around the problematic area
for (let i = 2552; i <= 2558; i++) {
  const line = lines[i];
  const hex = Buffer.from(line, 'utf8').toString('hex');
  console.log(`L${i+1} (${line.length} chars): ${line.substring(0,60)}`);
  console.log(`  hex: ${hex.substring(0,80)}`);
}
