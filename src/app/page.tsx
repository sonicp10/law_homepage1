import React from 'react';
import Link from 'next/link';
import TrustStatsBar from '@/components/TrustStatsBar';
import RequestSection from '@/components/RequestSection';
import LandingPostSection from '@/components/LandingPostSection';
import FloatingMenu from '@/components/FloatingMenu';

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
            
            <h1 className="font-black text-[var(--primary)] mb-8 md:mb-10 tracking-tight leading-none drop-shadow-sm">
              <span className="inline-block text-5xl md:text-8xl lg:text-[7rem] italic transform rotate-3 origin-left mb-4 text-[var(--primary)]">
                &ldquo;숨&rdquo;
              </span>
              <div className="text-xl md:text-4xl lg:text-[3rem] font-bold leading-[1.4] md:leading-[1.3] text-[var(--primary)]/90">
                막히는 <span className="text-[var(--secondary)]">무거운 빚</span>의 굴레,<br className="hidden md:block" />
                법무사 김형근 사무소가<br />
                끊어 드리겠습니다.
              </div>
            </h1>
            
            <p className="text-lg md:text-2xl text-[var(--primary)]/90 mb-10 md:mb-14 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2 md:px-0 font-medium">
              포기하고 싶었던 순간이 있으셨나요? 그 마음 충분히<br className="hidden md:block" />
              이해합니다. 이제 내려 놓으세요! 저희가 하겠습니다.
            </p>
            
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
