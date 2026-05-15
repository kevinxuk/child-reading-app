const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/data/textbooks-data.json', 'utf8'));
const g = d.filter(x => x.id && x.id.indexOf('gzb') === 0);
console.log(JSON.stringify(g[0], null, 2));
