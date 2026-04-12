'use client';

import React, { useState } from 'react';

export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState('qual');

  const content = {
    rehab: {
      title: "개인회생",
      label: "직장인 / 영업소득자용",
      color: "var(--secondary)",
      bg: "#E3F2FD",
      desc: "장래 계속적 또는 반복하여 수입을 얻을 가능성이 있는 자가 3~5년간 일정 금액을 변제하면 나머지 채무를 면제받는 제도입니다.",
      qual: ["월 평균 소득이 최저생계비보다 많은 분", "총 채무액이 무담보 10억, 담보 15억 이하인 분", "현재 소득 증빙이 가능한 직장인 또는 사업자"],
      process: ["신청서 접수", "금지/중지 명령", "회생위원 면담", "개시결정", "변제계획 인가", "면책 결정"],
      benefit: "집행 중지, 신용 회복, 원금 최대 90% 감면, 전문직 자격 유지"
    },
    bankruptcy: {
      title: "개인파산",
      label: "고령자 / 소득무용",
      color: "var(--success)",
      bg: "#E8F5E9",
      desc: "자신의 재산으로 모든 채무를 변제할 수 없는 상태에 빠진 분들을 위해 법원이 파산을 선고하고 면책을 통해 채무를 탕감해주는 제도입니다.",
      qual: ["소득이 없거나 최저생계비 미만인 분", "채무가 자산보다 월등히 많은 분", "고령, 장애, 질병 등으로 근로 능력이 없는 분"],
      process: ["파산/면책 신청", "심문 및 예납", "파산선고", "파산관재인 조사", "면책결정"],
      benefit: "모든 채무 100% 탕감, 신용불량 기록 삭제, 경제적 재기 기회"
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-6">사업분야</h1>
        <div className="w-12 h-1 bg-[var(--secondary)] mx-auto mb-8 rounded-full"></div>
        <p className="text-lg md:text-xl text-[var(--primary)]/60 font-medium">
          여러분의 상황에 맞는 최적의 회복 경로를 제시합니다.
        </p>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {(['rehab', 'bankruptcy'] as const).map((key) => (
          <div 
            key={key} 
            className="relative overflow-hidden group rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-8 md:p-10 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2"
          >
            <div 
              className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 transition-transform group-hover:scale-150"
              style={{ backgroundColor: content[key].color }}
            ></div>
            
            <div className="relative">
              <span 
                className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-6"
                style={{ backgroundColor: content[key].bg, color: content[key].color }}
              >
                {content[key].label}
              </span>
              <h2 className="text-3xl font-black text-[var(--primary)] mb-4">{content[key].title}</h2>
              <p className="text-[var(--primary)]/70 leading-relaxed mb-8 min-h-[80px]">
                {content[key].desc}
              </p>
              
              {/* Tabs within card */}
              <div className="space-y-6">
                <div className="flex border-b border-[var(--border)] text-sm">
                  {['qual', 'process', 'benefit'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 px-4 font-bold transition-colors relative ${
                        activeTab === tab ? 'text-[var(--primary)]' : 'text-[var(--primary)]/40 hover:text-[var(--primary)]/60'
                      }`}
                    >
                      {tab === 'qual' ? '신청자격' : tab === 'process' ? '진행절차' : '주요혜택'}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-[var(--primary)] rounded-full"></span>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="min-h-[150px] animate-slide-up">
                  {activeTab === 'qual' && (
                    <ul className="space-y-3">
                      {content[key].qual.map((q, i) => (
                        <li key={i} className="flex gap-3 items-start text-sm md:text-base text-[var(--primary)]/80">
                          <span className="mt-1 w-5 h-5 flex-shrink-0 bg-[var(--background)] rounded-full flex items-center justify-center text-[10px] text-[var(--primary)] font-bold">✓</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  )}
                  {activeTab === 'process' && (
                    <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                      {content[key].process.map((p, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="px-3 py-1.5 bg-[var(--surface)] text-[var(--primary)]/70 rounded-full font-medium">
                            {i + 1}. {p}
                          </span>
                          {i < content[key].process.length - 1 && <span className="text-[var(--border)]">→</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'benefit' && (
                    <p className="p-4 bg-[var(--surface)]/50 rounded-xl text-[var(--primary)] text-sm md:text-base leading-relaxed border-l-4" style={{ borderColor: content[key].color }}>
                      {content[key].benefit}
                    </p>
                  )}
                </div>
              </div>

              <button className="w-full mt-10 py-4 rounded-xl bg-[var(--primary)] text-white font-bold text-lg hover:shadow-lg transition-all active:scale-95">
                나는 어디에 해당할까? 1분 진단
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-[var(--surface)] rounded-[var(--radius-card)] p-8 md:p-12 overflow-hidden">
        <h3 className="text-2xl font-bold text-center mb-10 text-[var(--primary)]">한눈에 비교하는 회생 vs 파산</h3>
        <div className="grid grid-cols-3 gap-[1px] bg-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-white p-6 font-bold text-center text-[var(--primary)]/60">구분</div>
          <div className="bg-white p-6 font-black text-center text-[var(--secondary)]">개인회생</div>
          <div className="bg-white p-6 font-black text-center text-[var(--success)]">개인파산</div>
          
          {/* Row 1 */}
          <div className="bg-white p-6 font-bold text-center text-[var(--primary)]/60">신청 자격</div>
          <div className="bg-white p-8 text-sm text-[var(--primary)]/80">정기적인 소득이 있는 자</div>
          <div className="bg-white p-8 text-sm text-[var(--primary)]/80">소득이 없거나 최저생계비 미만</div>
          
          {/* Row 2 */}
          <div className="bg-white p-6 font-bold text-center text-[var(--primary)]/60">변제 기간</div>
          <div className="bg-white p-8 text-sm text-[var(--primary)]/80">3년 ~ 5년 (분할 변제)</div>
          <div className="bg-white p-8 text-sm text-[var(--primary)]/80">단기 (자산 처분 및 즉시 처분)</div>
          
          {/* Row 3 */}
          <div className="bg-white p-6 font-bold text-center text-[var(--primary)]/60">채무 감면</div>
          <div className="bg-white p-8 text-sm text-[var(--primary)]/80">원금 최대 90% (이자 100%)</div>
          <div className="bg-white p-8 text-sm text-[var(--primary)]/80">채무 원금 100% (전액 면책)</div>
          
          {/* Row 4 */}
          <div className="bg-white p-6 font-bold text-center text-[var(--primary)]/60">최대의 장점</div>
          <div className="bg-white p-8 text-sm text-[var(--primary)]/80">자격 유지 가능, 자산 보존 가능</div>
          <div className="bg-white p-8 text-sm text-[var(--primary)]/80">빠른 경제적 재기, 채무 완전 소멸</div>
        </div>
      </div>
    </div>
  );
}
