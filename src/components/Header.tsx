import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section - Concept 2: Minimal Line Style */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            {/* Abstract Minimal Icon (Concept 2 Style) */}
            <div className="w-10 h-10 bg-[#A67C52]/10 rounded-xl flex items-center justify-center transition-all group-hover:bg-[#A67C52]/20 rotate-3 group-hover:rotate-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-[#A67C52]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0112 6.042m0 12.084a8.967 8.967 0 006-3.75c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0018 3.75c-1.052 0-2.062.18-3 .512v14.25z" />
              </svg>
            </div>
            {/* Soft Glow Effect */}
            <div className="absolute -inset-1 bg-[var(--secondary)]/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[var(--primary)] leading-none mb-1">법무사 <span className="text-[#A67C52] font-extrabold">김형근</span> 사무소</span>
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-3 bg-[#A67C52]"></span>
              <span className="text-[10px] text-[var(--primary)]/60 font-bold tracking-[0.3em] uppercase">All About 회생파산</span>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/intro" className="text-sm font-bold text-[var(--primary)]/70 hover:text-[var(--primary)] transition-colors">회사소개</Link>
          <Link href="/rehab" className="text-sm font-bold text-[var(--primary)]/70 hover:text-[var(--primary)] transition-colors">개인회생</Link>
          <Link href="/bankruptcy" className="text-sm font-bold text-[var(--primary)]/70 hover:text-[var(--primary)] transition-colors">개인파산</Link>
          <Link href="/s_story" className="text-sm font-bold text-[var(--primary)]/70 hover:text-[var(--primary)] transition-colors">성공사례</Link>
          <Link href="/qna" className="text-sm font-bold text-[var(--primary)]/70 hover:text-[var(--primary)] transition-colors">상담문의</Link>
        </nav>

        {/* CTA Button */}
        <Link href="/diagnosis" className="px-6 py-2.5 bg-[var(--accent)] text-[var(--primary)] rounded-full font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
          1분 자가진단
        </Link>
      </div>
    </header>
  );
}
