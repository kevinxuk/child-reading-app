import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
      <main className="max-w-4xl mx-auto px-8 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          儿童伴读
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          AI 智能阅读助手，帮助孩子爱上阅读
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-bold mb-2">书籍录入</h3>
            <p className="text-gray-600 text-sm">
              拍照或手动输入书籍内容，AI 自动识别文字
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🔊</div>
            <h3 className="text-lg font-bold mb-2">语音朗读</h3>
            <p className="text-gray-600 text-sm">
              AI 语音朗读，让孩子听标准发音
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-lg font-bold mb-2">跟读评分</h3>
            <p className="text-gray-600 text-sm">
              录音跟读，AI 评分，积分激励学习
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/books"
            className="px-8 py-4 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition shadow-lg hover:shadow-xl"
          >
            开始阅读
          </Link>
          <Link
            href="/books/new"
            className="px-8 py-4 bg-white text-blue-500 border-2 border-blue-500 rounded-full font-medium hover:bg-blue-50 transition"
          >
            添加书籍
          </Link>
          <Link
            href="/import"
            className="px-8 py-4 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition shadow-lg hover:shadow-xl"
          >
            导入课文
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">100%</div>
            <div className="text-sm text-gray-500">免费使用</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">双语</div>
            <div className="text-sm text-gray-500">中英文支持</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">AI</div>
            <div className="text-sm text-gray-500">智能评分</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">隐私</div>
            <div className="text-sm text-gray-500">本地处理</div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>© 2025 儿童伴读 - 基于开源技术构建</p>
        <p className="mt-2">
          技术栈: Next.js + Tesseract.js + Web Speech API + Meyda
        </p>
      </footer>
    </div>
  );
}