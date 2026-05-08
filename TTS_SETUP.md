# TTS 配置说明

## 当前状态

✅ **浏览器 TTS** - 已可用，无需配置
- 进入阅读页面即可使用
- 自动朗读功能完整

⚠️ **ChatTTS** - 需要Python 3.10-3.12
- 当前系统 Python 3.14 不兼容
- 需要使用 conda 或 pyenv 安装 Python 3.10

❌ **CosyVoice** - 需要 NVIDIA GPU
- Apple Silicon Mac 无法运行
- 需要 Linux/Windows + NVIDIA GPU

---

## 方案选择

### 方案 1：浏览器 TTS（推荐）

**无需配置，已可用！**

访问 http://localhost:3000/read/[id] 即可使用。

---

### 方案 2：使用 conda 安装 Python 3.10 运行 ChatTTS

```bash
#安装 Miniforge（Apple Silicon 版本）
brew install --cask miniforge

# 创建 Python 3.10 环境
conda create -n chattts python=3.10
conda activate chattts

# 启动 ChatTTS
cd chattts-server
./start-cpu.sh
```

---

### 方案 3：使用云服务（最简单）

如果您有云服务器或远程机器，可以在那里运行 ChatTTS/CosyVoice，然后修改 `.env.local`：

```env
CHATTTS_URL=http://your-server-ip:9960
```

---

## 前端配置

前端已自动配置：
- TTS 服务不可用时 → 自动使用浏览器 TTS
- TTS 服务可用时 → 显示情感选择界面

无需额外配置！

---

## 测试

```bash
# 检查前端
curl http://localhost:3000/api/tts

# 应该返回：
# {"voices":[...],"engine":"browser","available":false,"message":"TTS 服务未启动"}
```

---

## 功能对比

| 功能 | 浏览器 TTS | ChatTTS | CosyVoice |
|------|-----------|---------|-----------|
| 中英文 | ✅ | ✅ | ✅ |
| 情感控制 | ❌ | ✅ 笑声/停顿 | ✅ 显式情感 |
| 本地部署 | ✅ | ✅ CPU 较慢 | ❌ 需 GPU |
| 苹果芯片 | ✅ | ⚠️ 需配置 | ❌ |
| 质量 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |