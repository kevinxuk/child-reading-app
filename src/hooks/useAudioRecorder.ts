import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  audioURL: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  clearRecording: () => void;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !isRecording) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });

        if (audioURL) {
          URL.revokeObjectURL(audioURL);
        }

        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setIsRecording(false);

        mediaRecorderRef.current?.stream.getTracks().forEach((track) =>
          track.stop()
        );

        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
    });
  }, [isRecording, audioURL]);

  const clearRecording = useCallback(() => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    audioChunksRef.current = [];
  }, [audioURL]);

  return {
    isRecording,
    audioURL,
    startRecording,
    stopRecording,
    clearRecording,
  };
}