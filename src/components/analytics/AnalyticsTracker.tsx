'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. 관리자 전용 페이지(/admin)는 통계에서 제외
    if (pathname.startsWith('/admin')) return;

    if (typeof window !== 'undefined') {
      // 2. 로컬 스토리지의 관리자 플래그 체크
      if (
        localStorage.getItem('is_admin_session') === 'true' ||
        localStorage.getItem('exclude_from_analytics') === 'true'
      ) {
        return;
      }

      // 3. 브라우저 쿠키의 관리자 기기 제외 플래그 체크
      const cookies = document.cookie || '';
      if (
        cookies.includes('admin_device_excluded=true') ||
        cookies.includes('admin_session_v1')
      ) {
        return;
      }
    }

    const trackView = async () => {
      try {
        const cleanPathname = (typeof window !== 'undefined' ? window.location.pathname : pathname)
          .trim()
          .replace(/\/+$/, '') || '/';

        // 4. 동일 세션(탭)에서 5분 이내 동일 페이지 중복 새로고침/재진입 시 중복 집계 방지
        if (typeof window !== 'undefined' && window.sessionStorage) {
          const storageKey = `analytics_last_view_${cleanPathname}`;
          const lastViewedAt = Number(sessionStorage.getItem(storageKey) || '0');
          const now = Date.now();
          if (lastViewedAt && now - lastViewedAt < 5 * 60 * 1000) {
            return;
          }
          sessionStorage.setItem(storageKey, String(now));
        }

        const fullPath = typeof window !== 'undefined' 
          ? (window.location.pathname + window.location.search)
          : pathname;

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: fullPath,
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

  return null;
}
