'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function BusinessPage() {
  const [activeTabs, setActiveTabs] = useState({
    rehab: 'qual',
    bankruptcy: 'qual'
  });

  const content = {
    rehab: {
      title: "✨ 개인회생",
      label: "급여소득자 / 영업소득자",
      color: "var(--secondary)",
      bg: "#FDF4E3",
      desc: "장래에 계속적이고 반복적으로 수입을 얻을 가능성이 있는 채무자가, 수입 중 생계비를 제외한 금액을 3~5년간 성실히 변제하면 남은 빚을 면책해주는 '회생형' 제도입니다.",
      qual: [
        "지급불능 상태이거나 그러한 염려가 있는 개인채무자",
        "자영업자, 직장인, 프리랜서 등 정기적 수입이 있는 분",
        "무담보 10억, 담보 15억 이하의 채무 한도 내 신청"
      ],
      process: [
        "신청서/계획안 제출", "중지/금지명령 발령", "법원 개시결정", "채권 조사 및 확정",
        "채권자집회 개최", "변제계획 인가결정", "변제계획 수행", "최종 면책결정"
      ],
      benefits: [
        { title: "재산 유지 가능", desc: "주택, 자동차 등 보유 재산을 처분하지 않고 유지할 수 있습니다.", icon: "🏠" },
        { title: "독촉/압류 방어", desc: "중지명령을 통해 채권자의 부당한 독촉과 강제집행을 즉시 차단합니다.", icon: "🛡️" },
        { title: "신분 불이익 없음", desc: "자격 유지 및 공·사법상 불이익 없이 사회적 활동이 보장됩니다.", icon: "👤" },
        { title: "폭넓은 구제", desc: "낭비나 도박성 채무라도 면책 사유에 해당하여 구제가 가능합니다.", icon: "✨" }
      ]
    },
    bankruptcy: {
      title: "🕊️ 개인파산",
      label: "영업자 / 비영업자 / 무소득자 등 무관",
      color: "#2E7D32",
      bg: "#E8F5E9",
      desc: "지급불능 상태의 채무자가 보유 재산을 환가하여 채권자에게 배당한 뒤, 남은 모든 빚을 전액 탕감받아 새로운 출발을 지원하는 '청산형' 제도입니다.",
      qual: [
        "객관적으로 빚을 일반적·계속적으로 갚을 수 없는 상태",
        "부담하고 있는 채무 액수에 대한 어떠한 제한도 없음",
        "최저생계비 이상의 소득이 없거나 소득 증빙이 어려운 분"
      ],
      process: [
        "파산/면책 동시신청", "서면심사/예납명령", "파산선고/관재인선임", "면책불허가 사유조사",
        "채권자집회/심문기일", "파산재단 환가/배당", "파산절차 종결/폐지", "최종 면책/복권"
      ],
      benefits: [
        { title: "전액 채무 탕감", desc: "면책 확정 시 모든 빚의 책임이 사라지는 가장 효과적인 구제수단입니다.", icon: "💯" },
        { title: "미래 소득 100% 확보", desc: "파산 이후의 소득은 빚을 갚는 데 쓰지 않고 온전히 본인의 재산이 됩니다.", icon: "💰" },
        { title: "신속한 복귀", desc: "수년간 갚아야 하는 회생에 비해 단기간에 빚의 굴레에서 벗어납니다.", icon: "⚡" },
        { title: "새로운 출발", desc: "모든 법적 제약이 해소(복권)되어 평범한 일상으로의 복귀가 가능합니다.", icon: "🌱" }
      ]
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-6 tracking-tight">업무분야</h1>
        <div className="w-12 h-1 bg-[var(--secondary)] mx-auto mb-8 rounded-full"></div>
        <div className="text-xl md:text-2xl text-[var(--primary)]/70 font-semibold leading-relaxed max-w-3xl mx-auto flex items-center justify-center flex-wrap gap-y-2">
          <span>막막한 부채의 끝, 당신이 다시</span>
          <div className="flex items-center mx-2 h-12">
            <span className="text-[var(--primary)] font-black text-2xl md:text-3xl self-start translate-y-1">“</span>
            <span className="inline-block text-[var(--primary)] font-black text-4xl md:text-5xl rotate-12 transform hover:scale-110 transition-transform cursor-default px-1">숨</span>
            <span className="text-[var(--primary)] font-black text-2xl md:text-3xl self-end -translate-y-1">”</span>
          </div>
          <span className="text-[var(--primary)] font-black">쉴 수 있도록</span>
        </div>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
        {(['rehab', 'bankruptcy'] as const).map((key) => (
          <div 
            key={key} 
            className="relative overflow-hidden group rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-8 md:p-12 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col"
          >
            <div 
              className="absolute top-0 right-0 w-40 h-40 -mr-20 -mt-20 rounded-full opacity-10 transition-transform group-hover:scale-150"
              style={{ backgroundColor: content[key].color }}
            ></div>
            
            <div className="relative flex-grow">
              <span 
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-black mb-6 shadow-sm border"
                style={{ backgroundColor: content[key].bg, color: content[key].color, borderColor: `${content[key].color}20` }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: content[key].color }}></span>
                {content[key].label}
              </span>
              <h2 className="text-3xl font-black text-[var(--primary)] mb-6 tracking-tight">{content[key].title}</h2>
              <p className="text-[var(--primary)]/70 text-lg leading-relaxed mb-10 min-h-[100px]">
                {content[key].desc}
              </p>
              
              {/* Tabs within card */}
              <div className="space-y-8">
                <div className="grid grid-cols-3 border-b border-[var(--border)] text-[14px] sm:text-[15px]">
                  {['qual', 'process', 'benefits'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTabs(prev => ({ ...prev, [key]: tab }))}
                      className={`pb-4 px-1 sm:px-6 font-bold transition-colors relative whitespace-nowrap text-center flex items-center justify-center ${
                        activeTabs[key] === tab ? 'text-[var(--primary)]' : 'text-[var(--primary)]/40 hover:text-[var(--primary)]/60'
                      }`}
                    >
                      {tab === 'qual' ? '신청자격' : tab === 'process' ? '진행절차' : '주요혜택'}
                      {activeTabs[key] === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-[var(--primary)] rounded-full"></span>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="min-h-[280px] animate-slide-up">
                  {activeTabs[key] === 'qual' && (
                    <ul className="space-y-4">
                      {content[key].qual.map((q, i) => (
                        <li key={i} className="flex gap-4 items-start text-base md:text-lg text-[var(--primary)]/80 font-medium">
                          <span className="mt-1 w-6 h-6 flex-shrink-0 bg-[var(--surface)] border border-[var(--border)] rounded-full flex items-center justify-center text-[12px] text-[var(--primary)] font-bold">✓</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  )}
                  {activeTabs[key] === 'process' && (
                    <div className="grid grid-cols-2 gap-3">
                      {content[key].process.map((p, i) => (
                        <div key={i} className="relative group/step">
                          <div className={`p-4 rounded-xl border border-[var(--border)] ${i === 0 ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--primary)]/70'} transition-all hover:border-[var(--secondary)]`}>
                            <div className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">Step {i + 1}</div>
                            <div className="font-bold text-sm leading-tight">{p}</div>
                          </div>
                          {i < content[key].process.length && i % 2 === 0 && (
                             <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[var(--border)]">➔</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTabs[key] === 'benefits' && (
                    <div className="grid grid-cols-1 gap-3">
                      {content[key].benefits.map((b, i) => (
                        <div key={i} className="p-4 bg-[var(--surface)] border-l-4 border-[var(--border)] rounded-r-xl group/benefit transition-all hover:bg-white hover:shadow-lg" style={{ borderColor: content[key].color }}>
                           <div className="flex items-center gap-3 mb-1">
                             <span className="text-xl">{b.icon}</span>
                             <span className="font-black text-[var(--primary)]">{b.title}</span>
                           </div>
                           <p className="text-sm text-[var(--primary)]/60 leading-relaxed font-medium pl-8">{b.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Central Diagnosis CTA */}
      <div className="mb-20 animate-slide-up">
        <Link 
          href="/qna/diagnosis" 
          className="block w-full py-7 bg-gradient-to-r from-[var(--primary)] to-[#2C3E50] text-white rounded-[var(--radius-card)] font-black text-2xl text-center shadow-2xl shadow-[var(--primary)]/20 hover:scale-[1.01] transition-all hover:brightness-110"
        >
          나는 어디에 해당할까? 자가진단 가기 ➔
        </Link>
      </div>

      {/* Comparison Table */}
      <div className="bg-[var(--surface)] rounded-[var(--radius-card)] p-8 md:p-12 overflow-hidden animate-slide-up">
        <h3 className="text-3xl font-black text-center mb-12 text-[var(--primary)]">한눈에 비교하는 회생 vs 파산</h3>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-3 gap-[1px] min-w-[600px] bg-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm bg-opacity-20">
            <div className="bg-[var(--background)] p-6 font-bold text-center text-[var(--primary)]/60 text-sm uppercase tracking-widest">구분</div>
            <div className="bg-white p-6 font-black text-center text-[var(--secondary)] text-xl border-l-[var(--border)]">개인회생</div>
            <div className="bg-white p-6 font-black text-center text-[#2E7D32] text-xl border-l-[var(--border)]">개인파산</div>
            
            <div className="bg-[var(--background)] p-6 font-bold text-center text-[var(--primary)]/60 text-sm flex items-center justify-center">신청 자격</div>
            <div className="bg-white p-8 text-base text-[var(--primary)]/80 font-medium">급여/영업 소득이 있는 자</div>
            <div className="bg-white p-8 text-base text-[var(--primary)]/80 font-medium">무소득/저소득자 (지급불능)</div>
            
            <div className="bg-[var(--background)] p-6 font-bold text-center text-[var(--primary)]/60 text-sm flex items-center justify-center">채무 한도</div>
            <div className="bg-white p-8 text-base text-[var(--primary)]/80 font-medium font-bold">무담보 10억, 담보 15억 이하</div>
            <div className="bg-white p-8 text-base text-[var(--primary)]/80 font-medium font-bold">제한 없음 (무제한)</div>

            <div className="bg-[var(--background)] p-6 font-bold text-center text-[var(--primary)]/60 text-sm flex items-center justify-center">변제 기간</div>
            <div className="bg-white p-8 text-base text-[var(--primary)]/80 font-medium">3년 ~ 5년 (분할 변제)</div>
            <div className="bg-white p-8 text-base text-[var(--primary)]/80 font-medium">단기 (청산 및 즉시 처분)</div>
            
            <div className="bg-[var(--background)] p-6 font-bold text-center text-[var(--primary)]/60 text-sm flex items-center justify-center">채무 감면</div>
            <div className="bg-white p-8 text-base text-[var(--primary)]/80 font-medium">원금 최대 90% (이자 100%)</div>
            <div className="bg-white p-8 text-base text-[var(--primary)]/80 font-medium font-bold text-[#2E7D32]">원금 100% (전액 면책)</div>
            
            <div className="bg-[var(--background)] p-6 font-bold text-center text-[var(--primary)]/60 text-sm flex items-center justify-center">최대의 장점</div>
            <div className="bg-white p-8 text-base text-[var(--primary)]/80 font-medium leading-relaxed">재산 유지 가능, 신분 유지</div>
            <div className="bg-white p-8 text-base text-[var(--primary)]/80 font-medium leading-relaxed">빠른 경제적 재기, 전액 탕감</div>
          </div>
        </div>
      </div>
    </div>
  );
}
