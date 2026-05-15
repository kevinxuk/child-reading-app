export interface Book {
  id: string;
  user_id: string;
  title: string;
  content: string;
  language: 'zh-CN' | 'en-US' | 'mixed';
  cover_url?: string;
  grade?: string;
  subject?: string;
  lesson_number?: number;
  chapter?: string;
  author?: string;
  completed?: boolean;
  average_score?: number;
  created_at: string;
  updated_at?: string;
}

export interface ReadingRecord {
  id: string;
  user_id: string;
  book_id: string;
  book_title?: string;
  paragraph_index: number;
  audio_url: string;
  recognized_text: string;
  accuracy_score: number;
  fluency_score: number;
  completion_score: number;
  total_score: number;
  missed_words: string[];
  extra_words: string[];
  credit_awarded: boolean;
  completion_credit_awarded?: boolean;
  duration: number;
  created_at: string;
}

export interface UserScore {
  id: string;
  user_id: string;
  total_points: number;
  level: string;
  reading_count: number;
  created_at: string;
  updated_at: string;
}

export interface AudioFeatures {
  mfcc: number[][];
  energy: number[];
  duration: number;
  sampleRate: number;
}

export interface ScoringResult {
  accuracy_score: number;
  fluency_score: number;
  completion_score: number;
  total_score: number;
  matched_words: string[];
  missed_words: string[];
  extra_words: string[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Reward {
  id: string;
  name: string;
  icon: string;
  cost: number;
  description?: string;
  created_at: string;
}