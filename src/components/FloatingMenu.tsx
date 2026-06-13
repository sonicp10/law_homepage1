'use client';

import Link from 'next/link';

export default function FloatingMenu() {
  const menus = [
    { icon: '📊', label: '1분 자가진단', color: 'var(--primary)', textColor: '#fff', pulse: true, href: '/qna/diagnosis' },
    { icon: '💬', label: '카톡상담', color: '#FEE500', textColor: '#000', href: 'http://pf.kakao.com/_kRxdGX/chat' },
    { icon: '📞', label: '전화상담', color: 'var(--secondary)', textColor: '#fff', href: '/qna/phone' },
    { icon: '📅', label: '방문예약', color: 'var(--success)', textColor: '#fff', href: '/qna/visit' },
    { icon: '📝', label: '게시판 상담', color: 'var(--accent)', textColor: 'var(--primary)', href: '/qna/board' },
  ];

  return (
    <>
      {/* Desktop Floating Menu (Hidden on Mobile) */}
      <div className="hidden md:flex fixed right-6 bottom-32 z-50 flex-col gap-3">
        {menus.map((menu, idx) => (
          <Link 
            key={idx}
            href={menu.href}
            prefetch={false}
            target={menu.href.startsWith('http') ? '_blank' : undefined}
            rel={menu.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`group relative flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl transition-all hover:scale-110 hover:-translate-x-1 ${menu.pulse ? 'animate-bounce' : ''}`}
            style={{ backgroundColor: menu.color, color: menu.textColor }}
          >
            <span className="text-2xl">{menu.icon}</span>
            <span className="absolute right-full mr-4 px-4 py-2 bg-white text-[var(--primary)] text-sm font-bold rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap border border-[var(--border)]">
              {menu.label}
            </span>
            {menu.pulse && (
              <span className="absolute inset-0 rounded-2xl bg-[var(--primary)] animate-ping opacity-20"></span>
            )}
          </Link>
        ))}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-14 h-14 bg-white border border-[var(--border)] rounded-2xl shadow-lg flex items-center justify-center text-[var(--primary)] hover:bg-[var(--background)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[var(--primary)] flex items-stretch h-14 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] pb-safe">
        <Link href="/qna/diagnosis" prefetch={false} className="flex-1 flex flex-col items-center justify-center gap-0.5 border-r border-white/10 active:bg-white/10 transition-colors">
          <span className="text-lg">📊</span>
          <span className="text-[10px] font-bold text-white/90">1분 자가진단</span>
        </Link>
        <Link href="/qna/visit" prefetch={false} className="flex-1 flex flex-col items-center justify-center gap-0.5 border-r border-white/10 active:bg-white/10 transition-colors">
          <span className="text-lg">📅</span>
          <span className="text-[10px] font-bold text-white/90">방문예약</span>
        </Link>
        <Link href="/qna/phone" prefetch={false} className="flex-[1.2] flex flex-col items-center justify-center gap-0.5 bg-[var(--secondary)] active:brightness-90 transition-all text-white">
          <span className="text-lg">📞</span>
          <span className="text-[11px] font-extrabold tracking-wide">빠른 상담예약</span>
        </Link>
      </div>
      
      {/* Floating Actions - Mobile */}
      <div className="md:hidden fixed right-4 bottom-20 z-50 flex flex-col items-center gap-3">
        <Link
          href="http://pf.kakao.com/_kRxdGX/chat"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-2xl shadow-xl active:scale-95 transition-transform"
          style={{ backgroundColor: '#FEE500', color: '#000' }}
        >
          <span className="text-2xl">💬</span>
        </Link>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 bg-white border border-[var(--border)] rounded-full shadow-lg flex items-center justify-center text-[var(--primary)] active:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      </div>
    </>
  );
}
