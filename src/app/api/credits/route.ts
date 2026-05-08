import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const creditsFile = path.join(dataDir, 'credits.json');

interface CreditsData {
  user_id: string;
  points: number;
  history: { reason: string; amount: number; created_at: string }[];
}

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function getCredits(): CreditsData {
  ensureDataDir();
  if (!fs.existsSync(creditsFile)) {
    return { user_id: 'test-user', points: 0, history: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(creditsFile, 'utf-8'));
  } catch {
    return { user_id: 'test-user', points: 0, history: [] };
  }
}

function saveCredits(data: CreditsData) {
  ensureDataDir();
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