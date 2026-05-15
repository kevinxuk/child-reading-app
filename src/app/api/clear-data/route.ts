import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export async function POST(request: Request) {
  try {
    const { type } = await request.json();

    if (type === 'all' || type === 'stats') {
      // 清理阅读记录
      const recordsFile = path.join(dataDir, 'records.json');
      if (fs.existsSync(recordsFile)) {
        fs.writeFileSync(recordsFile, '[]', 'utf-8');
      }

      // 清理用户积分数据
      const scoresFile = path.join(dataDir, 'scores.json');
      if (fs.existsSync(scoresFile)) {
        fs.writeFileSync(scoresFile, '[]', 'utf-8');
      }

      // 清理积分/等级数据
      const creditsFile = path.join(dataDir, 'credits.json');
      if (fs.existsSync(creditsFile)) {
        const resetCredits = {
          user_id: 'test-user',
          points: 0,
          level: '新手',
          history: [],
        };
        fs.writeFileSync(creditsFile, JSON.stringify(resetCredits, null, 2), 'utf-8');
      }

      // 清理音频文件
      const audioDir = path.join(dataDir, 'audio');
      if (fs.existsSync(audioDir)) {
        const files = fs.readdirSync(audioDir);
        for (const file of files) {
          const filePath = path.join(audioDir, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        }
      }
    }

    if (type === 'all' || type === 'books') {
      // 清理用户自定义书籍（不清理教材数据）
      const booksFile = path.join(dataDir, 'books.json');
      if (fs.existsSync(booksFile)) {
        fs.writeFileSync(booksFile, '[]', 'utf-8');
      }

      // 清理奖励数据
      const rewardsFile = path.join(dataDir, 'rewards.json');
      if (fs.existsSync(rewardsFile)) {
        const resetRewards = { points: 0, claimedRewards: [] };
        fs.writeFileSync(rewardsFile, JSON.stringify(resetRewards, null, 2), 'utf-8');
      }
    }

    return NextResponse.json({ success: true, message: '数据已清理' });
  } catch (error: any) {
    console.error('Clear Data Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || '清理失败' },
      { status: 500 }
    );
  }
}
