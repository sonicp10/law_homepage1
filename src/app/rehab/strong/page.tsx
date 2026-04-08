import React from 'react';

export default function RehabStrongPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6">개인회생의 장단점</h2>
        <div className="w-12 h-1 bg-[#A67C52] mx-auto mb-8"></div>
        <p className="text-lg text-[var(--primary)]/60 font-medium max-w-2xl mx-auto">
          제도의 특성을 명확히 파악하는 것이 성공적인 경제적 재기의 첫걸음입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* 장점 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm">✓</span>
            <h3 className="text-2xl font-bold text-[var(--primary)]">장점 (Benefits)</h3>
          </div>
          
          <div className="space-y-4">
            {[
              "채무 원금의 최대 90%까지 탕감이 가능합니다.",
              "채권자의 동의 없이도 법원의 결정으로 강제 조정됩니다.",
              "모든 종류의 채무(사채, 세금, 카드값 등)가 대상이 됩니다.",
              "공무원, 교사, 의사 등 자격을 그대로 유지하며 근무 가능합니다.",
              "신청 즉시 금지명령을 통해 빚 독촉과 압류에서 벗어납니다.",
              "개인 재산을 처분하지 않고 보유한 상태에서 진행 가능합니다."
            ].map((text, i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border border-green-50 shadow-sm flex gap-4">
                <span className="text-green-500 font-bold">•</span>
                <p className="text-[var(--primary)]/80 font-medium text-sm md:text-base">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 단점/주의사항 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm">!</span>
            <h3 className="text-2xl font-bold text-[var(--primary)]">고려사항 (Considerations)</h3>
          </div>
          
          <div className="space-y-4">
            {[
              "일정한 소득(월급, 사업소득 등)이 반드시 증명되어야 합니다.",
              "최대 3~5년이라는 긴 시간 동안 변제금을 꾸준히 납부해야 합니다.",
              "절차가 복잡하고 서류 준비 및 보정 과정이 까다롭습니다.",
              "인가 전까지는 신용카드 사용 및 대출이 제한됩니다.",
              "최종 면책 전까지는 신용 정보에 회생 사실이 등재됩니다.",
              "채무의 총액이 최소 1천만 원 이상이어야 신청이 실효성이 있습니다."
            ].map((text, i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border border-amber-50 shadow-sm flex gap-4">
                <span className="text-amber-500 font-bold">•</span>
                <p className="text-[var(--primary)]/80 font-medium text-sm md:text-base">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-20 p-10 bg-[var(--primary)] text-white rounded-[var(--radius-card)] text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <h3 className="text-2xl md:text-3xl font-bold mb-6 relative z-10">나에게 맞는 제도는 무엇일까요?</h3>
        <p className="text-white/70 mb-10 max-w-2xl mx-auto relative z-10">
          개인의 소득수준, 자산상태, 부양가족 수 등에 따라 유리한 제도가 다를 수 있습니다. 전문가와 상의하여 최적의 선택을 하세요.
        </p>
        <button className="px-10 py-4 bg-[var(--accent)] text-[var(--primary)] rounded-full font-black text-lg shadow-xl hover:scale-105 transition-transform relative z-10">
          무료 자격 진단하기
        </button>
      </div>
    </div>
  );
}
