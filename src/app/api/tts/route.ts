import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    return NextResponse.json({
      message: '使用浏览器 TTS',
      engine: 'browser',
    });
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    voices: [
      { id: 'zh-CN', name: '中文女声', description: '系统默认中文女声', language: 'zh-CN' },
      { id: 'zh-CN-male', name: '中文男声', description: '系统默认中文男声', language: 'zh-CN' },
    ],
    engine: 'browser',
    available: true,
    message: '使用浏览器内置 TTS',
  });
}