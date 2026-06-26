import React from 'react';
import SubPageBanner from '@/components/SubPageBanner';
import TabNavigation from '@/components/TabNavigation';
import ServicePageTracker from '@/components/analytics/ServicePageTracker';

const bankruptcyTabs = [
  { label: '개인파산절차', href: '/bankruptcy/step' },
  { label: '자주묻는 질문', href: '/bankruptcy/ask' },
  { label: 'About 개인파산', href: '/bankruptcy/posts' },
];

export default function BankruptcyLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-0 min-h-screen bg-[var(--background)]">
      <SubPageBanner 
        title="개인파산 및 면책" 
        subtitle="채무의 굴레에서 벗어나 완전한 경제적 자유를 꿈꿉니다."
        backgroundImage="/images/bankruptcy-banner-liberation.jpg"
        position="center calc(50% + 100px)"
      />
      {/* 카카오 픽셀: 개인파산 서비스 페이지 조회 이벤트 */}
      <ServicePageTracker serviceName="개인파산" />
      
      <TabNavigation tabs={bankruptcyTabs} />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {children}
      </div>
    </main>
  );
}
