'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { speak, stopSpeaking, getVoices, LANGUAGE_MAP } from '@/lib/tts';
import { startRecognition } from '@/lib/asr';
import { calculateScore } from '@/lib/scoring';
import type { ScoringResult } from '@/types';


interface ParagraphScore {
  paragraphIndex: number;
  result: ScoringResult;
}

export default function ReadPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const { currentBook, setCurrentBook } = useStore();
  const { isRecording, audioURL, startRecording, stopRecording, clearRecording } = useAudioRecorder();

  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [completedParagraphs, setCompletedParagraphs] = useState<boolean[]>([]);
  const [paragraphScores, setParagraphScores] = useState<ParagraphScore[]>([]);
  const [allRecognizedTexts, setAllRecognizedTexts] = useState<Record<number, string>>({});
  const [showCompletion, setShowCompletion] = useState(false);
  const [creditEarned, setCreditEarned] = useState(0);



  const { ttsConfig, setTTSConfig, browserTTS, setBrowserTTS } = useStore();
  const stopRecognitionRef = useRef<(() => void) | null>(null);

  const resolveLang = useCallback((): 'zh-CN' | 'en-US' => {
    if (!currentBook) return 'zh-CN';
    if (currentBook.language === 'en-US') return 'en-US';
    return 'zh-CN';
  }, [currentBook]);

  useEffect(() => {
    fetchBook();
    return () => {
      stopSpeaking();
      stopRecognitionRef.current?.();
    };
  }, [bookId]);

  useEffect(() => {
    if (!currentBook) return;
    const langMap = LANGUAGE_MAP[currentBook.language];
    if (!langMap) return;

    setTTSConfig({ language: langMap.ttsLanguage });
  }, [currentBook?.language, setTTSConfig]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books?id=${bookId}`);
      const data = await response.json();
      if (data.success) {
        setCurrentBook(data.data);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const paragraphs = currentBook?.content.split('\n\n').filter(Boolean) || [];

  useEffect(() => {
    if (paragraphs.length > 0 && completedParagraphs.length === 0) {
      setCompletedParagraphs(new Array(paragraphs.length).fill(false));
    }
  }, [paragraphs.length]);

  // 进入页面时预热浏览器 TTS 引擎
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      };
    }
  }, []);

  const handlePlayParagraph = useCallback(async () => {
    if (!currentBook || isPlaying) return;

    const text = paragraphs[currentParagraph];
    if (!text) return;

    setIsPlaying(true);

    try {
      const engine = ttsConfig.enabled ? 'llm' : 'browser';
      await speak(text, {
        lang: resolveLang(),
        rate: ttsConfig.enabled ? ttsConfig.speed : browserTTS.rate,
        pitch: browserTTS.pitch,
        voice: browserTTS.voice,
        engine,
        llmConfig: ttsConfig.enabled ? {
          apiUrl: ttsConfig.apiUrl,
          apiKey: ttsConfig.apiKey,
          model: ttsConfig.model,
          voice: ttsConfig.voice,
          speed: ttsConfig.speed,
          pitch: ttsConfig.pitch,
          volume: ttsConfig.volume,
          promptText: ttsConfig.promptText,
          instruct: ttsConfig.instruct,
          language: ttsConfig.language,
          enableAudioCache: ttsConfig.enableAudioCache,
          responseFormat: ttsConfig.responseFormat,
        } : undefined,
      });
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [currentBook, currentParagraph, paragraphs, isPlaying, browserTTS, ttsConfig]);

  const handleStartReading = useCallback(() => {
    if (!currentBook) return;

    // 重新跟读时重置当前段落的完成状态
    setCompletedParagraphs(prev => {
      const next = [...prev];
      next[currentParagraph] = false;
      return next;
    });
    setRecognizedText('');
    setShowResult(false);
    clearRecording();

    startRecording();

    const currentText = paragraphs[currentParagraph] || currentBook.content;
    const phrases = currentText.split(/[，。！？,.\s]+/).filter(s => s.length > 0).slice(0, 10);

    stopRecognitionRef.current = startRecognition(
      (text, _isFinal, _confidence) => {
        setRecognizedText(text);
      },
      (error) => {
        console.error('ASR Error:', error);
        alert('语音识别错误: ' + error);
      },
      {
        lang: resolveLang(),
        continuous: true,
        interimResults: true,
        phrases,
      }
    );
  }, [currentBook, currentParagraph, paragraphs, startRecording, clearRecording]);

  const handleStopReading = useCallback(async () => {
    if (!currentBook) return;

    stopRecognitionRef.current?.();
    const audioBlob = await stopRecording();

    if (audioBlob && recognizedText) {
      const text = paragraphs[currentParagraph] || currentBook.content;

      const result = calculateScore(text, recognizedText, 0.8);
      setScoringResult(result);
      setShowResult(true);

      setCompletedParagraphs(prev => {
        const next = [...prev];
        next[currentParagraph] = true;
        return next;
      });

      setParagraphScores(prev => [...prev, { paragraphIndex: currentParagraph, result }]);

      // 保存当前段落的识别结果
      setAllRecognizedTexts(prev => ({
        ...prev,
        [currentParagraph]: recognizedText,
      }));

      let audioUrl = '';
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob, `recording-${bookId}-${currentParagraph}.webm`);
        const uploadRes = await fetch('/api/audio', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          audioUrl = uploadData.data.url;
        }
      } catch (e) {
        console.error('Audio Upload Error:', e);
      }

      try {
        await fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            book_id: bookId,
            book_title: currentBook.title,
            paragraph_index: currentParagraph,
            recognized_text: recognizedText,
            accuracy_score: result.accuracy_score,
            fluency_score: result.fluency_score,
            completion_score: result.completion_score,
            total_score: result.total_score,
            missed_words: result.missed_words,
            extra_words: result.extra_words,
            audio_url: audioUrl,
          }),
        });
      } catch (error) {
        console.error('Save Score Error:', error);
      }

      if (result.total_score >= 88) {
        setCreditEarned(prev => prev + 1);
        try {
          await fetch('/api/credits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: `第${currentParagraph + 1}段得分${result.total_score}≥88`, amount: 1 }),
          });
        } catch {}
      }

      if (currentParagraph === paragraphs.length - 1) {
        setCreditEarned(prev => prev + 1);
        try {
          await fetch('/api/credits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: '完成整篇朗读', amount: 1 }),
          });
        } catch {}
        setShowCompletion(true);
        const allScores = [...paragraphScores, { paragraphIndex: currentParagraph, result }];
        const avgTotal = Math.round(allScores.reduce((sum, s) => sum + s.result.total_score, 0) / allScores.length);
        try {
          await fetch('/api/books', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: bookId, completed: true, average_score: avgTotal }),
          });
        } catch (error) {
          console.error('Mark Complete Error:', error);
        }
      }
    }
  }, [currentBook, currentParagraph, paragraphs, recognizedText, bookId, stopRecording]);

  const handleNextParagraph = () => {
    if (currentParagraph < paragraphs.length - 1 && completedParagraphs[currentParagraph]) {
      setCurrentParagraph(currentParagraph + 1);
      setShowResult(false);
      setRecognizedText('');
      clearRecording();
    }
  };

  const handlePrevParagraph = () => {
    if (currentParagraph > 0) {
      setCurrentParagraph(currentParagraph - 1);
      setShowResult(false);
      setRecognizedText('');
      clearRecording();
    }
  };

  const isCurrentCompleted = completedParagraphs[currentParagraph];
  const isLastParagraph = currentParagraph === paragraphs.length - 1;

  const getAverageScores = () => {
    if (paragraphScores.length === 0) return null;
    const avgAccuracy = Math.round(paragraphScores.reduce((sum, s) => sum + s.result.accuracy_score, 0) / paragraphScores.length);
    const avgFluency = Math.round(paragraphScores.reduce((sum, s) => sum + s.result.fluency_score, 0) / paragraphScores.length);
    const avgCompletion = Math.round(paragraphScores.reduce((sum, s) => sum + s.result.completion_score, 0) / paragraphScores.length);
    const avgTotal = Math.round(paragraphScores.reduce((sum, s) => sum + s.result.total_score, 0) / paragraphScores.length);
    return { accuracy: avgAccuracy, fluency: avgFluency, completion: avgCompletion, total: avgTotal };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (!currentBook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">书籍不存在</div>
      </div>
    );
  }

  if (showCompletion) {
    const avgScores = getAverageScores();
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">朗读完成！</h1>
            <p className="text-gray-500 mb-4">{currentBook.title}</p>
            {creditEarned > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full mb-6">
                <span className="text-2xl">🪙</span>
                <span className="text-lg font-bold text-yellow-600">+{creditEarned} 积分</span>
              </div>
            )}

            {avgScores && (
              <>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-500">{avgScores.accuracy}</div>
                    <div className="text-sm text-gray-600">平均准确度</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-500">{avgScores.fluency}</div>
                    <div className="text-sm text-gray-600">平均流畅度</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-500">{avgScores.completion}</div>
                    <div className="text-sm text-gray-600">平均完成度</div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-yellow-500 mb-2">{avgScores.total}</div>
                  <div className="text-lg text-gray-600">平均总分</div>
                </div>

                <div className="text-left mb-6">
                  <h3 className="font-bold text-lg mb-3">各段落评分</h3>
                  <div className="space-y-2">
                    {paragraphScores
                      .sort((a, b) => a.paragraphIndex - b.paragraphIndex)
                      .map((ps) => (
                        <div key={ps.paragraphIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">第 {ps.paragraphIndex + 1} 段</span>
                          <div className="flex gap-4 text-sm">
                            <span className="text-blue-500">准确 {ps.result.accuracy_score}</span>
                            <span className="text-green-500">流畅 {ps.result.fluency_score}</span>
                            <span className="text-purple-500">完成 {ps.result.completion_score}</span>
                            <span className="font-bold text-yellow-500">{ps.result.total_score}分</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/books')}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
              >
                返回书架
              </button>
              <button
                onClick={() => {
                  setCurrentParagraph(0);
                  setCompletedParagraphs(new Array(paragraphs.length).fill(false));
                  setParagraphScores([]);
                  setShowCompletion(false);
                  setShowResult(false);
                  setRecognizedText('');
                  clearRecording();
                }}
                className="px-8 py-3 border rounded-lg font-medium hover:bg-gray-50 transition"
              >
                重新朗读
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white shadow-sm">
     <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
       <p className="text-sm text-gray-500">
         第 {currentParagraph + 1} / {paragraphs.length} 段
         {isCurrentCompleted && <span className="ml-2 text-green-500">✓</span>}
       </p>
        <div className="flex items-center gap-2">
          <button
           onClick={() => router.push('/books')}
           className="text-blue-500 hover:underline text-sm"
         >
           ← 书架
         </button>
       </div>
     </div>
       {ttsConfig.enabled && (
         <div className="max-w-3xl mx-auto px-4 pb-2">
           <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">
             <span>🔊 {ttsConfig.voice}</span>
             <span>·</span>
             <span>{LANGUAGE_MAP[currentBook.language]?.label ?? '中文'}</span>
             <span>·</span>
             <span>语速 {ttsConfig.speed}x</span>
           </div>
         </div>
       )}
        <div className="max-w-3xl mx-auto px-4 pb-2 flex gap-1 overflow-x-auto">
          {paragraphs.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i <= currentParagraph || completedParagraphs[i]) {
                  setCurrentParagraph(i);
                  setShowResult(false);
                  setRecognizedText('');
                  clearRecording();
                }
              }}
              disabled={i > currentParagraph && !completedParagraphs[i]}
              className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center shrink-0 transition ${
                i === currentParagraph
                  ? 'bg-blue-500 text-white'
                  : completedParagraphs[i]
                    ? 'bg-green-500 text-white'
                    : i < currentParagraph
                      ? 'bg-blue-200 text-blue-700 cursor-pointer hover:bg-blue-300'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {completedParagraphs[i] ? '✓' : i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">{currentBook.title}</h2>
          <p className="text-xl leading-relaxed whitespace-pre-wrap mb-6">
            {paragraphs[currentParagraph]}
          </p>

          <div className="flex gap-2 sm:gap-4 mb-6 flex-wrap">
            <button
              onClick={handlePlayParagraph}
              disabled={isPlaying}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50 text-sm sm:text-base"
            >
              {isPlaying ? '播放中...' : '🔊 听朗读'}
            </button>

            {!isRecording ? (
              <button
                onClick={handleStartReading}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition text-sm sm:text-base"
              >
                {isCurrentCompleted ? '🔄 重读' : '🎤 跟读'}
              </button>
            ) : (
              <button
                onClick={handleStopReading}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition text-sm sm:text-base"
              >
                ⏹ 结束
              </button>
            )}

            {isCurrentCompleted && !isRecording && !isLastParagraph && (
              <button
                onClick={handleNextParagraph}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition text-sm sm:text-base"
              >
                下一段 →
              </button>
            )}
          </div>

          {isCurrentCompleted && !isRecording && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-700 text-sm">✅ 本段已跟读完成</span>
                <div className="flex items-center gap-3">
                  {paragraphScores.filter(ps => ps.paragraphIndex === currentParagraph).length > 0 && (() => {
                    const scores = paragraphScores.filter(ps => ps.paragraphIndex === currentParagraph);
                    const last = scores[scores.length - 1];
                    return (
                      <>
                        <span className="text-sm font-bold text-yellow-600">
                          上次得分：{last.result.total_score}分
                        </span>
                        <button
                          onClick={() => window.location.href = `/books/${bookId}/replays`}
                          className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg hover:bg-purple-200 transition font-medium"
                        >
                          📋 查看回放
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {allRecognizedTexts[currentParagraph] && !isCurrentCompleted && (
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">识别结果：</h3>
              <p className="text-gray-700">{allRecognizedTexts[currentParagraph]}</p>
            </div>
          )}

          {audioURL && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">您的录音：</h3>
              <audio src={audioURL} controls className="w-full" />
            </div>
          )}
        </div>

        {showResult && scoringResult && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold">评分结果</h2>
              {scoringResult.total_score >= 88 && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-sm rounded-full font-bold">
                  🪙 +1 积分
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-500">
                  {scoringResult.accuracy_score}
                </div>
                <div className="text-sm text-gray-600">准确度</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-500">
                  {scoringResult.fluency_score}
                </div>
                <div className="text-sm text-gray-600">流畅度</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-500">
                  {scoringResult.completion_score}
                </div>
                <div className="text-sm text-gray-600">完成度</div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-yellow-500 mb-2">
                {scoringResult.total_score}
              </div>
              <div className="text-lg text-gray-600">总分</div>
            </div>

            {scoringResult.missed_words.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-red-500">
                  遗漏的词：{scoringResult.missed_words.join(', ')}
                </h3>
              </div>
            )}

            {scoringResult.extra_words.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-orange-500">
                  多读的词：{scoringResult.extra_words.join(', ')}
                </h3>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between gap-2 sm:gap-4">
          <button
            onClick={handlePrevParagraph}
            disabled={currentParagraph === 0}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-3 border rounded-lg font-medium hover:bg-gray-100 transition disabled:opacity-50 text-sm sm:text-base"
          >
            ← 上一段
          </button>
          {isLastParagraph && isCurrentCompleted ? (
            <div className="flex-1 sm:flex-none px-4 sm:px-6 py-3 text-green-600 font-medium text-center text-sm sm:text-base">
              ✅ 所有段落已完成
            </div>
          ) : isLastParagraph ? (
            <button
              onClick={() => {}}
              disabled
              className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed text-sm sm:text-base"
            >
              请完成跟读
            </button>
          ) : (
            <button
              onClick={handleNextParagraph}
              disabled={!isCurrentCompleted}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              下一段 →
            </button>
          )}
        </div>
      </div>

    </div>
  );
}