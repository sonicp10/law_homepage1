import React from 'react';
import SubPageBanner from '@/components/SubPageBanner';
import TabNavigation from '@/components/TabNavigation';
import ServicePageTracker from '@/components/analytics/ServicePageTracker';

const rehabTabs = [
  { label: '개인회생절차', href: '/rehab/step' },
  { label: '자주묻는 질문', href: '/rehab/ask' },
  { label: 'About 개인회생', href: '/rehab/posts' },
];

export default function RehabLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-0 min-h-screen bg-[var(--background)]">
      <SubPageBanner 
        title="개인회생" 
        subtitle="새로운 시작을 위한 법적 조력, 법무사 김형근 사무소가 함께합니다."
        backgroundImage="/images/rehab_banner.png?v=3"
        position="center 25%"
      />
      {/* 카카오 픽셀: 개인회생 서비스 페이지 조회 이벤트 */}
      <ServicePageTracker serviceName="개인회생" />
      
      <TabNavigation tabs={rehabTabs} />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {children}
      </div>
    </main>
  );
}
