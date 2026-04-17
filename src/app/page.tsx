import React from 'react';
import Link from 'next/link';
import TrustStatsBar from '@/components/TrustStatsBar';
import RequestSection from '@/components/RequestSection';
import FloatingMenu from '@/components/FloatingMenu';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-0 pb-32 overflow-hidden bg-[var(--background)]">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-[var(--secondary)]/5 -skew-x-12 translate-x-1/4 -z-10"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-6 w-full text-center lg:text-left grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="animate-slide-up lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-[var(--border)] shadow-sm mb-10 hover:shadow-md transition-shadow cursor-default">
              <span className="w-2.5 h-2.5 bg-[var(--secondary)] rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-[var(--primary)]/80 tracking-tight">도산 전문 법무사 직접 상담 | 수도권 전역 출장 상담</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-[var(--primary)] leading-[1.1] mb-10 tracking-tight">
              당신의 <span className="text-[var(--secondary)]">무거운 빚</span>,<br />
              따뜻한 내일로<br />
              바꿔드립니다.
            </h1>
            
            <p className="text-xl md:text-2xl text-[var(--primary)]/70 mb-14 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              딱딱한 법률 문구보다 의뢰인의 마음을 먼저 듣습니다.<br />
              김형근 법무사가 직접 당신의 재기를 끝까지 책임집니다.
            </p>
            
            <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
              <Link href="/diagnosis" className="px-10 py-5 bg-[var(--primary)] text-white rounded-2xl font-bold text-lg shadow-2xl shadow-[var(--primary)]/20 hover:-translate-y-1.5 transition-all">
                자가진단 시스템 바로가기 ➔
              </Link>
              <Link href="#Request" className="px-10 py-5 bg-white border-2 border-[var(--primary)] text-[var(--primary)] rounded-2xl font-bold text-lg hover:bg-[var(--primary)] hover:text-white transition-all">
                빠른 상담 신청
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block lg:col-span-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="relative z-10 rounded-[60px] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                <img 
                  src="/hero-consultation.png" 
                  alt="김형근 법무사 상담 현장"
                  className="w-full h-[650px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/60 via-transparent to-transparent"></div>
              </div>
              
              <div className="absolute -bottom-10 -right-10 glass-card p-10 max-w-[300px] animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 bg-[var(--accent)] rounded-2xl flex items-center justify-center text-[var(--primary)] shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6.119c0 3.868 1.579 7.371 4.125 9.873A12.007 12.007 0 0012 21.75a12.007 12.007 0 004.277-5.758 12.007 12.007 0 004.125-9.873A11.959 11.959 0 0112 2.714z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-[var(--primary)]">1:1 밀착 관리</div>
                    <div className="text-xs text-[var(--secondary)] font-bold tracking-widest uppercase">전문가 밀착 관리</div>
                  </div>
                </div>
                <p className="text-sm text-[var(--primary)]/70 leading-relaxed font-medium">
                  모든 사건은 법무사가 직접 검토하며 실시간으로 진행 상황을 공유해 드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar (Replaced CaseTicker) */}
      <TrustStatsBar />

      {/* Advanced Request Section (Integrated Layout) */}
      <RequestSection />

      {/* Service Cards with Hover Detail Layout */}
      <section className="py-32 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-[var(--secondary)] font-bold tracking-[0.3em] uppercase mb-4 block">사무소 전용 솔루션</span>
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--primary)] mb-8">의뢰인을 위한 맞춤형 솔루션</h2>
            <div className="w-24 h-1.5 bg-[var(--accent)] mx-auto rounded-full"></div>
          </div>
          

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                title: "개인회생", 
                desc: "원금 최대 90% 탕감, 연체 전후 모두 신청 가능합니다.",
                stats: "평균 탕감률 78%",
                color: "var(--secondary)",
                tag: "소득자 최적화"
              },
              { 
                title: "개인파산", 
                desc: "소득 증빙이 어려운 고령자나 무소득자를 위한 완전 면책 제도입니다.",
                stats: "완전 면책률 99%",
                color: "var(--accent)",
                tag: "신속한 면책"
              },
              { 
                title: "사후 관리", 
                desc: "인가 후 신용도 회복 및 등본 관리까지 꼼꼼하게 도와드립니다.",
                stats: "신용회복 만족도 1위",
                color: "#E8E4D8",
                tag: "마지막 단계"
              }
            ].map((service, idx) => (
              <div key={idx} className="group relative h-[400px] bg-white rounded-[var(--radius-card)] p-10 border border-[var(--border)] overflow-hidden transition-all hover:border-[var(--secondary)] shadow-sm hover:shadow-2xl hover:-translate-y-2">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="inline-block px-3 py-1 bg-[var(--background)] text-[var(--primary)]/50 text-[10px] font-bold rounded-md mb-6 w-fit uppercase tracking-tighter">
                    {service.tag}
                  </div>
                  <h3 className="text-3xl font-bold text-[var(--primary)] mb-6 group-hover:text-[var(--secondary)] transition-colors">{service.title}</h3>
                  <p className="text-[var(--primary)]/60 leading-relaxed mb-auto group-hover:text-[var(--primary)]/80">
                    {service.desc}
                  </p>
                  
                  <div className="mt-8 pt-8 border-t border-[var(--border)]">
                    <div className="text-3xl font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors font-outfit">
                      {service.stats}
                    </div>
                    <div className="text-xs text-[var(--primary)]/40 font-bold mt-1">김형근 사무소 실제 데이터 기준</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[var(--background)] -z-0 group-hover:scale-[3] transition-transform duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
