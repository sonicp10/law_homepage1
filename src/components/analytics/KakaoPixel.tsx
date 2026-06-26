'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

// ============================================================
//  카카오 픽셀 이벤트 유틸 함수 (전역 사용 가능)
//  출처: https://kakaobusiness.gitbook.io/main/tool/pixel-sdk/install
// ============================================================

declare global {
  interface Window {
    kakaoPixel?: (trackId: string) => KakaoPixelTracker;
  }
}

interface KakaoPixelTracker {
  pageView: (tag?: string) => void;
  completeRegistration: (tag?: string) => void;           // 회원가입/상담신청 완료
  search: (params?: { keyword?: string; tag?: string }) => void; // 검색
  viewContent: (params?: { currency?: string; products?: object[]; tag?: string }) => void; // 콘텐츠 조회
  participation: (tag?: string) => void;                  // 잠재고객 (상담신청 폼 오픈 등)
  signUp: (tag?: string) => void;                        // 서비스신청 (자가진단 완료 등)
  purchase: (params?: { total_quantity?: string; total_price?: string; currency?: string; products?: object[]; tag?: string }) => void;
  addToCart: (params?: { currency?: string; products?: object[]; tag?: string }) => void;
  addToWishList: (params?: { currency?: string; products?: object[]; tag?: string }) => void;
  viewCart: (tag?: string) => void;
  login: (tag?: string) => void;
  preparation: (tag?: string) => void;
  tutorial: (tag?: string) => void;
  missionComplete: (tag?: string) => void;
}

/**
 * 카카오 픽셀 이벤트 헬퍼
 * 사용법: kakaoPixelEvent.completeRegistration('Consulting')
 */
export const kakaoPixelEvent = {
  /** 1) 페이지 방문 이벤트 */
  pageView: (tag?: string) => {
    const id = process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID;
    if (!id || typeof window === 'undefined' || !window.kakaoPixel) return;
    window.kakaoPixel(id).pageView(tag);
  },

  /** 2) 회원가입/상담신청 완료 이벤트 — 상담 신청 완료 시 필수 */
  completeRegistration: (tag?: string) => {
    const id = process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID;
    if (!id || typeof window === 'undefined' || !window.kakaoPixel) return;
    window.kakaoPixel(id).completeRegistration(tag);
  },

  /** 9) 잠재고객 이벤트 — 상담 폼 열기, 자가진단 시작 등 */
  participation: (tag?: string) => {
    const id = process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID;
    if (!id || typeof window === 'undefined' || !window.kakaoPixel) return;
    // 권장 태그: 'Consulting'(상담신청), 'PreBooking'(사전예약)
    window.kakaoPixel(id).participation(tag);
  },

  /** 10) 서비스신청 이벤트 — 자가진단 완료, 실질적 서비스 신청 */
  signUp: (tag?: string) => {
    const id = process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID;
    if (!id || typeof window === 'undefined' || !window.kakaoPixel) return;
    // 권장 태그: 'SignUp'(서비스신청)
    window.kakaoPixel(id).signUp(tag);
  },

  /** 4) 콘텐츠/서비스 조회 이벤트 — 각 서비스 페이지 진입 시 */
  viewContent: (params?: { currency?: string; products?: object[]; tag?: string }) => {
    const id = process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID;
    if (!id || typeof window === 'undefined' || !window.kakaoPixel) return;
    window.kakaoPixel(id).viewContent(params);
  },

  /** 3) 검색 이벤트 */
  search: (params?: { keyword?: string; tag?: string }) => {
    const id = process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID;
    if (!id || typeof window === 'undefined' || !window.kakaoPixel) return;
    window.kakaoPixel(id).search(params);
  },
};

// ============================================================
//  KakaoPixel 컴포넌트 — layout.tsx에서 전역 마운트
// ============================================================
export default function KakaoPixel() {
  const pathname = usePathname();
  const pixelId = process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID;

  useEffect(() => {
    if (!pixelId) return;

    // SPA 페이지 이동 시마다 pageView 이벤트 전송
    if (window.kakaoPixel) {
      window.kakaoPixel(pixelId).pageView();
    }
  }, [pathname, pixelId]);

  if (!pixelId) return null;

  return (
    <Script
      id="kakao-pixel-base"
      strategy="afterInteractive"
      src="//t1.daumcdn.net/kas/static/kp.js"
      onLoad={() => {
        // 스크립트 로드 직후 최초 1회 초기화 및 PageView 전송
        if (window.kakaoPixel) {
          window.kakaoPixel(pixelId).pageView();
        }
      }}
    />
  );
}
