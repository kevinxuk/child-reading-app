/**
 * 课本数据抓取与持久化脚本
 * 
 * 从 /api/textbooks/fetch API 获取课本数据并保存到 textbooks-data.json
 * 
 * 使用方式:
 *   1. 启动 dev server: npm run dev
 *   2. 运行脚本: node save-data.js
 * 
 * 覆盖范围: 小学 1-6 年级 语文/英语 上册/下册
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/api/textbooks/fetch';
const OUTPUT = path.join(__dirname, 'src', 'data', 'textbooks-data.json');

async function fetchData(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parsing failed: ' + e.message)); }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('正在从 API 获取课本数据...');
  try {
    const result = await fetchData(API_URL);
    const textbooks = result.data.textbooks;
    console.log('获取成功! 共', textbooks.length, '篇课文');
    const stats = {};
    for (const l of textbooks) {
      const key = l.grade + '年级' + l.subject + l.semester;
      stats[key] = (stats[key] || 0) + 1;
    }
    for (const [k, v] of Object.entries(stats).sort()) {
      console.log('  ' + k + ': ' + v + '篇');
    }
    fs.writeFileSync(OUTPUT, JSON.stringify(textbooks, null, 2), 'utf8');
    console.log('\n已保存到:', OUTPUT);
  } catch (err) {
    console.error('获取失败:', err.message);
    process.exit(1);
  }
}

main();
