import React from 'react';

const faqs = [
  {
    q: "개인회생을 신청하면 직장에 알려지나요?",
    a: "아니요. 법원은 회사로 통지하지 않으며, 본인이 직접 말하지 않는 한 회사나 주변 지인들이 알 방법은 거의 없습니다. 또한, 법은 회생 신청을 이유로 고용 관계를 해지하거나 불이익을 주는 것을 금지하고 있습니다."
  },
  {
    q: "연체 전에도 신청이 가능한가요?",
    a: "네, 가능합니다. 연체될 가능성이 높거나 이미 과도한 이자 부담으로 경제적 파탄이 예상된다면 연체 전이라도 '신용회복지원' 제도를 통해 신청할 수 있습니다."
  },
  {
    q: "가족들에게 피해가 가지는 않나요?",
    a: "원칙적으로 채무는 본인 책임이므로 가족의 재산이나 신용 점수에는 직접적인 영향이 없습니다. 다만, 가족이 보증을 섰을 경우에는 보증인 보호를 위한 별도의 검토가 필요합니다."
  },
  {
    q: "재산이 있어도 신청할 수 있나요?",
    a: "네. 본인의 총 채무액보다 보유한 재산(청산가치)이 적다면 신청 가능합니다. 재산을 유지하면서 정해진 변제금만 납부하면 되므로 파산보다 유리한 면이 있습니다."
  }
];

export default function RehabAskPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6">자주묻는 질문</h2>
        <div className="w-12 h-1 bg-[#A67C52] mx-auto mb-8"></div>
        <p className="text-lg text-[var(--primary)]/60 font-medium">
          개인회생에 대해 궁금한 점들을 명쾌하게 답변해 드립니다.
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
      
      <div className="mt-16 p-8 bg-[#A67C52]/5 rounded-2xl border border-[#A67C52]/20 text-center">
        <p className="text-[var(--primary)] font-bold mb-4">여기에 없는 궁금한 점이 있으신가요?</p>
        <button className="btn-accent">무료 상담 신청하기</button>
      </div>
    </div>
  );
}
