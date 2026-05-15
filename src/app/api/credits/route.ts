import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const creditsFile = path.join(dataDir, 'credits.json');

interface CreditsData {
  user_id: string;
  points: number;
  level: string;
  history: { reason: string; amount: number; created_at: string }[];
}

// 积分等级映射
function getLevel(points: number): string {
  if (points >= 5000) return '阅读大师';
  if (points >= 1000) return '阅读专家';
  if (points >= 200) return '阅读达人';
  if (points >= 50) return '阅读爱好者';
  return '新手';
}

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function getCredits(): CreditsData {
  ensureDataDir();
  if (!fs.existsSync(creditsFile)) {
    return { user_id: 'test-user', points: 0, level: '新手', history: [] };
  }
  try {
    const data = JSON.parse(fs.readFileSync(creditsFile, 'utf-8'));
    // 确保 level 字段存在
    if (!data.level) {
      data.level = getLevel(data.points);
    }
    return data;
  } catch {
    return { user_id: 'test-user', points: 0, level: '新手', history: [] };
  }
}

function saveCredits(data: CreditsData) {
  ensureDataDir();
  // 自动更新等级
  data.level = getLevel(data.points);
  fs.writeFileSync(creditsFile, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  const credits = getCredits();
  return NextResponse.json({ success: true, data: credits });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reason, amount = 1 } = body;

    const credits = getCredits();
    credits.points += amount;
    credits.history.push({
      reason: reason || '积分变动',
      amount,
      created_at: new Date().toISOString(),
    });
    saveCredits(credits);

    return NextResponse.json({ success: true, data: credits });
  } catch (error: any) {
    console.error('Credits Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update credits' },
      { status: 500 }
    );
  }
}