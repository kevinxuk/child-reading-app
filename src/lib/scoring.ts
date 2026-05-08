import type { AudioFeatures, ScoringResult } from '@/types';

function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2);
  }
  return Math.sqrt(sum);
}

export function computeDTW(
  seq1: number[][],
  seq2: number[][],
  distanceFn: (a: number[], b: number[]) => number = euclideanDistance
): { distance: number; path: [number, number][] } {
  const n = seq1.length;
  const m = seq2.length;

  const dtwMatrix: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: m + 1 }, () => Infinity)
  );

  dtwMatrix[0][0] = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = distanceFn(seq1[i - 1], seq2[j - 1]);
      dtwMatrix[i][j] =
        cost +
        Math.min(
          dtwMatrix[i - 1][j],
          dtwMatrix[i][j - 1],
          dtwMatrix[i - 1][j - 1]
        );
    }
  }

  const path: [number, number][] = [];
  let i = n;
  let j = m;

  while (i > 0 && j > 0) {
    path.push([i - 1, j - 1]);
    const min = Math.min(
      dtwMatrix[i - 1][j],
      dtwMatrix[i][j - 1],
      dtwMatrix[i - 1][j - 1]
    );
    if (min === dtwMatrix[i - 1][j - 1]) {
      i--;
      j--;
    } else if (min === dtwMatrix[i - 1][j]) {
      i--;
    } else {
      j--;
    }
  }

  return { distance: dtwMatrix[n][m], path: path.reverse() };
}

export function dtwSimilarity(
  features1: AudioFeatures,
  features2: AudioFeatures
): number {
  const { distance } = computeDTW(features1.mfcc, features2.mfcc);
  
  const maxPossibleDistance = Math.max(
    features1.mfcc.length,
    features2.mfcc.length
  ) * features1.mfcc[0].length * 10;

  return Math.max(0, 1 - distance / maxPossibleDistance);
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

function wordSimilarity(word1: string, word2: string): number {
  if (word1 === word2) return 1;
  const distance = levenshteinDistance(word1, word2);
  const maxLen = Math.max(word1.length, word2.length);
  return maxLen > 0 ? 1 - distance / maxLen : 0;
}

function fuzzyMatchWords(
  originalWords: string[],
  recognizedWords: string[],
  threshold: number = 0.6
): {
  matched: string[];
  missed: string[];
  extra: string[];
} {
  const matched: string[] = [];
  const missed: string[] = [];
  const recognizedUsed = new Set<number>();
  
  for (const origWord of originalWords) {
    let found = false;
    
    for (let i = 0; i < recognizedWords.length; i++) {
      if (recognizedUsed.has(i)) continue;
      
      const similarity = wordSimilarity(origWord, recognizedWords[i]);
      if (similarity >= threshold) {
        matched.push(origWord);
        recognizedUsed.add(i);
        found = true;
        break;
      }
    }
    
    if (!found) {
      missed.push(origWord);
    }
  }
  
  const extra: string[] = [];
  for (let i = 0; i < recognizedWords.length; i++) {
    if (!recognizedUsed.has(i)) {
      extra.push(recognizedWords[i]);
    }
  }
  
  return { matched, missed, extra };
}

export function calculateScore(
  originalText: string,
  recognizedText: string,
  audioSimilarity: number = 0.8
): ScoringResult {
  const originalWords = extractWords(normalizeText(originalText));
  const recognizedWords = extractWords(normalizeText(recognizedText));
  
  const result = fuzzyMatchWords(originalWords, recognizedWords, 0.6);
  
  const completionScore = originalWords.length > 0
    ? (result.matched.length / originalWords.length) * 100
    : 0;
  
  const accuracyScore = audioSimilarity * 100;
  
  const fluencyPenalty = result.extra.length * 3 + result.missed.length * 2;
  const fluencyScore = Math.max(0, Math.min(100, 100 - fluencyPenalty));
  
  const weights = { accuracy: 0.35, completion: 0.45, fluency: 0.2 };
  
  const totalScore = Math.round(
    accuracyScore * weights.accuracy +
    completionScore * weights.completion +
    fluencyScore * weights.fluency
  );
  
  return {
    accuracy_score: Math.round(accuracyScore),
    fluency_score: Math.round(fluencyScore),
    completion_score: Math.round(completionScore),
    total_score: totalScore,
    matched_words: result.matched,
    missed_words: result.missed,
    extra_words: result.extra,
  };
}