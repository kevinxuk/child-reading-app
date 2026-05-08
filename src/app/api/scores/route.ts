import { NextResponse } from 'next/server';
import type { ReadingRecord, UserScore } from '@/types';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const recordsFile = path.join(dataDir, 'records.json');
const scoresFile = path.join(dataDir, 'scores.json');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function getRecords(): ReadingRecord[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(recordsFile)) return [];
    const data = fs.readFileSync(recordsFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveRecords(records: ReadingRecord[]) {
  ensureDataDir();
  fs.writeFileSync(recordsFile, JSON.stringify(records, null, 2), 'utf-8');
}

function getScores(): UserScore[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(scoresFile)) return [];
    const data = fs.readFileSync(scoresFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveScores(scores: UserScore[]) {
  ensureDataDir();
  fs.writeFileSync(scoresFile, JSON.stringify(scores, null, 2), 'utf-8');
}

function getOrCreateUserScore(userId: string): UserScore {
  const scores = getScores();
  let score = scores.find((s) => s.user_id === userId);

  if (!score) {
    score = {
      id: Date.now().toString(),
      user_id: userId,
      total_points: 0,
      level: '新手',
      reading_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    scores.push(score);
    saveScores(scores);
  }

  return score;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get('book_id');
  const userId = searchParams.get('user_id') || 'test-user';

  const records = getRecords();
  const filtered = bookId
    ? records.filter((r) => r.book_id === bookId)
    : records.filter((r) => r.user_id === userId);

  const score = getOrCreateUserScore(userId);

  return NextResponse.json({
    success: true,
    data: bookId ? filtered : { score, records: filtered },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      book_id,
      book_title,
      paragraph_index,
      recognized_text,
      accuracy_score,
      fluency_score,
      completion_score,
      total_score,
      missed_words,
      extra_words,
      audio_url,
    } = body;

    const userId = 'test-user';

    const records = getRecords();
    const record: ReadingRecord = {
      id: Date.now().toString(),
      user_id: userId,
      book_id,
      book_title: book_title || '',
      paragraph_index: paragraph_index ?? 0,
      audio_url: audio_url || '',
      recognized_text,
      accuracy_score,
      fluency_score,
      completion_score,
      total_score,
      missed_words: missed_words || [],
      extra_words: extra_words || [],
      credit_awarded: total_score >= 88,
      duration: 0,
      created_at: new Date().toISOString(),
    };

    records.push(record);
    saveRecords(records);

    const scores = getScores();
    const userScoreIndex = scores.findIndex((s) => s.user_id === userId);

    if (userScoreIndex === -1) {
      const newScore: UserScore = {
        id: Date.now().toString(),
        user_id: userId,
        total_points: total_score,
        level: total_score >= 100 ? '阅读达人' : '新手',
        reading_count: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      scores.push(newScore);
    } else {
      scores[userScoreIndex].total_points += total_score;
      scores[userScoreIndex].reading_count += 1;
      scores[userScoreIndex].updated_at = new Date().toISOString();

      const points = scores[userScoreIndex].total_points;
      if (points >= 1000) {
        scores[userScoreIndex].level = '阅读专家';
      } else if (points >= 500) {
        scores[userScoreIndex].level = '阅读达人';
      }
    }
    saveScores(scores);

    const userScore = scores.find((s) => s.user_id === userId);

    return NextResponse.json({
      success: true,
      data: {
        record,
        total_points: userScore?.total_points || 0,
        level: userScore?.level || '新手',
      },
    });
  } catch (error: any) {
    console.error('Save Score Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save score' },
      { status: 500 }
    );
  }
}