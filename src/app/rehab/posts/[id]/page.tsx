import React from 'react';
import Link from 'next/link';

export default function PostDetailPage() {
  // 실제 연동 시에는 params.id를 사용하여 데이터를 가져옵니다.
  return (
    <div className="max-w-4xl mx-auto mb-20">
      {/* Article Header */}
      <div className="mb-12">
        <Link href="/rehab/posts" className="inline-flex items-center gap-2 text-sm font-bold text-[#A67C52] mb-6 hover:gap-3 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          목록으로 돌아가기
        </Link>
        <span className="block text-[12px] text-[#A67C52] font-black uppercase tracking-widest mb-4">회생자격</span>
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--primary)] leading-tight mb-8">
          개인회생 신청 자격, 3가지 핵심 요건 총정리
        </h1>
        <div className="flex items-center gap-4 text-sm text-[var(--primary)]/40 font-bold border-b border-[var(--border)] pb-8">
          <span>작성일 2024.03.20</span>
          <span className="w-1 h-1 bg-[var(--border)] rounded-full"></span>
          <span>조회수 1,245</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="rounded-[var(--radius-card)] overflow-hidden mb-12 shadow-xl">
        <img 
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1600" 
          alt="Thumbnail" 
          className="w-full h-auto"
        />
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none text-[var(--primary)]/80 leading-relaxed space-y-8 font-medium">
        <p className="text-xl text-[var(--primary)] leading-relaxed italic">
          "빚 독촉에서 벗어나고 싶지만, 내가 자격이 될까?" <br />
          개인회생을 고민하시는 분들이 가장 먼저 마주하는 질문입니다.
        </p>
        
        <p>
          개인회생 제도는 무조건적인 채무 탕감이 아닌, 성실하지만 불운하게 과도한 채무를 지게 된 분들을 돕기 위한 법적 장치입니다.
          따라서 법원이 정한 명확한 기준이 존재하며, 이를 충족하지 못할 경우 기각될 위험이 있습니다. 
          핵심이 되는 <strong>3가지 요건</strong>을 지금부터 하나씩 짚어보겠습니다.
        </p>

        <h3 className="text-2xl font-bold text-[var(--primary)] pt-6">1. 지속적이고 반복적인 소득</h3>
        <p>
          개인회생은 3~5년간 매월 일정 금액(변제금)을 갚아나가는 과정입니다. 따라서 최저생계비를 제외하고도 변제금을 납부할 수 있는 
          <strong>'가용소득'</strong>이 반드시 있어야 합니다. 직장인뿐만 아니라 아르바이트생, 계약직, 그리고 사업자나 프리랜서도 매년 소득 증빙이 가능하다면 신청할 수 있습니다.
        </p>

        <h3 className="text-2xl font-bold text-[var(--primary)] pt-6">2. 채무액의 범위 (한도)</h3>
        <p>
          채무가 너무 적거나 너무 많아도 안 됩니다. 현재 법 기준으로는 무담보 채무(신용대출, 카드 등) 10억 원 이하, 
          담보 채무(주택담보대출 등) 15억 원 이하인 경우에만 신청이 가능합니다. 이 금액을 초과한다면 '일반회생'이나 다른 절차를 검토해야 합니다.
        </p>

        <h3 className="text-2xl font-bold text-[var(--primary)] pt-6">3. 재산보다 많은 채무</h3>
        <p>
          소위 '청산가치 보장의 원칙'입니다. 내가 가진 모든 재산(집, 차, 예금 등)을 다 팔아도 빚을 갚을 수 없는 상황이어야 합니다. 
          만약 재산이 빚보다 많다면 굳이 법적 조정을 받을 필요가 없다고 보기 때문입니다.
        </p>
      </article>

      {/* Bottom CTA */}
      <div className="mt-20 p-10 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-card)] text-center">
        <h4 className="text-xl font-bold text-[var(--primary)] mb-4">내 자격 요건이 궁금하신가요?</h4>
        <p className="text-[var(--primary)]/60 mb-8">무료 상담을 통해 5분 안에 자격 여부를 진단해 드립니다.</p>
        <button className="btn-primary">실시간 온라인 상담 신청</button>
      </div>
    </div>
  );
}
