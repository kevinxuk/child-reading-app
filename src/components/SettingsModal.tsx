'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { LANGUAGE_MAP } from '@/lib/tts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookLanguage?: 'zh-CN' | 'en-US' | 'mixed';
}

const PRESET_VOICES = [
  { id: 'serena', name: 'Serena (女声-温柔)' },
  { id: 'vivian', name: 'Vivian (女声-明亮)' },
  { id: 'ryan', name: 'Ryan (男声-活力)' },
  { id: 'aiden', name: 'Aiden (男声-阳光)' },
  { id: 'eric', name: 'Eric (男声-成熟)' },
  { id: 'dylan', name: 'Dylan (男声-低沉)' },
  { id: 'uncle_fu', name: 'Uncle Fu (大叔-低沉)' },
  { id: 'ono_anna', name: 'Ono Anna (日语女声)' },
  { id: 'sohee', name: 'Sohee (韩语女声)' },
];

const PRESET_MODELS = [
  { id: 'Qwen3-TTS-12Hz-1.7B-CustomVoice-4bit', name: 'Qwen3-TTS CustomVoice (本地)' },
  { id: 'qwen-tts', name: 'Qwen-TTS Base (语音克隆)' },
  { id: 'tts-1', name: 'OpenAI TTS-1' },
  { id: 'tts-1-hd', name: 'OpenAI TTS-1-HD' },
];

const PRESET_URLS = [
  { url: 'http://192.168.1.3:8000/v1', name: '本地 Qwen3-TTS' },
  { url: 'https://api.openai.com/v1', name: 'OpenAI API' },
];

const PRESET_LANGUAGES = [
  { id: 'Chinese', name: '中文' },
  { id: 'English', name: '英文' },
  { id: 'Japanese', name: '日语' },
  { id: 'Korean', name: '韩语' },
  { id: 'Auto', name: '自动检测' },
];

const PRESET_RESPONSE_FORMATS = [
  { id: 'wav', name: 'WAV (高质量)' },
  { id: 'mp3', name: 'MP3 (较小)' },
  { id: 'ogg', name: 'OGG' },
];

const GRADE_OPTIONS = [
  { value: 'all', label: '全部年级', icon: '📚' },
  { value: '1', label: '一年级', icon: '🌱' },
  { value: '2', label: '二年级', icon: '🌿' },
  { value: '3', label: '三年级', icon: '🌳' },
  { value: '4', label: '四年级', icon: '🌲' },
  { value: '5', label: '五年级', icon: '🌺' },
  { value: '6', label: '六年级', icon: '🌻' },
];

type Tab = 'grade' | 'tts';

export default function SettingsModal({ isOpen, onClose, bookLanguage }: SettingsModalProps) {
  const { ttsConfig, setTTSConfig, selectedGrade, setSelectedGrade } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('grade');

  // TTS state
  const resolvedLanguage = bookLanguage ? (LANGUAGE_MAP[bookLanguage]?.ttsLanguage ?? 'Chinese') : ttsConfig.language;
  const [ttsEnabled, setTtsEnabled] = useState(ttsConfig.enabled);
  const [apiUrl, setApiUrl] = useState(ttsConfig.apiUrl);
  const [apiKey, setApiKey] = useState(ttsConfig.apiKey);
  const [model, setModel] = useState(ttsConfig.model);
  const [voice, setVoice] = useState(ttsConfig.voice);
  const [speed, setSpeed] = useState(ttsConfig.speed ?? 1.0);
  const [pitch, setPitch] = useState(ttsConfig.pitch ?? 0);
  const [volume, setVolume] = useState(ttsConfig.volume ?? 1.0);
  const [promptText, setPromptText] = useState(ttsConfig.promptText ?? '');
  const [instruct, setInstruct] = useState(ttsConfig.instruct ?? '');
  const [language, setLanguage] = useState(resolvedLanguage);
  const [enableAudioCache, setEnableAudioCache] = useState(ttsConfig.enableAudioCache ?? false);
  const [responseFormat, setResponseFormat] = useState(ttsConfig.responseFormat ?? 'wav');
  const [showApiKey, setShowApiKey] = useState(false);
  const [customModel, setCustomModel] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (bookLanguage) {
      const mapped = LANGUAGE_MAP[bookLanguage]?.ttsLanguage ?? 'Chinese';
      setLanguage(mapped);
    }
  }, [bookLanguage]);

  const handleSaveTTS = () => {
    setTTSConfig({
      enabled: ttsEnabled,
      apiUrl,
      apiKey,
      model: model === 'custom' ? customModel : model,
      voice,
      speed,
      pitch,
      volume,
      promptText,
      instruct,
      language,
      enableAudioCache,
      responseFormat,
    });
  };

  const handleSaveAll = () => {
    handleSaveTTS();
    onClose();
  };

  const handleTest = async () => {
    if (!apiUrl) {
      setTestResult({ success: false, message: '请输入 API URL' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/tts/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: '测试语音合成，春天来了，花儿开了',
          apiUrl,
          apiKey,
          model: model === 'custom' ? customModel : model,
          voice,
          speed,
          pitch,
          volume,
          promptText,
          instruct,
          language,
          enableAudioCache,
          responseFormat,
        }),
      });
      if (response.ok) {
        setTestResult({ success: true, message: '连接成功！语音服务可用' });
      } else {
        const error = await response.text();
        setTestResult({ success: false, message: `连接失败: ${response.status} - ${error.slice(0, 100)}` });
      }
    } catch (error) {
      setTestResult({ success: false, message: `连接失败: ${String(error)}` });
    } finally {
      setTesting(false);
    }
  };

  const handleReset = () => {
    setSpeed(1.0);
    setPitch(0);
    setVolume(1.0);
    setPromptText('用温柔亲切的声音朗读儿童故事');
    setInstruct('');
    setLanguage('Chinese');
    setEnableAudioCache(false);
    setResponseFormat('wav');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">⚙️ 设置</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('grade')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              activeTab === 'grade' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🎓 年级设置
          </button>
          <button
            onClick={() => setActiveTab('tts')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              activeTab === 'tts' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🔊 TTS 语音
          </button>
        </div>

        {/* Grade Tab */}
        {activeTab === 'grade' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">选择孩子的年级，书架将自动显示对应的课程内容</p>
            <div className="grid grid-cols-2 gap-2">
              {GRADE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedGrade(opt.value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 text-left transition ${
                    selectedGrade === opt.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              当前选择：<span className="font-medium text-blue-600">{GRADE_OPTIONS.find(o => o.value === selectedGrade)?.label || '全部年级'}</span>
            </p>
          </div>
        )}

        {/* TTS Tab */}
        {activeTab === 'tts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-medium">启用大模型 TTS</label>
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${ttsEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${ttsEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {ttsEnabled && (
              <>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">API 地址</label>
                  <select
                    value={PRESET_URLS.find(p => p.url === apiUrl)?.url || ''}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-2"
                  >
                    <option value="">选择预设...</option>
                    {PRESET_URLS.map((p) => (
                      <option key={p.url} value={p.url}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="http://192.168.1.3:8000/v1"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">API Key</label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="输入 API Key"
                      className="w-full p-2 border rounded-lg pr-10"
                    />
                    <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                      {showApiKey ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">模型</label>
                  <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full p-2 border rounded-lg">
                    {PRESET_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                    <option value="custom">自定义模型...</option>
                  </select>
                  {model === 'custom' && (
                    <input type="text" value={customModel} onChange={(e) => setCustomModel(e.target.value)}
                      placeholder="输入模型名称" className="w-full p-2 border rounded-lg mt-2" />
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">语音</label>
                  <select value={voice} onChange={(e) => setVoice(e.target.value)} className="w-full p-2 border rounded-lg">
                    {PRESET_VOICES.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">语速: {speed.toFixed(1)}</label>
                  <input type="range" min="0.5" max="2" step="0.1" value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>慢</span><span>正常</span><span>快</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    音调: {pitch === 0 ? '标准' : pitch > 0 ? `+${pitch}` : pitch}
                  </label>
                  <input type="range" min="-1" max="1" step="0.1" value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>低沉</span><span>标准</span><span>高亢</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">音量: {volume.toFixed(1)}</label>
                  <input type="range" min="0.1" max="2" step="0.1" value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full" />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">语言</label>
                  {bookLanguage && (
                    <p className="text-xs text-blue-500 mb-1">📖 当前文章语言: {LANGUAGE_MAP[bookLanguage]?.label ?? '中文'}（已自动同步）</p>
                  )}
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border rounded-lg">
                    {PRESET_LANGUAGES.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">风格提示词</label>
                  <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)}
                    placeholder="用温柔亲切的声音朗读儿童故事" rows={2} className="w-full p-2 border rounded-lg text-sm" />
                  <p className="text-xs text-gray-400 mt-1">控制语音的整体风格和情感</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">详细指令 (instruct)</label>
                  <textarea value={instruct} onChange={(e) => setInstruct(e.target.value)}
                    placeholder="例如：缓慢而温柔地朗读，适合睡前故事" rows={2} className="w-full p-2 border rounded-lg text-sm" />
                  <p className="text-xs text-gray-400 mt-1">更精细地控制朗读方式</p>
                </div>

                <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm text-blue-500 hover:underline">
                  {showAdvanced ? '▼ 收起高级选项' : '▶ 显示高级选项'}
                </button>

                {showAdvanced && (
                  <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">输出格式</label>
                      <select value={responseFormat} onChange={(e) => setResponseFormat(e.target.value)} className="w-full p-2 border rounded-lg">
                        {PRESET_RESPONSE_FORMATS.map((f) => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-600">启用音频缓存</label>
                      <button onClick={() => setEnableAudioCache(!enableAudioCache)}
                        className={`w-10 h-5 rounded-full transition-colors ${enableAudioCache ? 'bg-blue-500' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${enableAudioCache ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    <button onClick={handleReset} className="text-sm text-orange-500 hover:underline">重置为默认值</button>
                  </div>
                )}

                <button onClick={handleTest} disabled={testing}
                  className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50">
                  {testing ? '测试中...' : '测试连接'}
                </button>

                {testResult && (
                  <div className={`p-2 rounded-lg text-sm ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {testResult.success ? '✓' : '✗'} {testResult.message}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 p-2 border rounded-lg hover:bg-gray-100 transition">
            取消
          </button>
          <button onClick={handleSaveAll} className="flex-1 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
