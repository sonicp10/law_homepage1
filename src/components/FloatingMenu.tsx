'use client';

import Link from 'next/link';
import { kakaoPixelEvent } from '@/components/analytics/KakaoPixel';

const KAKAO_CHAT_URL = process.env.NEXT_PUBLIC_KAKAO_CHAT_URL || 'https://pf.kakao.com/_kRxdGX/chat';

export default function FloatingMenu() {
  const menus = [
    { icon: '📊', label: '1분 자가진단', color: 'var(--primary)', textColor: '#fff', pulse: true, href: '/qna/diagnosis' },
    { icon: '💬', label: '카톡상담', color: '#FEE500', textColor: '#000', href: KAKAO_CHAT_URL, isExternal: true },
    { icon: '📞', label: '전화상담', color: 'var(--secondary)', textColor: '#fff', href: '/qna/phone' },
    { icon: '📅', label: '방문예약', color: 'var(--success)', textColor: '#fff', href: '/qna/visit' },
    { icon: '📝', label: '게시판 상담', color: 'var(--accent)', textColor: 'var(--primary)', href: '/qna/board' },
  ];

  const handleKakaoClick = () => {
    try {
      kakaoPixelEvent.participation('KakaoChat');
    } catch {
      // ignore
    }
  };

  const handleCallClick = () => {
    try {
      kakaoPixelEvent.participation('PhoneCall');
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Desktop Floating Menu (Hidden on Mobile) */}
      <div className="hidden md:flex fixed right-6 bottom-32 z-50 flex-col gap-3">
        {menus.map((menu, idx) => {
          const itemClasses = `group relative flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl transition-all hover:scale-110 hover:-translate-x-1 ${menu.pulse ? 'animate-bounce' : ''}`;
          const content = (
            <>
              <span className="text-2xl">{menu.icon}</span>
              <span className="absolute right-full mr-4 px-4 py-2 bg-white text-[var(--primary)] text-sm font-bold rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap border border-[var(--border)]">
                {menu.label}
              </span>
              {menu.pulse && (
                <span className="absolute inset-0 rounded-2xl bg-[var(--primary)] animate-ping opacity-20"></span>
              )}
            </>
          );

          if (menu.isExternal || menu.href.startsWith('http')) {
            return (
              <a 
                key={idx}
                href={menu.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleKakaoClick}
                className={itemClasses}
                style={{ backgroundColor: menu.color, color: menu.textColor }}
                aria-label={menu.label}
              >
                {content}
              </a>
            );
          }

          return (
            <Link 
              key={idx}
              href={menu.href}
              prefetch={false}
              className={itemClasses}
              style={{ backgroundColor: menu.color, color: menu.textColor }}
              aria-label={menu.label}
            >
              {content}
            </Link>
          );
        })}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-14 h-14 bg-white border border-[var(--border)] rounded-2xl shadow-lg flex items-center justify-center text-[var(--primary)] hover:bg-[var(--background)] transition-colors"
          aria-label="맨 위로 가기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Floating Actions - Mobile (Right side, positioned above the sticky bar) */}
      <div className="md:hidden fixed right-4 bottom-[84px] z-50 flex flex-col items-center gap-2.5">
        <a
          href={KAKAO_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleKakaoClick}
          className="flex items-center justify-center w-12 h-12 rounded-2xl shadow-xl active:scale-95 transition-transform"
          style={{ backgroundColor: '#FEE500', color: '#000' }}
          aria-label="카카오톡 1:1 상담하기"
        >
          <span className="text-2xl">💬</span>
        </a>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 bg-white border border-[var(--border)] rounded-full shadow-lg flex items-center justify-center text-[var(--primary)] active:bg-gray-100"
          aria-label="맨 위로 가기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Mobile Bottom Full-Width Sticky Call Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t border-gray-200 p-2 sm:p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-8px_25px_rgba(0,0,0,0.15)]">
        <a
          href="tel:02-6405-6363"
          onClick={handleCallClick}
          className="relative flex items-center justify-center gap-2.5 sm:gap-3 w-full py-3.5 bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#1E40AF] text-white rounded-2xl shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all overflow-hidden group"
          aria-label="지금 바로 법무사와 전화 상담하기"
        >
          {/* Subtle Shine Animation */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 pointer-events-none"></div>

          {/* Pulsing Phone Icon Badge */}
          <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white shrink-0 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
            </svg>
          </span>

          {/* Typography */}
          <div className="flex flex-col items-center leading-tight">
            <span className="text-[15px] sm:text-[17px] font-black tracking-tight text-white flex items-center gap-1">
              지금 바로 법무사와 전화 상담하기
            </span>
            <span className="text-[11px] font-bold text-blue-200 mt-0.5 tracking-wide">
              02-6405-6363 · 100% 비밀보장 무료상담
            </span>
          </div>
        </a>
      </div>
    </>
  );
}
