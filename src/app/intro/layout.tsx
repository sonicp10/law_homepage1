import React from 'react';
import SubPageBanner from '@/components/SubPageBanner';
import TabNavigation from '@/components/TabNavigation';

const introTabs = [
  { label: '인사말', href: '/intro' }, // 기본 경로를 인사말(greeting)로 연결하거나 /intro/greeting으로 나눌 수 있음
  { label: '업무분야', href: '/intro/business' },
  { label: '오시는 길', href: '/intro/map' },
];

// 인사말을 기본 /intro 경로로 처리하기 위해 탭 정보를 조정합니다.
const displayTabs = [
  { label: '인사말', href: '/intro/greeting' },
  { label: '업무분야', href: '/intro/business' },
  { label: '오시는 길', href: '/intro/map' },
];

export default function IntroLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-0 min-h-screen bg-[var(--background)]">
      <SubPageBanner 
        title="회사 소개" 
        subtitle="새로운 시작을 위하여 최고의 법률 서비스를 제공해 드립니다."
        backgroundImage="/images/intro_banner.png"
      />
      
      <TabNavigation tabs={displayTabs} />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {children}
      </div>
    </main>
  );
}
