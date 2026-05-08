# 儿童伴读 - AI 智能阅读助手

通过 AI 语音识别、语音合成和文字识别技术，帮助孩子提高阅读能力的互动式学习应用。

## 功能特性

### 📚 书籍管理
- **手动录入**：直接输入或粘贴书籍内容
- **文件导入**：支持 `.txt` / `.md` 文件上传
- **拍照识别**：通过 OCR（Tesseract.js）自动识别图片中的文字
- **批量导入**：从内置课程库（人教版语文 1-2 年级、英语 GZB）一键导入课文
- **拖拽排序**：书架支持拖拽排序和语言筛选

### 🔊 语音朗读（TTS）
- **浏览器 TTS**：基于 Web Speech API，无需额外配置，开箱即用
- **LLM TTS**：支持接入 ChatTTS / CosyVoice / OpenAI TTS 等外部服务，提供更自然的情感语音
- **可配置项**：语速、音调、音量、语音角色、情感提示词等

### 🎤 跟读评分
- **语音识别**：基于 Web Speech API 的实时语音识别
- **多维评分**：从准确度、流利度、完成度三个维度综合评分
- **积分奖励**：得分 ≥ 88 分可获得积分，用于兑换奖励
- **历史回放**：保存每次朗读的录音和评分结果，支持回放查看

### ⭐ 激励系统
- 积分累计与等级成长（新手 → 阅读达人 → 阅读专家）
- 可兑换的奖励商城

## 技术栈

| 层次 | 技术 | 说明 |
|------|------|------|
| 框架 | Next.js 16 (App Router) | React 全栈框架 |
| 语言 | TypeScript 5 | 严格类型检查 |
| 样式 | Tailwind CSS v4 | 原子化 CSS |
| 状态管理 | Zustand 5 | 轻量状态管理 + persist 持久化 |
| 语音合成 | Web Speech API / LLM (ChatTTS/CosyVoice) | 双引擎 TTS |
| 语音识别 | Web Speech API | 浏览器原生 ASR |
| 文字识别 | Tesseract.js | 客户端 OCR |
| 音频录制 | MediaRecorder API | 浏览器录音 |
| 数据存储 | 文件系统 (JSON) | 本地文件持久化 |
| 可选数据库 | Supabase | 已配置但未强制使用 |

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面和 API
│   ├── page.tsx           # 首页/落地页
│   ├── layout.tsx         # 根布局
│   ├── books/             # 书架、添加、编辑、回放页面
│   ├── read/[id]/         # 核心阅读页面
│   ├── import/            # 批量导入课程页
│   └── api/               # 后端 API 路由
│       ├── books/         # 书籍 CRUD
│       ├── audio/         # 音频上传/播放
│       ├── tts/           # 语音合成（浏览器 + LLM）
│       ├── scores/        # 评分记录
│       ├── credits/       # 积分系统
│       └── rewards/       # 奖励系统
├── components/            # 通用组件
│   └── TTSConfigModal.tsx # TTS 配置弹窗
├── data/                  # 课文数据
│   ├── lessons.ts         # 语文 1-2 年级课文数据
│   ├── lessons-g2.ts      # 二年级自动抓取课文
│   └── lessons-gzb-en.ts  # 英语 GZB 课程数据
├── hooks/                 # 自定义 Hooks
│   └── useAudioRecorder.ts # 音频录制 Hook
├── lib/                   # 核心逻辑库
│   ├── tts.ts             # TTS 引擎封装
│   ├── asr.ts             # 语音识别封装
│   ├── ocr.ts             # OCR 文字识别
│   ├── scoring.ts         # 朗读评分算法
│   └── supabase.ts        # Supabase 客户端
├── store/                 # 全局状态
│   └── useStore.ts        # Zustand Store
└── types/                 # TypeScript 类型定义
    ├── index.ts           # 主要类型
    └── speech.d.ts        # Web Speech API 类型声明

data/                      # 运行时数据（JSON 文件存储）
├── books.json             # 书籍数据
├── records.json           # 朗读记录
├── scores.json            # 用户评分
├── credits.json           # 积分数据
├── rewards.json           # 奖励数据
└── audio/                 # 录音文件
```

## 快速开始

### 环境要求

- Node.js 18+
- npm / pnpm

### 安装和运行

```bash
# 进入项目目录
cd child-reading-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可使用。

## 使用指南

### 基本流程

1. **添加书籍**
   - 点击首页"添加书籍" → 输入内容或上传文件/图片
   - 或点击"导入课文"→ 从内置课程库批量导入

2. **开始阅读**
   - 在书架选择一本书 → 点击"开始阅读"
   - 逐段进行：先听朗读（TTS），再跟读录音（ASR），最后查看评分

3. **查看历史**
   - 在书籍详情页点击"回放记录"查看所有历史朗读记录

### TTS 配置（可选）

默认使用浏览器 TTS（无需配置）。若需使用 AI 语音：

1. 在阅读页面点击设置按钮打开 TTS 配置
2. 填写 LLM TTS 服务地址（如本地 ChatTTS 或 CosyVoice）
3. 选择语音角色和参数
4. 点击"测试连接"验证

## 数据存储

所有数据以 JSON 文件形式存储在 `data/` 目录下，**无需数据库**，方便迁移和备份。

如需使用 Supabase，在 `.env.local` 中配置相关环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 脚本

```bash
# 抓取在线课程数据
npx ts-node --esm scripts/scrape-lessons.ts
```

## 许可

MIT
