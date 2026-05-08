export interface ASROptions {
  lang?: 'zh-CN' | 'en-US';
  continuous?: boolean;
  interimResults?: boolean;
  phrases?: string[];
}

export interface ASRResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractWords(text: string): string[] {
  const words: string[] = [];
  let currentWord = '';
  
  for (const char of text) {
    if (/[\u4e00-\u9fa5]/.test(char)) {
      if (currentWord) {
        words.push(currentWord);
        currentWord = '';
      }
      words.push(char);
    } else if (/[a-zA-Z0-9]/.test(char)) {
      currentWord += char;
    } else if (char === ' ' && currentWord) {
      words.push(currentWord);
      currentWord = '';
    }
  }
  
  if (currentWord) {
    words.push(currentWord);
  }
  
  return words.filter(w => w.length > 0);
}

export function startRecognition(
  onResult: (text: string, isFinal: boolean, confidence: number) => void,
  onError?: (error: string) => void,
  options: ASROptions = {}
): () => void {
  const win = window as typeof window & {
    SpeechRecognition?: new () => { lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number; grammars?: unknown; onresult: unknown; onerror: unknown; start(): void; stop(): void };
    webkitSpeechRecognition?: new () => { lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number; grammars?: unknown; onresult: unknown; onerror: unknown; start(): void; stop(): void };
  };
  
  const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
  
  if (!SpeechRecognitionClass) {
    onError?.('Speech recognition not supported');
    return () => {};
  }

  const recognition = new SpeechRecognitionClass();
  recognition.lang = options.lang || 'zh-CN';
  recognition.continuous = options.continuous ?? true;
  recognition.interimResults = options.interimResults ?? true;
  (recognition as { maxAlternatives: number }).maxAlternatives = 3;

  if (options.phrases && options.phrases.length > 0) {
    try {
      const winWithGrammar = window as typeof window & {
        webkitSpeechGrammarList?: new () => { addFromString(s: string, w?: number): void };
        SpeechGrammarList?: new () => { addFromString(s: string, w?: number): void };
      };
      
      const SpeechGrammarListClass = winWithGrammar.webkitSpeechGrammarList || winWithGrammar.SpeechGrammarList;
      
      if (SpeechGrammarListClass) {
        const grammar = `#JSGF V1.0; grammar phrases; public <phrase> = ${options.phrases.join(' | ')} ;`;
        const grammarList = new SpeechGrammarListClass();
        grammarList.addFromString(grammar, 1);
        (recognition as { grammars?: unknown }).grammars = grammarList;
      }
    } catch {
      // Grammar not supported
    }
  }

  const recognitionWithHandlers = recognition as typeof recognition & {
    onresult: ((event: unknown) => void) | null;
    onerror: ((event: unknown) => void) | null;
  };

  recognitionWithHandlers.onresult = (event: unknown) => {
    const results: ASRResult[] = [];
    const speechEvent = event as { resultIndex: number; results: { length: number; isFinal: boolean; [index: number]: { transcript: string; confidence: number } }[] };
    
    for (let i = speechEvent.resultIndex; i < speechEvent.results.length; i++) {
      const result = speechEvent.results[i];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence || 0.5;
      
      results.push({
        text: transcript,
        confidence,
        isFinal: result.isFinal,
      });
      
      if (result.length > 1) {
        for (let j = 1; j < result.length; j++) {
          results.push({
            text: result[j].transcript,
            confidence: result[j].confidence || 0.3,
            isFinal: result.isFinal,
          });
        }
      }
    }

    if (results.length > 0) {
      results.sort((a, b) => b.confidence - a.confidence);
      const bestResult = results[0];
      onResult(bestResult.text, bestResult.isFinal, bestResult.confidence);
    }
  };

  recognitionWithHandlers.onerror = (event: unknown) => {
    const speechError = event as { error: string };
    const errorMessages: Record<string, string> = {
      'no-speech': '未检测到语音，请重试',
      'audio-capture': '无法访问麦克风',
      'not-allowed': '麦克风权限被拒绝',
      'network': '网络错误，请检查连接',
      'aborted': '语音识别被中断',
      'service-not-allowed': '服务不可用',
    };
    onError?.(errorMessages[speechError.error] || speechError.error);
  };

  recognition.start();

  return () => {
    try {
      recognition.stop();
    } catch {
      // Ignore
    }
  };
}

export function isSpeechRecognitionSupported(): boolean {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => 
    Array.from({ length: n + 1 }, () => 0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
}

export function calculateSimilarity(text1: string, text2: string): number {
  const normalized1 = normalizeText(text1);
  const normalized2 = normalizeText(text2);
  
  if (normalized1 === normalized2) return 1;
  if (normalized1.length === 0 || normalized2.length === 0) return 0;
  
  const distance = levenshteinDistance(normalized1, normalized2);
  const maxLength = Math.max(normalized1.length, normalized2.length);
  
  return Math.max(0, 1 - distance / maxLength);
}

export function fuzzyMatch(
  originalText: string,
  recognizedText: string,
  threshold: number = 0.6
): {
  matched: string[];
  missed: string[];
  extra: string[];
  accuracy: number;
} {
  const originalWords = extractWords(normalizeText(originalText));
  const recognizedWords = extractWords(normalizeText(recognizedText));
  
  const matched: string[] = [];
  const missed: string[] = [];
  const extra: string[] = [];
  
  const recognizedSet = new Set(recognizedWords);
  
  for (const word of originalWords) {
    let isMatched = false;
    
    if (recognizedSet.has(word)) {
      matched.push(word);
      isMatched = true;
    } else {
      for (const recWord of recognizedWords) {
        const similarity = calculateSimilarity(word, recWord);
        if (similarity >= threshold) {
          matched.push(word);
          isMatched = true;
          break;
        }
      }
    }
    
    if (!isMatched) {
      missed.push(word);
    }
  }
  
  const matchedSet = new Set(matched);
  for (const word of recognizedWords) {
    if (!matchedSet.has(word)) {
      let isExtra = true;
      for (const origWord of originalWords) {
        if (calculateSimilarity(word, origWord) >= threshold) {
          isExtra = false;
          break;
        }
      }
      if (isExtra) {
        extra.push(word);
      }
    }
  }
  
  const accuracy = originalWords.length > 0 
    ? matched.length / originalWords.length 
    : 0;
  
  return {
    matched: [...new Set(matched)],
    missed: [...new Set(missed)],
    extra: [...new Set(extra)],
    accuracy,
  };
}