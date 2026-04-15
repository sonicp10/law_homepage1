import React from 'react';
import SubPageBanner from '@/components/SubPageBanner';
import TabNavigation from '@/components/TabNavigation';

const bankruptcyTabs = [
  { label: '개인파산절차', href: '/bankruptcy/step' },
  { label: '자주묻는 질문', href: '/bankruptcy/ask' },
  { label: '개인파산 FAQ', href: '/bankruptcy/strong' },
  { label: '법률 정보', href: '/bankruptcy/posts' },
];

export default function BankruptcyLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-0 min-h-screen bg-[var(--background)]">
      <SubPageBanner 
        title="개인파산 및 면책" 
        subtitle="채무의 굴레에서 벗어나 완전한 경제적 자유를 꿈꿉니다."
        backgroundImage="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1600"
      />
      
      <TabNavigation tabs={bankruptcyTabs} />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {children}
      </div>
    </main>
  );
}
