import { createWorker, Worker } from 'tesseract.js';

let worker: Worker | null = null;

export async function initializeOCR(
  lang: 'chi_sim+eng' | 'eng' = 'chi_sim+eng',
  onProgress?: (progress: number) => void
) {
  if (!worker) {
    worker = await createWorker(lang, 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && m.progress) {
          onProgress?.(Math.round(m.progress * 100));
        }
      },
    });
  }
  return worker;
}

export async function recognizeText(
  image: string | Blob,
  onProgress?: (progress: number) => void
): Promise<string> {
  const worker = await initializeOCR('chi_sim+eng', onProgress);
  const { data: { text } } = await worker.recognize(image);
  return text;
}

export async function terminateOCR() {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}