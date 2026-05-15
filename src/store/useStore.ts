import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, ReadingRecord, UserScore } from '@/types';

interface TTSConfig {
  enabled: boolean;
  apiUrl: string;
  apiKey: string;
  model: string;
  voice: string;
  speed: number;
  pitch: number;
  volume: number;
  promptText: string;
  instruct: string;
  language: string;
  enableAudioCache: boolean;
  responseFormat: string;
}

interface BrowserTTSConfig {
  rate: number;
  pitch: number;
  voice: string;
}

interface AppState {
  books: Book[];
  currentBook: Book | null;
  readingRecords: ReadingRecord[];
  userScore: UserScore | null;
  isRecording: boolean;
  isPlaying: boolean;
  recognizedText: string;
  ttsConfig: TTSConfig;
  browserTTS: BrowserTTSConfig;
  selectedGrade: string; // 'all' | '1' | '2' | '3' | '4' | '5' | '6'
  
  setBooks: (books: Book[]) => void;
  addBook: (book: Book) => void;
  removeBook: (id: string) => void;
  setCurrentBook: (book: Book | null) => void;
  setReadingRecords: (records: ReadingRecord[]) => void;
  addReadingRecord: (record: ReadingRecord) => void;
  setUserScore: (score: UserScore | null) => void;
  setIsRecording: (isRecording: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setRecognizedText: (text: string) => void;
  setTTSConfig: (config: Partial<TTSConfig>) => void;
  setBrowserTTS: (config: Partial<BrowserTTSConfig>) => void;
  setSelectedGrade: (grade: string) => void;
}

const defaultTTSConfig: TTSConfig = {
  enabled: false,
  apiUrl: 'http://192.168.1.3:8000/v1',
  apiKey: '123456',
  model: 'Qwen3-TTS-12Hz-1.7B-CustomVoice-4bit',
  voice: 'serena',
  speed: 1.0,
  pitch: 0,
  volume: 1.0,
  promptText: '用温柔亲切的声音朗读儿童故事',
  instruct: '',
  language: 'Chinese',
  enableAudioCache: false,
  responseFormat: 'wav',
};

const defaultBrowserTTS: BrowserTTSConfig = {
  rate: 0.9,
  pitch: 1.1,
  voice: '',
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      books: [],
      currentBook: null,
      readingRecords: [],
      userScore: null,
      isRecording: false,
      isPlaying: false,
      recognizedText: '',
      ttsConfig: defaultTTSConfig,
      browserTTS: defaultBrowserTTS,
      selectedGrade: 'all',
      
      setBooks: (books) => set({ books }),
      addBook: (book) => set((state) => ({ books: [...state.books, book] })),
      removeBook: (id) => set((state) => ({ 
        books: state.books.filter((b) => b.id !== id) 
      })),
      setCurrentBook: (book) => set({ currentBook: book }),
      setReadingRecords: (records) => set({ readingRecords: records }),
      addReadingRecord: (record) => set((state) => ({ 
        readingRecords: [...state.readingRecords, record] 
      })),
      setUserScore: (score) => set({ userScore: score }),
      setIsRecording: (isRecording) => set({ isRecording }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setRecognizedText: (text) => set({ recognizedText: text }),
      setTTSConfig: (config) => set((state) => ({ 
        ttsConfig: { ...state.ttsConfig, ...config } 
      })),
      setBrowserTTS: (config) => set((state) => ({ 
        browserTTS: { ...state.browserTTS, ...config } 
      })),
      setSelectedGrade: (grade) => set({ selectedGrade: grade }),
    }),
    {
      name: 'child-reading-storage',
      partialize: (state) => ({ ttsConfig: state.ttsConfig, browserTTS: state.browserTTS, selectedGrade: state.selectedGrade }),
    }
  )
);