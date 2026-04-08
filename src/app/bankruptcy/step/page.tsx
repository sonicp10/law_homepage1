import React from 'react';

const steps = [
  { step: "01", title: "파산신청서 접수", desc: "신청인의 재산, 소득, 채무 내역을 상세히 기재한 신청서를 관할 법원에 제출합니다." },
  { step: "02", title: "법원의 서면심사", desc: "제출된 서류를 통해 파산 원인이 있는지, 고의로 재산을 숨기지는 않았는지 철저히 검토합니다." },
  { step: "03", title: "파산선고 및 관재인 선임", desc: "법원이 파산을 선고하고 재산을 조사/관리할 파산관재인을 선임합니다. 이 시점부터 독촉이 금지됩니다." },
  { step: "04", title: "관재인 조사 및 채권자 집회", desc: "관재인이 재산을 조사하고 환가할 자산이 있는지 확인하며, 채권자들의 의견을 듣는 시간이 마련됩니다." },
  { step: "05", title: "면책 심문 기일", desc: "판사가 신청인을 직접 심문하거나 서면으로 면책 허가 여부를 최종 검토하는 단계입니다." },
  { step: "06", title: "면책 결정 (최종 성공)", desc: "법원이 면책을 허가하면 남은 모든 채무가 탕감되며, 신용 불량 기록이 삭제되어 경제적으로 부활하게 됩니다." }
];

export default function BankruptcyStepPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6">개인파산절차</h2>
        <div className="w-12 h-1 bg-[#A67C52] mx-auto mb-8"></div>
        <p className="text-lg text-[var(--primary)]/60 font-medium">
          완전한 채무 면책을 위한 전문적인 프로세스를 안내합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((item, index) => (
          <div key={index} className="relative group">
            <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--border)] h-full transition-all group-hover:border-[#A67C52] group-hover:shadow-lg">
              <div className="text-4xl font-black text-[#A67C52]/10 absolute top-4 right-8 group-hover:text-[#A67C52]/20 transition-colors">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-[var(--primary)] mb-4 mt-2">
                {item.title}
              </h3>
              <p className="text-[var(--primary)]/60 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-20 p-8 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="font-bold text-amber-900 mb-1">주의사항</p>
          <p className="text-sm text-amber-800 leading-relaxed">
            파산은 선고보다 '면책'을 받는 것이 핵심입니다. 자칫 잘못된 서류 준비로 파산만 선고되고 면책을 받지 못하면 불이익만 남을 수 있으므로 반드시 전문가의 도움을 받으셔야 합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
