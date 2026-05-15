'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import SettingsModal from './SettingsModal';
import { useStore } from '@/store/useStore';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  activeIcon: string;
}

const navItems: NavItem[] = [
  { href: '/', label: '首页', icon: '🏠', activeIcon: '🏠' },
  { href: '/books', label: '书架', icon: '📚', activeIcon: '📖' },
  { href: '/textbooks', label: '课本库', icon: '📖', activeIcon: '📖' },
  { href: '/stats', label: '统计', icon: '📊', activeIcon: '📈' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [credits, setCredits] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { selectedGrade } = useStore();

  useEffect(() => {
    fetchCredits();
  }, [pathname]);

  // 路由切换时关闭菜单
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/credits');
      const data = await response.json();
      if (data.success) {
        setCredits(data.data.points ?? 0);
      }
    } catch {}
  };

  // 阅读页面不显示导航栏
  if (pathname.startsWith('/read/')) {
    return null;
  }

  return (
    <>
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 hover:text-blue-700 transition">
            <span className="text-xl">🧒</span>
            <span className="hidden sm:inline">儿童伴读</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <span className="text-base">{isActive ? item.activeIcon : item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile: Menu Button + Credits */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Grade Badge */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 rounded-full text-sm font-medium text-purple-700 hover:bg-purple-100 transition"
              title="打开设置"
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">
                {selectedGrade === 'all' ? '全部' : `${selectedGrade}年级`}
              </span>
            </button>

            {/* Credits Badge */}
            <Link
              href="/stats"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 rounded-full text-sm font-medium text-yellow-700 hover:bg-yellow-100 transition"
            >
              <span>🪙</span>
              <span>{credits}</span>
            </Link>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-100 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <span className="text-lg">{isActive ? item.activeIcon : item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>

    {/* Settings Modal */}
    {settingsOpen && (
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    )}</>
  );
}
