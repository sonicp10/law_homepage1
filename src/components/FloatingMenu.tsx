'use client';

import Link from 'next/link';

export default function FloatingMenu() {
  const menus = [
    { icon: '📊', label: '3분 자가진단', color: 'var(--primary)', textColor: '#fff', pulse: true, href: '/qna/diagnosis' },
    { icon: '💬', label: '카톡상담', color: '#FEE500', textColor: '#000', href: '#' },
    { icon: '📞', label: '전화상담', color: 'var(--secondary)', textColor: '#fff', href: '/qna/phone' },
    { icon: '📅', label: '방문예약', color: 'var(--success)', textColor: '#fff', href: '/qna/visit' },
    { icon: '📝', label: '게시판 상담', color: 'var(--accent)', textColor: 'var(--primary)', href: '/qna/board' },
  ];

  return (
    <div className="fixed right-6 bottom-32 z-50 flex flex-col gap-3">
      {menus.map((menu, idx) => (
        <Link 
          key={idx}
          href={menu.href}
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
  );
}
