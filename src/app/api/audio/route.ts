import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

const audioDir = path.join(process.cwd(), 'data', 'audio');

function ensureAudioDir() {
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No audio file' }, { status: 400 });
    }

    const id = `audio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const ext = file.name.endsWith('.webm') ? '.webm' : file.name.endsWith('.wav') ? '.wav' : '.webm';
    const filename = `${id}${ext}`;
    const filePath = path.join(audioDir, filename);

    ensureAudioDir();
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, data: { id: filename, url: `/api/audio/${filename}` } });
  } catch (error: any) {
    console.error('Audio upload error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Upload failed' }, { status: 500 });
  }
}