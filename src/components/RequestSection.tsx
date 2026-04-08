'use client';

import React, { useState } from 'react';

export default function RequestSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    debtAmount: '',
    content: ''
  });

  const tickers = [
    { name: '김*현', region: '서울 은평구', status: '8,400만원 탕감 결정' },
    { name: '이*우', region: '경기 안양시', status: '개인회생 개시 결정' },
    { name: '박*준', region: '인천 연수구', status: '채무 전액 면책 확정' },
    { name: '최*희', region: '충남 천안시', status: '92% 탕감인가 완료' },
    { name: '정*민', region: '서울 강남구', status: '상담 예약 대기 중' },
    { name: '윤*영', region: '부산 해운대', status: '회생 개시 신청 접수' },
  ];

  // 무한 루프를 위해 데이터를 3배로 복제하여 끊김 없는 흐름 보장
  const repeatedTickers = [...tickers, ...tickers, ...tickers];

  return (
    <section id="Request" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* 1. Left: Real-time Ticker List (Optimized for Seamless Loop) */}
          <div className="lg:w-1/2 flex flex-col w-full">
            <div className="mb-8">
              <span className="text-[var(--secondary)] font-bold tracking-widest text-sm uppercase mb-2 block">Real-time Status</span>
              <h2 className="text-3xl font-bold text-[var(--primary)]">실시간 상담 및 결과 현황</h2>
            </div>
            
            <div className="relative h-[560px] bg-[var(--background)] rounded-[var(--radius-card)] p-6 overflow-hidden border border-[var(--border)]">
              <div className="space-y-4 animate-scroll-vertical">
                {repeatedTickers.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--border)] flex justify-between items-center transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[var(--secondary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] font-bold text-xs">
                        {item.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[var(--primary)]">{item.name} <span className="text-xs font-normal text-gray-400">({item.region})</span></div>
                        <div className="text-[10px] text-[var(--secondary)] font-bold uppercase tracking-wider">Verified Result</div>
                      </div>
                    </div>
                    <div className="text-[var(--primary)] font-bold text-sm bg-[var(--accent)]/30 px-3 py-1 rounded-full">
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
              {/* Vertical Fade Overlay for Smooth Appearance */}
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[var(--background)] via-[var(--background)]/80 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent z-10 pointer-events-none"></div>
            </div>
          </div>

          {/* 2. Right: Quick Request Form (Aligned Height/Position) */}
          <div className="lg:w-1/2 w-full pt-12 lg:pt-16"> {/* 상단 패딩 추가로 높이 균형 조정 */}
            <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-card)] p-8 md:p-10 shadow-2xl shadow-[var(--accent)]/15">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-[var(--primary)] mb-2">빠른 상담 신청</h3>
                <p className="text-[var(--primary)]/60 text-sm">지금 신청하시면 10분 내로 전문 상담원이 연락드립니다.</p>
              </div>
              
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--primary)]/70 mb-2 ml-1">이름</label>
                    <input 
                      type="text" 
                      placeholder="성함 입력"
                      className="w-full px-4 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--primary)]/70 mb-2 ml-1">연락처</label>
                    <input 
                      type="tel" 
                      placeholder="010-0000-0000"
                      className="w-full px-4 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--primary)]/70 mb-2 ml-1">지역</label>
                    <input 
                      type="text" 
                      placeholder="예: 서울 서초구"
                      className="w-full px-4 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--primary)]/70 mb-2 ml-1">총 채무액 (선택)</label>
                    <input 
                      type="text" 
                      placeholder="예: 5,000만원"
                      className="w-full px-4 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--primary)]/70 mb-2 ml-1">고민 내용 (선택)</label>
                  <textarea 
                    rows={3}
                    placeholder="상담받고 싶은 내용을 간단히 적어주세요."
                    className="w-full px-4 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm resize-none"
                  ></textarea>
                </div>

                <div className="flex items-start gap-3 py-2">
                  <input type="checkbox" className="mt-1 accent-[var(--secondary)]" id="agree" />
                  <label htmlFor="agree" className="text-[11px] text-[var(--primary)]/50 leading-tight">
                    개인정보 수집 및 이용에 동의합니다. 입력하신 정보는 법률 상담 목적으로만 사용되며 SSL 암호화로 안전하게 보호됩니다.
                  </label>
                </div>

                <button className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-[var(--primary)]/20 hover:-translate-y-1 transition-all">
                  무료 안심 상담 신청하기
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes scrollVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.33%); } /* 3배 복제했으므로 1/3 지점에서 리프레시 */
        }
        .animate-scroll-vertical {
          animation: scrollVertical 35s linear infinite;
        }
        .animate-scroll-vertical:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
