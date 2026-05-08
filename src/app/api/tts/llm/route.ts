import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, readFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

interface LLMTTSRequest {
  text: string;
  apiUrl: string;
  apiKey?: string;
  model?: string;
  voice?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
  promptText?: string;
  instruct?: string;
  language?: string;
  enableAudioCache?: boolean;
  responseFormat?: string;
}

async function runCurl(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('curl', args, { timeout: 180000 });
    
    proc.on('close', (code) => {
      if (code === 0 || code === null) {
        resolve();
      } else {
        resolve();
      }
    });
    
    proc.on('error', (err) => {
      console.error('[TTS] spawn error:', err);
      resolve();
    });
  });
}

export async function POST(request: NextRequest) {
  const timestamp = Date.now();
  const tmpJsonPath = join(tmpdir(), `tts-req-${timestamp}.json`);
  const tmpAudioPath = join(tmpdir(), `tts-audio-${timestamp}.wav`);

  try {
    const body: LLMTTSRequest = await request.json();

    if (!body.text || !body.apiUrl) {
      return NextResponse.json(
        { error: '缺少必要参数：text 或apiUrl' },
        { status: 400 }
      );
    }

    const apiUrl = body.apiUrl.endsWith('/v1') 
      ? `${body.apiUrl}/audio/speech` 
      : body.apiUrl;

    const requestBody: Record<string, any> = {
      input: body.text,
      model: body.model || 'Qwen3-TTS-12Hz-1.7B-CustomVoice-4bit',
      voice: body.voice || 'serena',
      response_format: body.responseFormat || 'wav',
      speed: body.speed ?? 1.0,
      language: body.language || 'Chinese',
    };

    if (body.pitch !== undefined) {
      requestBody.pitch = body.pitch;
    }
    if (body.volume !== undefined) {
      requestBody.volume = body.volume;
    }
    if (body.instruct) {
      requestBody.instruct = body.instruct;
    } else if (body.promptText) {
      requestBody.instruct = body.promptText;
    }
    if (body.enableAudioCache) {
      requestBody.enable_audio_cache = true;
    }

    await writeFile(tmpJsonPath, JSON.stringify(requestBody));

    const args: string[] = [
      '-s',
      '-X', 'POST',
      apiUrl,
      '-H', 'Content-Type: application/json',
      '-H', `Authorization: Bearer ${body.apiKey || ''}`,
      '-d', `@${tmpJsonPath}`,
      '--max-time', '120',
      '-o', tmpAudioPath,
    ];

    console.log('[TTS] Calling:', apiUrl);

    await runCurl(args);

    let audioBuffer: Buffer;
    try {
      audioBuffer = await readFile(tmpAudioPath);
    } catch (readError) {
      console.error('[TTS] read error:', readError);
      return NextResponse.json(
        { error: '无法读取音频文件', details: String(readError) },
        { status: 500 }
      );
    }

    if (audioBuffer.length < 100) {
      const errorText = audioBuffer.toString('utf-8');
      console.error('[TTS] Error response:', errorText);
      return NextResponse.json(
        { error: 'LLM TTS API 调用失败', details: errorText },
        { status: 500 }
      );
    }

    console.log('[TTS] Success:', audioBuffer.length, 'bytes');

    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': audioBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('[TTS] Error:', error);
    return NextResponse.json(
      { error: 'LLM TTS 处理失败', details: error?.message || String(error) },
      { status: 500 }
    );
  } finally {
    try {
      await unlink(tmpJsonPath);
    } catch {}
    try {
      await unlink(tmpAudioPath);
    } catch {}
  }
}