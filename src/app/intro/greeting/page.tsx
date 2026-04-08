import React from 'react';

export default function GreetingPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6">인사말</h2>
        <div className="w-12 h-1 bg-[#A67C52] mx-auto mb-8"></div>
        <p className="text-lg md:text-xl text-[var(--primary)]/60 font-medium">
          고객의 입장에서 생각하며, 정직하고 실력 있는 동반자가 되겠습니다.
        </p>
      </div>

      <div className="space-y-10 text-[var(--primary)]/80 leading-relaxed text-lg">
        <p>
          안녕하십니까. <strong>법무사 김형근 사무소</strong>입니다. <br />
          저희 사무소를 방문해 주셔서 진심으로 감사드립니다.
        </p>
        <p>
          복잡하고 어려운 법률 문제, 특히 개인회생과 파산이라는 인생의 큰 고비 앞에서 우리는 종종 길을 잃곤 합니다. 
          저희 사무소는 단순한 법률 대리인을 넘어, 여러분의 새로운 시작을 함께 준비하는 든든한 조력자가 되고자 합니다.
        </p>
        <p>
          풍부한 경험과 전문성을 바탕으로 각 의뢰인의 상황에 맞는 최적의 해결책을 제시하겠습니다. 
          절망의 끝에서 희망의 시작을 찾으실 수 있도록, <strong>정직하게, 그리고 끝까지</strong> 함께하겠습니다.
        </p>
      </div>

      <div className="mt-20 pt-10 border-t border-[var(--border)] flex flex-col items-end">
        <div className="text-right">
          <p className="text-[var(--primary)]/60 mb-2 font-bold tracking-widest text-sm italic">Law Office Kim Hyeong-geun</p>
          <p className="text-2xl font-bold text-[var(--primary)]">법무사 <span className="text-3xl text-[#A67C52]">김형근</span> 올림</p>
        </div>
      </div>
    </div>
  );
}
