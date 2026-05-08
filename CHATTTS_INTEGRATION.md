# 儿童伴读App - ChatTTS 集成完成

##已完成的集成

### 1. ChatTTS 服务端 (`chattts-server/`)

- `server.py` - FastAPI 服务，支持情感参数
- `requirements.txt` - Python 依赖
- `Dockerfile` - Docker 镜像配置
- `docker-compose.yml` - Docker Compose 配置
- `start.sh` - 快速启动脚本
- `README.md` - 详细使用说明

### 2. Next.js API 更新

- `src/app/api/tts/route.ts` - 调用 ChatTTS 服务
- `src/lib/tts.ts` - 前端 TTS 库（支持 ChatTTS + 浏览器回退）

### 3. 前端 UI 更新

- `src/app/read/[id]/page.tsx` - 添加情感选择UI- 支持5种情感：开心、兴奋、平静、悲伤、中性
  - 支持选择不同音色

## 使用方式

### 方式1：启动ChatTTS 服务（需要 GPU）

```bash
cd chattts-server
chmod +x start.sh
./start.sh
```

### 方式2：Docker 启动

```bash
cd chattts-server
docker-compose up -d
```

### 方式3：仅使用浏览器 TTS

如果ChatTTS 服务不可用，系统会自动回退到浏览器 TTS。

## API 端点

### ChatTTS 服务 (端口 9960)

-`POST /tts` - 文本转语音
  - 参数：text, speaker, temperature, top_p, top_k, oral, laugh, break_level, speed
  - 返回：audio/wav

- `GET /voices` - 获取可用声音列表

- `POST /speaker/sample` - 采样新音色

### Next.js API

- `POST /api/tts` - 代理到 ChatTTS服务
  - 参数：text, voice, speed, emotion
  - emotion 支持：happy, excited, neutral, calm, sad

## 情感控制说明

ChatTTS 通过以下参数控制情感表达：

| 情感 | oral | laugh | break_level | 效果 |
|------|------|-------|--------------|------|
| happy | 3 | 1 | 4 | 欢快 + 笑声 |
| excited | 4 | 2 | 3 | 兴奋 + 大笑 |
| neutral | 2 | 0 | 4 | 中性朗读 |
| calm | 1 | 0 | 5 | 平静缓慢 |
| sad | 1 | 0 | 6 | 悲伤缓慢 |

## 环境变量

在 `.env.local` 中配置：

```env
CHATTTS_URL=http://localhost:9960
```

## 硬件要求

| 配置 | 最低要求 |
|------|----------|
| GPU | NVIDIA，推荐 RTX 3060+ |
| 显存 | ≥ 4GB |
| 内存 | ≥8GB |

CPU 模式可用，但生成速度较慢。