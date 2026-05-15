import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Reward } from '@/types';

const dataDir = path.join(process.cwd(), 'data');
const rewardsFile = path.join(dataDir, 'rewards.json');

const defaultRewards: Reward[] = [
  { id: 'voice-ryan', name: '解锁语音 Ryan (男声-活力)', icon: '🗣️', cost: 10, description: '解锁 TTS 语音 Ryan', created_at: new Date().toISOString() },
  { id: 'voice-aiden', name: '解锁语音 Aiden (男声-阳光)', icon: '🗣️', cost: 10, description: '解锁 TTS 语音 Aiden', created_at: new Date().toISOString() },
  { id: 'theme-night', name: '解锁夜间主题', icon: '🌙', cost: 20, description: '解锁夜间阅读模式', created_at: new Date().toISOString() },
  { id: 'badge-star', name: '获得阅读之星徽章', icon: '⭐', cost: 50, description: '展示阅读之星徽章', created_at: new Date().toISOString() },
];

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function getRewards(): Reward[] {
  ensureDataDir();
  if (!fs.existsSync(rewardsFile)) {
    fs.writeFileSync(rewardsFile, JSON.stringify(defaultRewards, null, 2), 'utf-8');
    return defaultRewards;
  }
  try {
    return JSON.parse(fs.readFileSync(rewardsFile, 'utf-8'));
  } catch {
    return defaultRewards;
  }
}

function saveRewards(rewards: Reward[]) {
  ensureDataDir();
  fs.writeFileSync(rewardsFile, JSON.stringify(rewards, null, 2), 'utf-8');
}

export async function GET() {
  const rewards = getRewards();
  return NextResponse.json({ success: true, data: rewards });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, rewardId } = body;

    // 兑换奖励
    if (action === 'redeem') {
      if (!rewardId) {
        return NextResponse.json({ success: false, error: '奖励 ID 不能为空' }, { status: 400 });
      }

      const rewards = getRewards();
      const reward = rewards.find(r => r.id === rewardId);
      if (!reward) {
        return NextResponse.json({ success: false, error: '奖励不存在' }, { status: 404 });
      }

      // 检查积分
      const creditsPath = path.join(dataDir, 'credits.json');
      let creditsData: { user_id: string; points: number; history: { reason: string; amount: number; created_at: string }[] };
      try {
        creditsData = JSON.parse(fs.readFileSync(creditsPath, 'utf-8'));
      } catch {
        creditsData = { user_id: 'test-user', points: 0, history: [] };
      }

      if (creditsData.points < reward.cost) {
        return NextResponse.json({ success: false, error: '积分不足' }, { status: 400 });
      }

      // 扣减积分
      creditsData.points -= reward.cost;
      creditsData.history.push({
        reason: `兑换「${reward.name}」`,
        amount: -reward.cost,
        created_at: new Date().toISOString(),
      });
      fs.writeFileSync(creditsPath, JSON.stringify(creditsData, null, 2), 'utf-8');

      return NextResponse.json({ success: true, data: { reward, remainingPoints: creditsData.points } });
    }

    // 新增奖励
    const { name, icon, cost, description } = body;

    if (!name || !cost) {
      return NextResponse.json({ success: false, error: '名称和积分不能为空' }, { status: 400 });
    }

    const rewards = getRewards();
    const newReward: Reward = {
      id: `reward-${Date.now()}`,
      name,
      icon: icon || '🎁',
      cost: Number(cost),
      description: description || '',
      created_at: new Date().toISOString(),
    };

    rewards.push(newReward);
    saveRewards(rewards);

    return NextResponse.json({ success: true, data: newReward });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, icon, cost, description } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    const rewards = getRewards();
    const index = rewards.findIndex((r) => r.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Reward not found' }, { status: 404 });
    }

    rewards[index] = {
      ...rewards[index],
      ...(name !== undefined && { name }),
      ...(icon !== undefined && { icon }),
      ...(cost !== undefined && { cost: Number(cost) }),
      ...(description !== undefined && { description }),
    };

    saveRewards(rewards);
    return NextResponse.json({ success: true, data: rewards[index] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
  }

  const rewards = getRewards();
  const filtered = rewards.filter((r) => r.id !== id);

  if (filtered.length === rewards.length) {
    return NextResponse.json({ success: false, error: 'Reward not found' }, { status: 404 });
  }

  saveRewards(filtered);
  return NextResponse.json({ success: true });
}