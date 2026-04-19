'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ADMIN_SECRET = 'lawoffice2024admin';

const navItems = [
  { label: '대시보드', href: '/admin', icon: '📊' },
  { label: 'All 개인회생', href: '/admin/columns?cat=REHAB', icon: '⚖️' },
  { label: 'All 개인파산', href: '/admin/columns?cat=BANKRUPTCY', icon: '📋' },
  { label: '전화/방문 상담', href: '/admin/consultations', icon: '📞' },
  { label: '게시판 상담', href: '/admin/board', icon: '💬' },
  { label: '상담 신청 (리드)', href: '/admin/leads', icon: '📌' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_SECRET) {
      setAuthed(true);
      setError('');
    } else {
      setError('관리자 패스워드가 올바르지 않습니다.');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C3E50] to-[#1a2634] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#A67C52]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#A67C52]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--primary)] mb-1">관리자 로그인</h1>
            <p className="text-sm text-[var(--primary)]/50">법무사 김형근 사무소 관리자 전용</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[var(--primary)]/70 mb-2">관리자 패스워드</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="패스워드를 입력하세요"
                className="w-full px-4 py-3.5 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-[var(--primary)] font-medium"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button type="submit" className="w-full py-4 bg-[#A67C52] text-white rounded-xl font-bold text-base hover:bg-[#8B6840] transition-all shadow-lg">
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <aside className="w-64 bg-[#2C3E50] text-white flex flex-col fixed h-full z-40">
        {/* 로고 */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#A67C52] rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0112 6.042m0 12.084a8.967 8.967 0 006-3.75c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0018 3.75c-1.052 0-2.062.18-3 .512v14.25z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm leading-none">김형근 사무소</p>
              <p className="text-white/50 text-xs mt-0.5">관리자 대시보드</p>
            </div>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href.split('?')[0];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#A67C52] text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 하단 */}
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            홈페이지로 이동
          </Link>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
