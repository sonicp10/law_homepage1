import React from 'react';
import SubPageBanner from '@/components/SubPageBanner';
import TabNavigation from '@/components/TabNavigation';

const storyTabs = [
  { label: '전체보기', href: '/s_story' },
  { label: '개인회생 사례', href: '/s_story/rehab' },
  { label: '개인파산 사례', href: '/s_story/bankruptcy' },
];

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-0 min-h-screen bg-[var(--background)]">
      <SubPageBanner 
        title="성공사례" 
        subtitle="의뢰인의 새로운 시작, 그 소중한 기록들을 공유합니다."
        backgroundImage="https://images.unsplash.com/photo-1521791136364-798a7bc0d262?auto=format&fit=crop&q=80&w=1600"
      />
      
      <TabNavigation tabs={storyTabs} />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {children}
      </div>
    </main>
  );
}
