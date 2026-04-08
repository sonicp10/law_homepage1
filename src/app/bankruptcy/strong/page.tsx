import React from 'react';

export default function BankruptcyStrongPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6">개인파산의 장단점</h2>
        <div className="w-12 h-1 bg-[#A67C52] mx-auto mb-8"></div>
        <p className="text-lg text-[var(--primary)]/60 font-medium max-w-2xl mx-auto">
          모든 채무를 털고 새롭게 시작하기 위해 반드시 알아야 할 사실들입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* 장점 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm">✓</span>
            <h3 className="text-2xl font-bold text-[var(--primary)]">장점 (Benefits)</h3>
          </div>
          
          <div className="space-y-4">
            {[
              "현재 가진 채무의 원금과 이자 전액이 탕감됩니다.",
              "면책 후에는 소득이나 재산 증식에 제약이 전혀 없습니다.",
              "은행 예금, 보험, 취업 등 경제 활동이 자유로워집니다.",
              "가족(배우자, 자녀 등)에게 어떠한 불이익도 발생하지 않습니다.",
              "신용 불량(공공기록) 기록이 삭제되어 정상적 금융 거래가 가능해집니다.",
              "지속적인 수입이 없어도 자격 요건만 맞으면 신청 가능합니다."
            ].map((text, i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border border-blue-50 shadow-sm flex gap-4">
                <span className="text-blue-500 font-bold">•</span>
                <p className="text-[var(--primary)]/80 font-medium text-sm md:text-base">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 단점/고려사항 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm">!</span>
            <h3 className="text-2xl font-bold text-[var(--primary)]">고려사항 (Considerations)</h3>
          </div>
          
          <div className="space-y-4">
            {[
              "보유한 모든 현금성/부동성 자산을 변제에 투입해야 합니다 (기초자산 제외).",
              "면책 결정 전까지는 일시적으로 전문직(변호사, 회계사 등) 자격이 제한됩니다.",
              "일부 채권자들의 항의나 송달 과정이 회생보다 복잡할 수 있습니다.",
              "재산 은닉이나 도박 등 사행성 채무는 면책이 거절될 가능성이 높습니다.",
              "법적 절차 비용 및 관재인 보수 등 소정의 진행 비용이 발생합니다.",
              "일시적으로 신용 거래 및 카드 사용이 중단됩니다."
            ].map((text, i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border border-red-50 shadow-sm flex gap-4">
                <span className="text-red-500 font-bold">•</span>
                <p className="text-[var(--primary)]/80 font-medium text-sm md:text-base">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-20 p-8 bg-gray-100 rounded-2xl text-center">
        <p className="text-[var(--primary)]/60 text-sm mb-4 italic">
          ※ 법무사 김형근 사무소는 단순 대행을 넘어 면책 이후의 삶까지 함께 고민합니다.
        </p>
      </div>
    </div>
  );
}
