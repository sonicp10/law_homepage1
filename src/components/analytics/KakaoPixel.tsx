'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

export default function KakaoPixel() {
  const pathname = usePathname();
  const pixelId = process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID;

  useEffect(() => {
    if (!pixelId) return;

    // 페이지 이동 시마다 PageView 이벤트 전송
    // @ts-ignore
    if (window.kakaoPixel) {
      // @ts-ignore
      window.kakaoPixel(pixelId).pageView();
    }
  }, [pathname, pixelId]);

  if (!pixelId) {
    return null;
  }

  return (
    <>
      <Script
        id="kakao-pixel-base"
        strategy="afterInteractive"
        src="//t1.daumcdn.net/kas/static/kp.js"
        onLoad={() => {
          // 스크립트 로드 직후 최초 1회 초기화 및 PageView 전송
          // @ts-ignore
          if (window.kakaoPixel) {
            // @ts-ignore
            window.kakaoPixel(pixelId).pageView();
          }
        }}
      />
    </>
  );
}
