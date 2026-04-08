import React from 'react';

const faqs = [
  {
    q: "파산하면 평생 '파산자'라는 꼬리표가 붙나요?",
    a: "아니요. 파산 면책이 결정되면 공공기초기관 등에 등록된 파산 기록은 일정 기간(통상 5년)이 지나면 자동 삭제됩니다. 면책 후에는 은행 거래, 취업 등 모든 경제 활동에 어떠한 차별도 받지 않습니다."
  },
  {
    q: "면책을 못 받을 수도 있나요?",
    a: "네, '면책불허가 사유'가 있는 경우입니다. 재산을 고의로 은닉하거나 낭비, 도박 등으로 자산을 탕진한 경우가 대표적입니다. 하지만 이러한 경우라도 파산관재인에게 성실하게 소명한다면 '재량면책'을 받을 수도 있으므로 전문가와의 상담이 필수적입니다."
  },
  {
    q: "집기는 물론 빨간 딱지가 붙나요?",
    a: "과거 유압기가 가구에 붙는 광경을 많이 보셨겠지만, 파산 신청 후 금지명령이 내려지면 압류 행위는 중단됩니다. 또한 6개월간의 최저 생계비나 기초적인 생활 가재도구는 압류 금지 재산으로 분류되어 보호받습니다."
  },
  {
    q: "자식들에게 불이익이 가지 않을까요?",
    a: "전혀 그렇지 않습니다. 연좌제는 존재하지 않습니다. 부모의 파산이 자녀의 취업이나 결혼, 해외여행 등에 아무런 영향을 주지 않습니다."
  }
];

export default function BankruptcyAskPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6">자주묻는 질문</h2>
        <div className="w-12 h-1 bg-[#A67C52] mx-auto mb-8"></div>
        <p className="text-lg text-[var(--primary)]/60 font-medium">
          개인파산 면책에 대해 가장 많이 하시는 우려와 질문들입니다.
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm transition-all hover:shadow-md">
            <details className="group">
              <summary className="flex items-center justify-between p-6 md:p-8 cursor-pointer list-none">
                <span className="text-lg font-bold text-[var(--primary)] flex items-center gap-4">
                  <span className="text-[#A67C52]">Q.</span> {faq.q}
                </span>
                <span className="transition-transform group-open:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-[var(--primary)]/30">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 md:px-8 pb-8 pt-0 text-[var(--primary)]/70 leading-relaxed">
                <div className="flex gap-4">
                  <span className="font-black text-[#A67C52] shrink-0">A.</span>
                  <p>{faq.a}</p>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
