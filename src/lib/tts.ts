export type TTSEngine = 'browser' | 'llm';

export const LANGUAGE_MAP: Record<string, { ttsLanguage: string; browserLang: string; asrLang: string; label: string }> = {
  'zh-CN': { ttsLanguage: 'Chinese', browserLang: 'zh-CN', asrLang: 'zh-CN', label: '中文' },
  'en-US': { ttsLanguage: 'English', browserLang: 'en-US', asrLang: 'en-US', label: '英文' },
  'mixed':  { ttsLanguage: 'Auto', browserLang: 'zh-CN', asrLang: 'zh-CN', label: '中英混合' },
};

export function bookLanguageToTTS(bookLanguage: string): string {
  return LANGUAGE_MAP[bookLanguage]?.ttsLanguage ?? 'Chinese';
}

export function bookLanguageToBrowserLang(bookLanguage: string): string {
  return LANGUAGE_MAP[bookLanguage]?.browserLang ?? 'zh-CN';
}

export interface TTSOptions {
  lang?: 'zh-CN' | 'en-US';
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
  engine?: TTSEngine;
  llmConfig?: {
    apiUrl: string;
    apiKey: string;
    model: string;
    voice: string;
    speed: number;
    pitch?: number;
    volume?: number;
    promptText?: string;
    instruct?: string;
    language?: string;
    enableAudioCache?: boolean;
    responseFormat?: string;
  };
}

export interface Voice {
  id: string;
  name: string;
  lang: string;
}

export interface TTSStatus {
  available: boolean;
  engine: 'browser' | 'llm';
  message?: string;
}

export async function checkTTSStatus(): Promise<TTSStatus> {
  return {
    available: true,
    engine: 'browser',
    message: '使用浏览器内置 TTS',
  };
}

// 浏览器 SpeechSynthesis 暖机标记（防止首次朗读吞字）
let _warmupPromise: Promise<void> | null = null;

/**
 * 冷启动时用一段极短的静音文本激活语音引擎，
 * 避免后续正式朗读时因音频硬件初始化延迟导致头几个字被吞。
 */
async function _ensureEngineWarm(): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (_warmupPromise) return _warmupPromise;

  _warmupPromise = new Promise((resolve) => {
    // 先确保 voice 列表已加载
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // 某些浏览器需要事件触发才能加载 voice 列表
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }

    let warmedUp = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // 用极短且近无声的短语做暖机
    const primer = new SpeechSynthesisUtterance('.');
    primer.volume = 0.01;       // 几乎静音但足以激活引擎
    primer.rate = 3;            // 快速读完
    primer.onend = () => {
      clearTimeout(timer);
      warmedUp = true;
      // 不调用 cancel()：暖机只是激活引擎，不要干扰后续朗读
      resolve();
    };
    primer.onerror = () => {
      clearTimeout(timer);
      warmedUp = true;
      resolve();
    };
    window.speechSynthesis.speak(primer);

    // 兜底超时：暖机已完成则跳过 cancel，避免误杀后续朗读
    timer = setTimeout(() => {
      if (!warmedUp) {
        window.speechSynthesis.cancel();
      }
      resolve();
    }, 300);
  });

  return _warmupPromise;
}

export function speak(text: string, options: TTSOptions = {}): Promise<void> {
  const engine = options.engine ?? 'browser';

  if (engine === 'llm' && options.llmConfig?.apiUrl) {
    return speakWithLLM(text, options);
  }

  return speakWithBrowserTTS(text, options);
}

async function speakWithBrowserTTS(text: string, options: TTSOptions): Promise<void> {
  // 暖机：防止首段朗读时前面几个字被吞掉
  await _ensureEngineWarm();

  // 先取消任何正在播放的语音，防止 interrupt 错误
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'zh-CN';
    utterance.rate = options.rate ?? 0.9;
    utterance.pitch = options.pitch ?? 1.1;
    utterance.volume = options.volume ?? 1;

    if (options.voice) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.name === options.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      const msg = (e as SpeechSynthesisErrorEvent).error || 'unknown';
      // "interrupted" 是预期行为（例如手动 stopSpeaking 或被后续朗读打断），不算错误
      if (msg === 'interrupted') {
        resolve();
      } else {
        reject(new Error(`Speech synthesis error: ${msg}`));
      }
    };

    window.speechSynthesis.speak(utterance);
  });
}

function padTextForTTS(text: string, language?: string): string {
  const suffix = (language === 'English') ? '. ' : '。';
  if (text.trimEnd().endsWith(suffix.trim())) return text;
  return text + suffix;
}

async function speakWithLLM(text: string, options: TTSOptions): Promise<void> {
  const config = options.llmConfig;
  if (!config?.apiUrl) {
    throw new Error('LLM TTS 配置缺失');
  }

  const paddedText = padTextForTTS(text, config.language);

  try {
    const response = await fetch('/api/tts/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: paddedText,
        apiUrl: config.apiUrl,
        apiKey: config.apiKey,
        model: config.model,
        voice: config.voice,
        speed: config.speed ?? 1.0,
        pitch: config.pitch,
        volume: config.volume,
        promptText: config.promptText,
        instruct: config.instruct,
        language: config.language,
        enableAudioCache: config.enableAudioCache,
        responseFormat: config.responseFormat,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error('音频播放失败'));
      };
      audio.play();
    });
  } catch (error) {
    console.error('LLM TTS Error:', error);
    return speakWithBrowserTTS(text, options);
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function getVoices(lang?: string): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const allVoices = window.speechSynthesis.getVoices();
  if (lang) {
    const prefix = lang.split('-')[0];
    const filtered = allVoices.filter(v => v.lang.startsWith(prefix));
    return filtered.length > 0 ? filtered : allVoices.filter(v => v.lang.startsWith('zh') || v.lang.startsWith('en'));
  }
  return allVoices.filter(v => v.lang.startsWith('zh') || v.lang.startsWith('en'));
}