import React from 'react';

export default function GreetingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--surface)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-[var(--primary)] tracking-tight">
            다시 시작할 수 있습니다
          </h1>
          <div className="w-20 h-1 bg-[var(--secondary)] mx-auto mb-10 rounded-full"></div>
          <p className="text-xl md:text-2xl text-[var(--primary)]/60 font-medium">
            절망의 끝에서 희망의 등불이 되어드리겠습니다.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm p-8 md:p-12 rounded-[var(--radius-card)] shadow-sm border border-white/40 space-y-12">
          <div className="space-y-8 text-[var(--primary)] text-lg md:text-xl font-medium" style={{ lineHeight: '1.8' }}>
            <p>
              안녕하십니까. 여러분의 든든한 동반자, <br />
              <span className="bg-[var(--accent)] px-2">법무사 김형근 사무소</span>입니다.
            </p>
            <p>
              빚이라는 무거운 짐은 단순히 경제적인 어려움을 넘어, <br />
              우리의 마음과 소중한 일상까지 위축시키곤 합니다. <br />
              하지만 기억해 주십시오. <span className="font-bold underline decoration-[var(--secondary)] decoration-4 underline-offset-4">실패는 있어도 좌절은 없습니다.</span>
            </p>
            <p>
              우리는 단순히 법률 서류를 대신 작성하는 '대리인'이 아닙니다. <br />
              <span className="bg-[var(--accent)] px-2">여러분의 인생 2막을 함께 설계하고 응원하는 '인생의 동반자'</span>가 되고자 합니다.
            </p>
            <p>
              진심을 다하는 상담, 끝까지 책임지는 전문성으로 <br />
              여러분이 다시 웃으며 세상을 마주할 수 있도록 <br />
              따뜻한 햇살 같은 길잡이가 되어드리겠습니다.
            </p>
          </div>

          <div className="pt-12 border-t border-[var(--border)] flex flex-col items-end">
            <div className="text-right">
              <p className="text-[var(--primary)]/40 mb-3 font-bold tracking-[0.2em] text-sm uppercase italic">Professional Legal Partner</p>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-[var(--primary)]/60 font-light italic">진심을 담아,</span>
                <p className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
                  법무사 <span className="text-4xl md:text-5xl text-[var(--primary)] font-black">김형근</span> 올림
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
