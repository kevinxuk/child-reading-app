# 儿童伴读 App - 完整启动指南

## 快速开始

### 1. 启动前端（已运行）

```bash
cd /Users/a1/Documents/child/child-reading-app
npm run dev
```

访问: http://localhost:3000

---

## TTS 服务配置（二选一）

### 方案 A：ChatTTS（笑声/停顿控制）

```bash
cd chattts-server

# 首次运行：安装依赖
pip install -r requirements.txt

# 启动服务
chmod +x start.sh
./start.sh
```

**特点**：
- 笑声控制 `[laugh]`
- 停顿控制 `[break]`
- 需要 GPU（4GB+ 显存）

---

### 方案 B：CosyVoice（推荐 - 显式情感控制）

```bash
cd cosyvoice-server

# 首次运行：安装依赖
pip install -r requirements.txt

# 首次运行：下载模型（约 1-2GB）
python -c "from modelscope import snapshot_download; snapshot_download('iic/CosyVoice-300M', local_dir='pretrained_models/CosyVoice-300M')"

# 启动服务
chmod +x start.sh
./start.sh
```

**特点**：
- ✅ 显式情感参数（开心/兴奋/平静/悲伤）
- ✅ 中文质量更好
- ✅ 支持零样本语音克隆
- ✅ CPU 可用（较慢但功能完整）

---

## 验证服务状态

### 检查 TTS 服务

```bash
curl http://localhost:9960/health
```

正常返回：
```json
{"status": "healthy", "model_loaded": true}
```

### 检查前端连接

```bash
curl http://localhost:3000/api/tts
```

返回示例：
```json
{
  "voices": [...],
  "engine": "cosyvoice",
  "available": true,
  "message": "TTS 服务正常"
}
```

---

## 端口说明

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 | 3000 |localhost:3000 |
| ChatTTS | 9960 | localhost:9960 |
| CosyVoice | 9960 | localhost:9960（与 ChatTTS 共用端口） |

---

## 硬件要求

### ChatTTS
- GPU: NVIDIA，推荐 RTX 3060+
- 显存: ≥ 4GB
- 内存: ≥ 8GB

### CosyVoice
- GPU: 可选（推荐）
- 显存: ≥ 4GB（如果有GPU）
- 内存: ≥ 8GB
- CPU: 可用（速度较慢）

---

## 情感参数对照表

### ChatTTS

| 参数 | 范围 | 效果 |
|------|------|------|
| oral | 0-9 | 口语化程度 |
| laugh | 0-2 | 笑声强度 |
| break_level | 0-7 | 停顿级别 |

### CosyVoice

| 情感 | 提示词 |
|------|--------|
| happy | "用开心愉快的语气说：" |
| excited | "用兴奋激动的语气说：" |
| neutral | (无提示词) |
| calm | "用平静温和的语气说：" |
| sad | "用悲伤沉重的语气说：" |

---

## 常见问题

### Q: 一直是浏览器 TTS？

**A: TTS 服务未启动。** 解决：
```bash
# 检查服务
curl http://localhost:9960/health

# 如果无响应，启动服务
cd chattts-server  # 或 cosyvoice-server
./start.sh
```

### Q: 模型下载慢？

**A: 使用国内镜像：**
```bash
# ModelScope 国内镜像
export MODELSCOPE_CACHE=~/.cache/modelscope
python -c "from modelscope import snapshot_download; ..."
```

### Q: GPU 内存不足？

**A: 使用 CPU 模式：**
```bash
python server.py --device cpu
```

---

## 项目结构

```
child-reading-app/
├── src/
│   ├── app/
│   │   ├── page.tsx          # 首页
│   │   ├── books/            # 书架
│   │   ├── read/[id]/        # 阅读页面（TTS + 录音 + 评分）
│   │   ├── import/           # 导入课文
│   │   └── api/tts/          # TTS API
│   ├── lib/
│   │   ├── tts.ts            # TTS 库（支持 ChatTTS + CosyVoice）
│   │   ├── asr.ts            # 语音识别
│   │   └── scoring.ts        # 评分算法
│   └── data/
│       └── lessons.ts        # 课文数据
├── chattts-server/           # ChatTTS 服务
├── cosyvoice-server/         # CosyVoice 服务
└── .env.local               # 环境配置
```

---

## 一键启动脚本（可选）

创建 `start-all.sh`：

```bash
#!/bin/bash

# 启动前端
cd /Users/a1/Documents/child/child-reading-app
npm run dev &

# 等待前端启动
sleep 5

# 启动 TTS 服务（选择一个）
cd cosyvoice-server
./start.sh &

echo "====================================="
echo "服务已启动："
echo "前端: http://localhost:3000"
echo "TTS: http://localhost:9960"
echo "====================================="
```

---

## 下一步

1. ✅ 前端已运行
2. ⬜ 选择 TTS 服务（ChatTTS 或 CosyVoice）
3. ⬜ 启动 TTS 服务
4. ⬜ 验证服务状态
5. ⬜ 在阅读页面测试情感语音