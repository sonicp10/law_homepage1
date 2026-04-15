import React from 'react';
import SubPageBanner from '@/components/SubPageBanner';
import TabNavigation from '@/components/TabNavigation';

const rehabTabs = [
  { label: '개인회생절차', href: '/rehab/step' },
  { label: '자주묻는 질문', href: '/rehab/ask' },
  { label: '개인회생 FAQ', href: '/rehab/strong' },
  { label: '법률 정보', href: '/rehab/posts' },
];

export default function RehabLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-0 min-h-screen bg-[var(--background)]">
      <SubPageBanner 
        title="개인회생" 
        subtitle="새로운 시작을 위한 법적 조력, 법무사 김형근 사무소가 함께합니다."
        backgroundImage="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1600"
      />
      
      <TabNavigation tabs={rehabTabs} />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {children}
      </div>
    </main>
  );
}
