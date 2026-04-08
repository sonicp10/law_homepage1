import React from 'react';
import Link from 'next/link';

export default function BankruptcyPostDetailPage() {
  return (
    <div className="max-w-4xl mx-auto mb-20">
      {/* Article Header */}
      <div className="mb-12">
        <Link href="/bankruptcy/posts" className="inline-flex items-center gap-2 text-sm font-bold text-[#A67C52] mb-6 hover:gap-3 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          목록으로 돌아가기
        </Link>
        <span className="block text-[12px] text-[#A67C52] font-black uppercase tracking-widest mb-4">면책전략</span>
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--primary)] leading-tight mb-8">
          개인파산 면책불허가 사유와 대응 전략
        </h1>
        <div className="flex items-center gap-4 text-sm text-[var(--primary)]/40 font-bold border-b border-[var(--border)] pb-8">
          <span>작성일 2024.03.15</span>
          <span className="w-1 h-1 bg-[var(--border)] rounded-full"></span>
          <span>조회수 982</span>
        </div>
      </div>

      {/* Hero Image Area */}
      <div className="rounded-[var(--radius-card)] overflow-hidden mb-12 shadow-xl aspect-video bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <p className="text-[var(--primary)]/40 font-bold italic">대표 이미지 영역 (Legal Insight)</p>
        </div>
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none text-[var(--primary)]/80 leading-relaxed space-y-8 font-medium">
        <p className="text-xl text-[var(--primary)] leading-relaxed italic border-l-4 border-[#A67C52] pl-6 py-2">
          "파산 선고를 받았다고 해서 다 끝난 것이 아닙니다. 진짜 승부는 '면책'에서 결정됩니다."
        </p>
        
        <p>
          개인파산 제도의 궁극적인 목적은 '면책'을 통한 채무 탕감입니다. 하지만 법은 성실하지 못한 신청인까지 보호하지는 않습니다. 
          채권자의 이익을 부당하게 해치거나 법원을 기망한 행위가 발견될 경우, 파산 선고는 유지되면서 빚은 그대로 남는 <strong>'면책불허가'</strong>라는 최악의 상황이 발생할 수 있습니다.
        </p>

        <h3 className="text-2xl font-bold text-[var(--primary)] pt-6">대표적인 면책불허가 사유</h3>
        <ul className="list-disc pl-6 space-y-4">
          <li><strong>재산 은닉:</strong> 파산 신청 전 재산을 타인 명의로 돌리거나 헐값에 매각하는 행위</li>
          <li><strong>허위 진술:</strong> 채무 부풀리기나 재산 상태에 대한 거짓 보고</li>
          <li><strong>사행성 소비:</strong> 과도한 낭비, 도박, 주식 투자 등으로 인한 채무 증대</li>
          <li><strong>비협조:</strong> 파산관재인의 정당한 조사에 응하지 않거나 문서를 파기하는 행위</li>
        </ul>

        <h3 className="text-2xl font-bold text-[var(--primary)] pt-6">어떻게 대응해야 할까? (재량면책)</h3>
        <p>
          만약 실수가 있었거나 일시적인 사행성 행위가 있었다고 하더라도, 절망하기는 이릅니다. 법원은 신청인의 전반적인 사정을 고려하여 
          판사의 권한으로 면책을 허가하는 <strong>'재량면책'</strong> 제도를 운영하고 있습니다.
        </p>
        <p>
          재량면책을 받기 위해서는 현재의 깊은 반성, 향후 갱생 의지, 그리고 채권자들에게 줄 수 있는 최소한의 성의 등을 논리적이고 진정성 있게 소명해야 합니다.
        </p>
      </article>

      {/* Bottom Share & Navigation */}
      <div className="mt-16 pt-8 border-t border-[var(--border)] flex justify-between items-center">
        <div className="flex gap-4">
          <button className="text-sm font-bold text-[var(--primary)]/40 hover:text-[var(--primary)] transition-colors">공유하기</button>
          <button className="text-sm font-bold text-[var(--primary)]/40 hover:text-[var(--primary)] transition-colors">주소복사</button>
        </div>
        <Link href="/qna/ask" className="font-bold text-[#A67C52] flex items-center gap-2">
          <span>비밀 상담 신청</span>
          <span>🔒</span>
        </Link>
      </div>
    </div>
  );
}
