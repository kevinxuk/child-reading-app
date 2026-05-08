## CosyVoice vs ChatTTS 对比

| 特性 | ChatTTS | CosyVoice | 推荐 |
|------|---------|-----------|------|
| **情感控制** | 笑声、停顿（隐式） | ✅ 显式情感参数 | CosyVoice |
| **中文质量** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | CosyVoice |
| **部署难度** | 中等 | 中等 | 相同 |
| **GPU 要求** | ≥4GB | ≥4GB | 相同 |
| **CPU 支持** | ⚠️ 很慢 | ✅ 可用 | CosyVoice |
| **语音克隆** | ⚠️ 需训练 | ✅ 零样本克隆 | CosyVoice |

## 快速启动

### 方式1：ChatTTS（笑声/停顿控制）

```bash
cd chattts-server
chmod +x start.sh
./start.sh# 自动下载模型并启动
```

### 方式2：CosyVoice（显式情感控制）

```bash
cd cosyvoice-server
chmod +x start.sh
./start.sh# 自动下载模型并启动
```

**注意：首次启动需要下载约1-2GB 模型文件。**

## 环境配置

在 `.env.local` 中添加：

```env
# ChatTTS 服务地址（端口9960）
CHATTTS_URL=http://localhost:9960

# 或使用 CosyVoice（同端口）
# COSYVOICE_URL=http://localhost:9960
```

## 常见问题

### Q: 为什么一直是浏览器 TTS 在生效？

**A: TTS 服务没有启动。** 解决步骤：

1. 检查服务是否运行：
   ```bash
   curl http://localhost:9960/health
   ```

2. 如果返回错误，启动服务：
   ```bash
   # ChatTTS
   cd chattts-server && ./start.sh
   
   # 或 CosyVoice
   cd cosyvoice-server && ./start.sh
   ```

3. 检查环境变量：
   ```bash
   # 在 .env.local 中添加
   CHATTTS_URL=http://localhost:9960
   ```

### Q: 没有 GPU 可以用吗？

**A: 可以！** 在启动时指定 CPU：
```bash
python server.py --device cpu
```

CPU 模式较慢，但功能完整。

### Q: 如何选择？

| 场景 | 推荐 |
|------|------|
| 儿童伴读（需要情感） | **CosyVoice** |
| 对话场景 | ChatTTS |
| 快速原型验证 | 浏览器 TTS |
| 生产环境 | CosyVoice |