'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { label: '대시보드', href: '/admin', icon: '📊', requiredPermission: null },
  { label: 'All 개인회생', href: '/admin/columns?cat=REHAB', icon: '⚖️', requiredPermission: 'canManagePosts' },
  { label: 'All 개인파산', href: '/admin/columns?cat=BANKRUPTCY', icon: '📋', requiredPermission: 'canManagePosts' },
  { label: '전화/방문 상담', href: '/admin/consultations', icon: '📞', requiredPermission: 'canManageConsultations' },
  { label: '게시판 상담', href: '/admin/board', icon: '💬', requiredPermission: 'canManageConsultations' },
  { label: '상담 신청 (리드)', href: '/admin/leads', icon: '📌', requiredPermission: 'canManageConsultations' },
  { label: '관리자 계정 관리', href: '/admin/accounts', icon: '⚙️', requiredPermission: 'canManageAdmins' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [authed, setAuthed] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    checkSession();
  }, [pathname]); // pathname 변경 시마다 세션 확인

  const checkSession = async () => {
    try {
      const res = await fetch('/api/admin/auth/me');
      const data = await res.json();
      if (data.authenticated) {
        setAuthed(true);
        setSession(data.user);
      } else {
        setAuthed(false);
        setSession(null);
      }
    } catch (err) {
      setAuthed(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        await checkSession();
      } else {
        setError(data.error || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    setAuthed(false);
    setSession(null);
    router.push('/admin');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#2C3E50] flex items-center justify-center"><div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div></div>;
  }

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
            <p className="text-sm text-[var(--primary)]/50">법무사 김형근 사무소 통합 관리시스템</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[var(--primary)]/70 mb-2">관리자 아이디 (이메일)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full px-4 py-3.5 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-[var(--primary)] font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--primary)]/70 mb-2">패스워드</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="패스워드를 입력하세요"
                required
                className="w-full px-4 py-3.5 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-[var(--primary)] font-medium"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
            <button disabled={isLoggingIn} type="submit" className="w-full py-4 bg-[#A67C52] text-white rounded-xl font-bold text-base hover:bg-[#8B6840] transition-all shadow-lg disabled:opacity-50">
              {isLoggingIn ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 메뉴 필터링 로직 (SUPERADMIN은 모두 통과)
  const filteredNavItems = navItems.filter(item => {
    if (!item.requiredPermission) return true; // 대시보드
    if (session?.role === 'SUPERADMIN') return true;
    return session?.permissions?.[item.requiredPermission];
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <aside className="w-64 bg-[#2C3E50] text-white flex flex-col fixed inset-y-0 left-0 z-40">
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
          {/* 상단 로그아웃 버튼 (모바일/작은 화면 대응) */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all mb-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            시스템 로그아웃
          </button>

          {filteredNavItems.map((item) => {
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
          <Link href="/" className="flex items-center justify-center gap-2 text-white/40 hover:text-white/70 text-xs font-medium transition-colors">
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
