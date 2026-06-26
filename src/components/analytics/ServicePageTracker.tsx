'use client';

import { useEffect } from 'react';
import { kakaoPixelEvent } from '@/components/analytics/KakaoPixel';

interface Props {
  /** 서비스 이름 (카카오 픽셀 태그값으로 전달됨) */
  serviceName: string;
}

/**
 * 서비스 페이지 진입 시 카카오 픽셀 viewContent 이벤트를 전송하는 클라이언트 컴포넌트
 * 개인회생, 개인파산 등 각 서비스 레이아웃/페이지에 삽입하세요.
 *
 * 사용법:
 * <ServicePageTracker serviceName="개인회생" />
 */
export default function ServicePageTracker({ serviceName }: Props) {
  useEffect(() => {
    // 콘텐츠/서비스 조회 이벤트 전송 (공식 문서 4번 이벤트)
    kakaoPixelEvent.viewContent({ tag: serviceName });
  }, [serviceName]);

  return null; // UI 없음
}
