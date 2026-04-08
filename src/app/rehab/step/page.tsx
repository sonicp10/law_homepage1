import React from 'react';

const steps = [
  { step: "01", title: "상담 및 서류 준비", desc: "전문 법무사와의 상세한 상담을 통해 자격 요건을 확인하고 필요한 서류를 준비합니다." },
  { step: "02", title: "개인회생 신청서 접수", desc: "관할 법원에 신청서를 제출하며, 금지명령 및 중지명령을 함께 신청하여 독촉을 중단시킵니다." },
  { step: "03", title: "회생위원 선임 및 보정권고", desc: "법원이 선임한 회생위원의 검토가 이루어지며, 필요한 경우 추가 보정 자료를 제출합니다." },
  { step: "04", title: "개시결정", desc: "법원으로부터 회생 절차의 정당성을 인정받아 개시결정이 내려지며, 이때부터 변제금을 적립합니다." },
  { step: "05", title: "채권자 집회 및 변제계획안 인가", desc: "채권자들의 의견을 청취하고 법원이 변제계획안을 최종 승인(인가)합니다." },
  { step: "06", title: "변제계획 수행 및 면책", desc: "3~5년간 성실히 변제금을 납부하면 남은 채무에 대해 최종 면책(탕감)을 받게 됩니다." }
];

export default function RehabStepPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6">개인회생절차</h2>
        <div className="w-12 h-1 bg-[#A67C52] mx-auto mb-8"></div>
        <p className="text-lg text-[var(--primary)]/60 font-medium">
          새로운 시작을 위한 6단계 프로세스를 안내해 드립니다.
        </p>
      </div>

      <div className="relative border-l-2 border-[var(--border)] ml-4 md:ml-10 space-y-12 pb-10">
        {steps.map((item, index) => (
          <div key={index} className="relative pl-10 md:pl-16">
            {/* Step Number Bubble */}
            <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-white border-4 border-[#A67C52] flex items-center justify-center z-10">
              <span className="text-[10px] font-black text-[#A67C52]">{item.step}</span>
            </div>
            
            <div className="glass-card p-8 hover:border-[#A67C52]/30 transition-all group">
              <h3 className="text-xl font-bold text-[var(--primary)] mb-4 group-hover:text-[#A67C52] transition-colors">
                {item.title}
              </h3>
              <p className="text-[var(--primary)]/70 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
