'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { recognizeText, initializeOCR } from '@/lib/ocr';

export default function NewBookPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState<'zh-CN' | 'en-US' | 'mixed'>('zh-CN');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [lessonNumber, setLessonNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const grades = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
  const subjects = ['语文', '英语'];

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const ext = file.name.toLowerCase().split('.').pop();
      let text = '';

      if (ext === 'txt' || ext === 'md') {
        const reader = new FileReader();
        text = await new Promise((resolve, reject) => {
          reader.onload = () => {
            setUploadProgress(50);
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });
      } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '')) {
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 80));
        }, 200);
        text = await recognizeText(file, (progress) => {
          setOcrProgress(progress);
        });
        clearInterval(progressInterval);
        setUploadProgress(100);
      } else {
        alert('不支持的文件格式，请上传 txt、md 或图片文件');
        setIsLoading(false);
        return;
      }

      if (ext === 'txt' || ext === 'md') {
        setContent(text);
        if (!title) {
          const baseName = file.name.replace(/\.(txt|md)$/i, '');
          setTitle(baseName);
        }
        setUploadProgress(100);
      } else {
        setContent(text);
      }
    } catch (error) {
      console.error('Upload Error:', error);
      alert('文件处理失败，请重试');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
      setOcrProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  }, [title]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          language,
          grade: grade || undefined,
          subject: subject || undefined,
          lesson_number: lessonNumber ? parseInt(lessonNumber) : undefined,
          chapter: chapter || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('保存成功！');
        router.push('/books');
      } else {
        alert('保存失败: ' + (result.error || '未知错误'));
      }
    } catch (error) {
      console.error('Save Error:', error);
      alert('保存失败，请重试');
    }
  }, [title, content, language, grade, subject, chapter, lessonNumber, router]);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">添加新书籍</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">书籍标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="输入书籍标题"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">年级</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">未选择</option>
                {grades.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">学科</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">未选择</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">章节</label>
              <input
                type="text"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="如：课文1、UNIT 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">课时</label>
              <input
                type="number"
                value={lessonNumber}
                onChange={(e) => setLessonNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="如：1、2、3"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">语言</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as typeof language)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="zh-CN">中文</option>
              <option value="en-US">英文</option>
              <option value="mixed">中英文混合</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">导入方式</label>
            <div className="flex flex-wrap gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,text/markdown,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                <div className={`px-4 py-3 border-2 border-dashed rounded-lg text-center transition ${isLoading ? 'opacity-50' : 'hover:border-blue-400 hover:bg-blue-50'}`}>
                  <div className="text-2xl mb-1">📄</div>
                  <div className="text-sm font-medium">上传文件</div>
                  <div className="text-xs text-gray-400">txt / md</div>
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                <div className={`px-4 py-3 border-2 border-dashed rounded-lg text-center transition ${isLoading ? 'opacity-50' : 'hover:border-green-400 hover:bg-green-50'}`}>
                  <div className="text-2xl mb-1">📷</div>
                  <div className="text-sm font-medium">拍照/图片</div>
                  <div className="text-xs text-gray-400">OCR 识别</div>
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                <div className={`px-4 py-3 border-2 border-dashed rounded-lg text-center transition ${isLoading ? 'opacity-50' : 'hover:border-purple-400 hover:bg-purple-50'}`}>
                  <div className="text-2xl mb-1">🖼️</div>
                  <div className="text-sm font-medium">相册</div>
                  <div className="text-xs text-gray-400">选择图片</div>
                </div>
              </label>
            </div>
            {(isLoading && (uploadProgress > 0 || ocrProgress > 0)) && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${ocrProgress > 0 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${ocrProgress > 0 ? ocrProgress : uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {ocrProgress > 0 ? `OCR 识别中... ${ocrProgress}%` : `处理中... ${uploadProgress}%`}
                </p>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">
              💡 支持 txt、md 文本文件，或拍照/上传图片进行文字识别（OCR）
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">书籍内容 *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[200px]"
              placeholder="输入或粘贴书籍内容，也可通过上方按钮上传文件或图片"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50"
              disabled={isLoading}
            >
              保存书籍
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-100 transition"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}