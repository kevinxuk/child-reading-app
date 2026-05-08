import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const audioDir = path.join(process.cwd(), 'data', 'audio');

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: filename } = await params;
  const filePath = path.join(audioDir, filename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ success: false, error: 'Audio not found' }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const contentType = ext === '.wav' ? 'audio/wav' : ext === '.mp3' ? 'audio/mpeg' : 'audio/webm';

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'public, max-age=86400',
    },
  });
}