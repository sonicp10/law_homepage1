import React from 'react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="max-w-2xl w-full text-center py-20 animate-slide-up">
        {/* Decorative Element */}
        <div className="mb-10 inline-flex items-center justify-center w-24 h-24 bg-[var(--accent)]/10 rounded-[30px] text-[var(--secondary)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83m0 0a2.978 2.978 0 01-1.35-1.35m1.35 1.35L21 5.25A2.652 2.652 0 0017.25 1.5l-5.83 5.83m0 0a2.978 2.978 0 01-1.35 1.35m1.35 1.35L5.25 21A2.652 2.652 0 011.5 17.25l5.83-5.83m0 0a2.978 2.978 0 011.35-1.35m-1.35 1.35L1.5 5.25A2.652 2.652 0 015.25 1.5l5.83 5.83m0 0a2.978 2.978 0 011.35 1.35" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-[var(--primary)] mb-6 tracking-tight">
          서비스 점검 중입니다
        </h1>
        
        <div className="h-1.5 w-24 bg-[var(--secondary)] mx-auto mb-8 rounded-full"></div>

        <p className="text-xl md:text-2xl text-[var(--primary)]/70 mb-12 leading-relaxed">
          더욱 안정적이고 전문적인 법률 서비스를 제공하기 위해<br className="hidden md:block" />
          홈페이지 리뉴얼 및 시스템 점검을 진행하고 있습니다.
        </p>

        <div className="glass-card p-8 inline-block">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[var(--secondary)] font-bold text-sm tracking-widest uppercase">Contact</span>
            <span className="text-2xl font-bold text-[var(--primary)]">상담 문의: 02-6405-5363</span>
            <p className="text-sm text-[var(--primary)]/50 mt-2">
              점검 중에도 유선 상담은 정상적으로 가능합니다.
            </p>
          </div>
        </div>

        <div className="mt-16 text-[var(--primary)]/30 text-sm font-medium">
          &copy; 2024 법무사 김형근 사무소. All rights reserved.
        </div>
      </div>
    </div>
  );
}
