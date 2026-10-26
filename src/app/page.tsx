import React from 'react';
import Link from 'next/link';
import TrustStatsBar from '@/components/TrustStatsBar';
import RequestSection from '@/components/RequestSection';
import LandingPostSection from '@/components/LandingPostSection';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-0 pb-32 overflow-hidden">
        {/* Full Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-30 opacity-50 transition-opacity duration-1000"
          style={{ backgroundImage: "url('/hero-pastel.png')" }}
        ></div>
        
        {/* Soft Overlays for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/60 to-transparent -z-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 via-transparent to-transparent -z-20"></div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-[var(--secondary)]/5 -skew-x-12 translate-x-1/4 -z-10"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full text-center lg:text-left grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          <div className="animate-slide-up lg:col-span-8">
            
            <h1 className="font-black text-[var(--primary)] mb-6 md:mb-8 tracking-tight leading-none drop-shadow-sm">
              <span className="inline-block text-5xl md:text-8xl lg:text-[7rem] italic transform rotate-3 origin-left mb-4 text-[var(--primary)]">
                &ldquo;숨&rdquo;
              </span>
              <div className="text-xl md:text-4xl lg:text-[3rem] font-bold leading-[1.4] md:leading-[1.3] text-[var(--primary)]/90" style={{wordBreak: 'keep-all', overflowWrap: 'break-word'}}>
                <span className="block">막히는 <span className="text-[var(--secondary)]">무거운 빚</span>의 굴레,</span>
                <span className="block">법무사 김형근 사무소가</span>
                <span className="block">끊어 드리겠습니다.</span>
              </div>
            </h1>

            {/* 채무자 3대 불안 즉시 해소 안심 혜택 배너 */}
            <div className="mb-8 md:mb-10 flex flex-col gap-2.5 sm:gap-3 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[var(--border)] shadow-md shadow-[var(--primary)]/5 hover:border-[#A67C52]/40 transition-all text-left">
                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#A67C52] text-white flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </span>
                <div className="text-[15px] sm:text-[17px] md:text-[18px] font-bold text-[var(--primary)] tracking-tight leading-snug break-keep">
                  <span className="text-[#A67C52] font-black">빚 독촉·추심 전화 즉시 중단</span>
                  <span className="text-[var(--primary)]/80 text-[13px] sm:text-[15px] font-medium ml-1.5 sm:ml-2">(금지명령 신속 접수)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[var(--border)] shadow-md shadow-[var(--primary)]/5 hover:border-[#A67C52]/40 transition-all text-left">
                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#A67C52] text-white flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </span>
                <div className="text-[15px] sm:text-[17px] md:text-[18px] font-bold text-[var(--primary)] tracking-tight leading-snug break-keep">
                  <span>가족·직장 전혀 모르게 </span>
                  <span className="text-[#A67C52] font-black">100% 비공개 안심 진행</span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[var(--border)] shadow-md shadow-[var(--primary)]/5 hover:border-[#A67C52]/40 transition-all text-left">
                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#A67C52] text-white flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </span>
                <div className="text-[15px] sm:text-[17px] md:text-[18px] font-bold text-[var(--primary)] tracking-tight leading-snug break-keep">
                  <span className="text-[#A67C52] font-black">착수금 0원 우선 접수</span>
                  <span className="mx-1.5 text-gray-400">·</span>
                  <span>수임료 전액 분납 시스템</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center lg:justify-start px-4 sm:px-0">
              <Link href="/qna/diagnosis" className="px-6 md:px-10 py-4 md:py-5 bg-[var(--primary)] text-white rounded-2xl font-bold text-base md:text-lg shadow-2xl shadow-[var(--primary)]/20 hover:-translate-y-1.5 transition-all text-center">
                <span>1분 자가진단 바로가기 ➔</span>
              </Link>
              <Link href="#Request" className="px-6 md:px-10 py-4 md:py-5 bg-white/80 backdrop-blur-sm border-2 border-[var(--primary)] text-[var(--primary)] rounded-2xl font-bold text-base md:text-lg hover:bg-[var(--primary)] hover:text-white transition-all text-center">
                빠른 상담 신청
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar (Replaced CaseTicker) */}
      <TrustStatsBar />

      {/* Advanced Request Section (Integrated Layout) */}
      <RequestSection />

      {/* About Section: Personal Rehabilitation */}
      <LandingPostSection 
        category="REHAB" 
        title="About 개인회생" 
        subtitle="개인회생 성공을 위한 필수 지식과 실무 노하우를 전해드립니다."
        href="/rehab/posts"
      />

      {/* About Section: Personal Bankruptcy */}
      <LandingPostSection 
        category="BANKRUPTCY" 
        title="About 개인파산" 
        subtitle="개인파산 절차와 면책을 위한 전문 법률 정보를 제공합니다."
        href="/bankruptcy/posts"
      />

      {/* Success Stories Section */}
      <LandingPostSection 
        category="SUCCESS_STORY" 
        title="성공사례" 
        subtitle="법무사 김형근 사무소가 함께 이뤄낸 소중한 재기 성공 사례들입니다."
        href="/s_story"
        limit={6}
      />

    </div>
  );
}
