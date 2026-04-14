import React from 'react';
import SubPageBanner from '@/components/SubPageBanner';
import TabNavigation from '@/components/TabNavigation';

const qnaTabs = [
  { label: '1:1 상담신청', href: '/qna/ask' },
  { label: '3분 자가진단', href: '/qna/diagnosis' },
];

export default function QnaLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-32 min-h-screen bg-[var(--background)]">
      <SubPageBanner 
        title="상담문의" 
        subtitle="의뢰인의 무거운 마음을 덜어드리는 진심 어린 상담을 약속합니다."
        backgroundImage="https://images.unsplash.com/photo-1573497620053-ea5310f94f17?auto=format&fit=crop&q=80&w=1600"
      />
      
      <TabNavigation tabs={qnaTabs} />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {children}
      </div>
    </main>
  );
}
