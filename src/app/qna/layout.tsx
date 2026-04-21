import React from 'react';
import SubPageBanner from '@/components/SubPageBanner';
import TabNavigation from '@/components/TabNavigation';

const qnaTabs = [
  { label: '실시간 전화 상담', href: '/qna/phone' },
  { label: '방문 상담', href: '/qna/visit' },
  { label: '게시판 상담', href: '/qna/board' },
  { label: '3분 자가진단', href: '/qna/diagnosis' },
];

export default function QnaLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-0 min-h-screen bg-[var(--background)]">
      <SubPageBanner 
        title="상담문의" 
        subtitle="의뢰인의 무거운 마음을 덜어드리는 진심 어린 상담을 약속합니다."
        backgroundImage="/images/qna-banner.png"
      />
      
      <TabNavigation tabs={qnaTabs} />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {children}
      </div>
    </main>
  );
}
