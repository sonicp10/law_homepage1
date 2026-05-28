'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 관리자 페이지(/admin)는 통계에서 제외
    if (pathname.startsWith('/admin')) return;

    // 로컬스토리지의 관리자 세션 플래그가 있는 경우 통계에서 제외
    if (typeof window !== 'undefined' && localStorage.getItem('is_admin_session') === 'true') {
      return;
    }

    const trackView = async () => {

      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer || null,
            userAgent: navigator.userAgent,
          }),
        });
      } catch (error) {
        // 소리 없는 실패 (사용자 경험 저하 방지)
        console.error('Analytics tracking failed:', error);
      }
    };

    trackView();
  }, [pathname]);

  return null; // 시각적 요소 없음
}
