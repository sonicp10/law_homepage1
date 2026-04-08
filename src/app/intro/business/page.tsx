import React from 'react';

const businessAreas = [
  {
    title: "개인회생",
    desc: "과도한 채무로 고통받는 성실한 직장인, 사업자 등을 위한 제도입니다. 법원의 조정을 통해 채무의 일정 부분을 탕감받고 새로운 삶을 시작할 수 있습니다.",
    icon: "⚖️"
  },
  {
    title: "개인파산 및 면책",
    desc: "채무를 도저히 변제할 수 없는 상황에 처한 분들을 위한 제도입니다. 모든 자산을 처분하여 채무를 변제하고, 남은 채무에 대해 면책을 받아 경제적 갱생을 도모합니다.",
    icon: "🏛️"
  },
  {
    title: "부동산 등기",
    desc: "매매, 상속, 증여 등 부동산 소유권 이전 및 각종 권리 관계를 명확히 하여 소중한 자산을 안전하게 보호해 드립니다.",
    icon: "🏠"
  },
  {
    title: "민사/형사/가사",
    desc: "일상생활에서 발생하는 다양한 법률 분쟁에 대해 전문적인 조력을 제공하여 권익을 수호합니다.",
    icon: "🛡️"
  }
];

export default function BusinessPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6">사업분야</h2>
        <div className="w-12 h-1 bg-[#A67C52] mx-auto mb-8"></div>
        <p className="text-lg text-[var(--primary)]/60 font-medium max-w-2xl mx-auto">
          법무사 김형근 사무소가 제공하는 전문적이고 체계적인 법률 서비스입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {businessAreas.map((area, index) => (
          <div key={index} className="pastel-card group">
            <div className="text-4xl mb-6">{area.icon}</div>
            <h3 className="text-xl font-bold text-[var(--primary)] mb-4 group-hover:text-[#A67C52] transition-colors">
              {area.title}
            </h3>
            <p className="text-[var(--primary)]/70 leading-relaxed text-sm md:text-base">
              {area.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
