'use client';

import React from 'react';
import Link from 'next/link';

const Card = ({ title, index, children, icon }: { title: string; index: string; children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="relative mb-20 group">
    {/* Background accent */}
    <div className="absolute -left-4 -top-4 w-24 h-24 bg-[var(--secondary)]/5 rounded-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
    
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Number and Line */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 bg-[var(--primary)] text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-xl shadow-[var(--primary)]/20 group-hover:rotate-6 transition-transform">
          {index}
        </div>
        <div className="hidden md:block w-[2px] h-full min-h-[100px] bg-gradient-to-b from-[var(--primary)]/20 to-transparent mt-4"></div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white p-8 md:p-12 rounded-[var(--radius-card)] border border-[var(--border)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center gap-4 mb-8">
          {icon && <div className="text-[var(--secondary)]">{icon}</div>}
          <h3 className="text-2xl md:text-3xl font-black text-[var(--primary)] tracking-tight">
            {title}
          </h3>
        </div>
        
        <div className="space-y-6 text-[var(--primary)]/80 leading-relaxed font-medium">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const HighlightBox = ({ children, title = "💡 전문가 조언" }: { children: React.ReactNode; title?: string }) => (
  <div className="mt-8 p-6 bg-[var(--secondary)]/5 rounded-2xl border-l-4 border-[var(--secondary)]">
    <h4 className="text-[15px] font-black text-[var(--secondary)] mb-2 flex items-center gap-2">
      <span>{title}</span>
    </h4>
    <div className="text-[15px] text-[var(--primary)]/70">
      {children}
    </div>
  </div>
);

export default function RehabStepPage() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-24 animate-slide-up">
        <h2 className="text-4xl md:text-5xl font-black text-[var(--primary)] mb-8 tracking-tight">개인회생절차 안내</h2>
        <div className="w-16 h-1.5 bg-[var(--secondary)] mx-auto mb-10 rounded-full"></div>
        <p className="text-lg md:text-xl text-[var(--primary)]/60 font-medium max-w-3xl mx-auto leading-relaxed">
          개인회생절차는 재정적 어려움으로 파탄에 직면한 채무자의 재기를 돕는 법적 제도입니다.<br className="hidden md:block" />
          신청부터 면책까지, 법무사 김형근 사무소가 모든 과정을 함께합니다.
        </p>
      </div>

      <div className="relative">
        {/* Step 1 */}
        <Card index="01" title="신청서 제출 및 필수 서류 가이드">
          <p>개인회생절차를 시작하기 위해 채무자는 '개인회생절차개시신청서'를 작성하여 관할 법원에 제출해야 합니다.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-[var(--primary)] border-b pb-2">📍 신청서 제출 관할</h4>
              <ul className="space-y-2 text-[15px]">
                <li className="flex gap-2"><span>•</span> 채무자의 보통재판적(주소지) 관할 법원</li>
                <li className="flex gap-2"><span>•</span> 채무자의 주된 사무소나 영업소가 있는 곳</li>
                <li className="flex gap-2"><span>•</span> 채무자가 계속하여 근무하고 있는 사무소/영업소</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-[var(--primary)] border-b pb-2">📄 필수 첨부 서류</h4>
              <ul className="grid grid-cols-1 gap-2 text-[14px]">
                <li className="bg-[var(--surface)] p-2 rounded flex gap-2">✔️ 개인회생채권자목록</li>
                <li className="bg-[var(--surface)] p-2 rounded flex gap-2">✔️ 재산목록</li>
                <li className="bg-[var(--surface)] p-2 rounded flex gap-2">✔️ 수입 및 지출에 관한 목록</li>
                <li className="bg-[var(--surface)] p-2 rounded flex gap-2">✔️ 급여/영업소득 증명 자료</li>
                <li className="bg-[var(--surface)] p-2 rounded flex gap-2">✔️ 진술서 및 관련 소명 서류</li>
              </ul>
            </div>
          </div>
          <HighlightBox>
            실무적으로는 절차의 신속한 진행을 위해 <b>신청서 제출 시 함께 접수하는 것이 일반적</b>입니다.
          </HighlightBox>
        </Card>

        {/* Step 2 */}
        <Card index="02" title="법원의 심리와 회생위원 선임">
          <p>신청서가 접수되면 법원은 사건에 대한 기초적인 법적 요건 및 관할권 여부를 검토합니다.</p>
          <div className="space-y-4 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)]">
            <p className="text-[15px]">법원은 법 제595조에서 정한 기각사유가 있는지 면밀히 심사하며, 관할이 없는 경우 관할법원으로 이송 처리합니다.</p>
            <p className="text-[15px]"><b>회생위원 선임:</b> 법원은 이해관계인의 신청 또는 직권으로 회생위원을 선임합니다. 실무적으로는 모든 사건에 대하여 개시신청 직후 회생위원을 선임하여 절차 전반을 관리하게 됩니다.</p>
          </div>
        </Card>

        {/* Step 3 */}
        <Card index="03" title="변제계획안 제출 및 실무적 수행">
          <p>채무자는 향후 어떻게 채무를 변제할 것인지에 대한 구체적인 계획을 담은 '변제계획안'을 제출해야 합니다.</p>
          <div className="mt-6">
            <div className="p-6 border border-[var(--secondary)]/30 rounded-2xl bg-[var(--secondary)]/5">
              <span className="text-xs font-bold text-[var(--secondary)] block mb-2">👨‍💼 실무적 운용</span>
              <p className="text-[15px]">수행 가능성 입증을 위해 제출일로부터 60~90일 내에 첫 변제를 개시하도록 설정</p>
            </div>
          </div>
          <HighlightBox title="⚠️ 실무 포인트">
            법적으로는 인가일부터 1개월 이내 변제 개시로 규정되어 있으나, 실무적으로는 <b>회생위원의 지정 계좌에 매월 변제액을 미리 임치</b>하는 방식으로 수행 능력을 증명합니다.
          </HighlightBox>
        </Card>

        {/* Step 4 */}
        <Card index="04" title="개시결정의 효력과 이의신청">
          <p>법원은 신청일로부터 1개월 이내에 개시 여부를 결정하며, 이 결정은 즉시 효력이 발생합니다.</p>
          <div className="mt-8 space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex-shrink-0 flex items-center justify-center font-bold">1</div>
              <div>
                <h5 className="font-bold mb-1">채권자 이의신청 기간</h5>
                <p className="text-[14px]">채권자목록 내용에 이의가 있는 채권자는 정해진 기간 내에 서면으로 이의를 제기할 수 있습니다.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex-shrink-0 flex items-center justify-center font-bold">2</div>
              <div>
                <h5 className="font-bold mb-1">이의 내용의 조정</h5>
                <p className="text-[14px]">채무자가 이의를 인정하면 법원의 허가를 얻어 목록을 수정하고, 다툼이 있는 경우 '개인회생채권조사확정의 소' 등을 통해 해결합니다.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Step 5 */}
        <Card index="05" title="변제계획안의 수정 및 확정">
          <p>제출된 계획안은 채권자의 이의나 법원의 보정 권고에 따라 최종 확정 전까지 수정될 수 있습니다.</p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[var(--surface)] text-[var(--primary)]">
                <tr>
                  <th className="p-4 font-black">항목</th>
                  <th className="p-4 font-black">상세 내용</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <td className="p-4 font-bold bg-[var(--surface)]/30 w-1/3">가용소득 적용</td>
                  <td className="p-4">채무변제에 제공되는 재산 및 정기적 소득에 관한 사항</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold bg-[var(--surface)]/30">우선권 채권</td>
                  <td className="p-4">재단채권 및 일반 우선권 있는 채권의 전액 변제 계획</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold bg-[var(--surface)]/30">채권 변제 비율</td>
                  <td className="p-4">채권자목록 상의 채무에 대한 전부 또는 일부 변제 반영</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Step 6 */}
        <Card index="06" title="개인회생 채권자집회">
          <p>변제계획안에 대한 채권자들의 의견을 청취하기 위해 집회가 개최됩니다.</p>
          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 mt-6">
            <h5 className="text-amber-800 font-black mb-2 flex items-center gap-2">
              🚨 주의: 채권자집회의 성격
            </h5>
            <p className="text-amber-900/80 text-[15px]">
              개인회생 채권자집회는 다른 회생절차와 달리 <b>어떠한 결의를 거치는 자리가 아닙니다</b>. 
              채무자가 변제계획안을 설명하고 채권자가 이의 여부를 진술하는 자리이므로 과도하게 긴장하실 필요 없습니다.
            </p>
          </div>
          <p className="mt-6 text-[15px]">집회는 회생위원이 진행하는 것이 일반적이며, 이때까지 적립된 변제액은 인가 결정 후 실질적으로 채권자들에게 지급되기 시작합니다.</p>
        </Card>

        {/* Step 7 */}
        <Card index="07" title="변제계획의 인가 요건 및 효력">
          <p>법원은 다음의 요건을 모두 충족할 때 최종 인가 결정을 내립니다.</p>
          
          <div className="space-y-4 mt-8">
            <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)]">
              <h5 className="font-black mb-4 flex items-center gap-2">📋 기본 인가 요건</h5>
              <ul className="space-y-3 text-[14px]">
                <li className="flex gap-2">✅ 계획안이 법적 규정에 적합하고 공정하며 수행 가능할 것</li>
                <li className="flex gap-2">✅ 인가 전 납부 비용 및 수수료가 완납되었을 것</li>
                <li className="flex gap-2 text-[var(--secondary)] font-bold">✅ 청산가치 보장 원칙: 현재 가치가 파산 시 배당액보다 클 것</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-[var(--primary)]/10">
              <h5 className="font-black mb-4 flex items-center gap-2">📊 최소 변제금액 기준 (이의 시 추가 요건)</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                <div className="p-4 bg-[var(--surface)] rounded-xl">
                  <span className="block font-bold mb-2">총 채무액 5천만 원 미만</span>
                  <p className="text-[var(--secondary)] font-black text-lg">총 채무액의 5% 이상 변제</p>
                </div>
                <div className="p-4 bg-[var(--surface)] rounded-xl">
                  <span className="block font-bold mb-2">총 채무액 5천만 원 이상</span>
                  <p className="text-[var(--secondary)] font-black text-lg">3% + 100만 원 이상 변제</p>
                </div>
              </div>
              <p className="mt-4 text-[12px] text-gray-500 italic text-center">* 위 기준은 총 변제액 3,000만 원을 초과하지 않는 범위 내에서 적용됩니다.</p>
            </div>
          </div>
          
          <HighlightBox title="✨ 인가 결정의 효력">
            인가 결정은 즉시 효력이 발생하나, 실질적인 채무 탕감 및 권리 변경은 <b>향후 면책결정이 확정된 때</b> 비로소 완성됩니다. 끝까지 성실한 변제가 중요합니다.
          </HighlightBox>
        </Card>
      </div>

      {/* Footer CTA */}
      <div className="mt-20 p-12 bg-[var(--primary)] rounded-[var(--radius-card)] text-white text-center shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-black mb-6">복잡한 회생 절차, 전문가가 함께하면 쉽습니다.</h3>
          <p className="text-white/70 mb-10 max-w-2xl mx-auto font-medium">
            법적 기준과 실무적 노하우를 결합하여 의뢰인에게 가장 유리한 변제 안을 도출해 드립니다. 
            지금 바로 무료 상담을 신청하세요.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/qna/phone" className="px-8 py-4 bg-[var(--secondary)] text-white font-black rounded-full hover:scale-105 transition-all shadow-lg text-center flex items-center justify-center">
              1:1 맞춤 상담 신청
            </Link>
            <Link href="/s_story/rehab" className="px-8 py-4 bg-white/10 text-white font-black rounded-full border border-white/20 hover:bg-white/20 transition-all text-center flex items-center justify-center">
              성공 사례 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
