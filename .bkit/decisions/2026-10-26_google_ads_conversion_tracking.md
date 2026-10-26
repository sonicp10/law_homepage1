# 2026-10-26: Google Ads 전환 추적(Conversion Tracking) 태그 연동

## 1. 개요
Google Ads 광고 효율 측정 및 머신러닝 입찰 최적화를 위해 공식 가이드라인 기반의 **Google 태그(gtag.js)** 기본 설치 및 핵심 목표인 **리드 양식 제출(상담 신청 완료) 전환 이벤트**를 홈페이지 전역의 모든 상담 접점에 연동했습니다.

- **Google 태그 ID (gtag_id):** `AW-18530312690`
- **전환 액션:** 리드 양식 제출 (상담 신청 완료)
- **전환 이벤트 send_to:** `AW-18530312690/tHP2CO_lvqUdEPLD-INF`

---

## 2. 작업 내역

### 1) TypeScript 전역 타입 선언 (`src/types/gtag.d.ts`)
- `window.gtag` 및 `window.dataLayer` 인터페이스를 안전하게 확장하여 컴파일 에러 없이 타입 안정성 확보.

### 2) Google Ads 전역 컴포넌트 및 유틸 생성 (`src/components/analytics/GoogleAdsTag.tsx`)
- Next.js의 `next/script` (`strategy="afterInteractive"`)를 활용하여 전역 비동기 로딩 최적화.
- 전환 이벤트 트리거 헬퍼 함수 `reportGoogleAdsConversion()` 제공:
  - SSR 환경 분기(`typeof window !== 'undefined'`) 및 `window.gtag` 존재 여부 검증 후 단 1회 안전하게 실행.
  - 전환 값: 1.0 KRW 설정.

### 3) 루트 레이아웃 마운트 (`src/app/layout.tsx`)
- 모든 페이지에서 Google 태그(`AW-18530312690`)가 로드되도록 `<GoogleAdsTag />`를 전역 루트 레이아웃에 탑재.

### 4) 상담 신청 폼 5개 접점에 전환 이벤트 연동
폼 입력 유효성 검사(Validation) 실패 시에는 이벤트가 발송되지 않으며, 서버 API(200 OK) 성공 응답을 수신한 시점에만 단 1회 정확하게 발송되도록 구현:
1. **메인 페이지 빠른 상담 신청** (`src/components/RequestSection.tsx`)
   - 폼 제출 성공 시 `reportGoogleAdsConversion()` 호출 (기존 중복 useEffect 정리 포함).
2. **드래그형 실시간 상담 플로팅 위젯** (`src/components/FloatingConsultForm.tsx`)
   - 2단계 폼 제출 성공 시 `reportGoogleAdsConversion()` 호출.
3. **1분 자가진단 폼** (`src/app/qna/diagnosis/page.tsx`)
   - 3단계 심층 자가진단 제출 완료 시 `reportGoogleAdsConversion()` 호출.
4. **실시간 전화 상담 폼** (`src/app/qna/phone/page.tsx`)
   - 전화 상담 접수 성공 시 `reportGoogleAdsConversion()` 호출.
5. **방문 상담 예약 폼** (`src/app/qna/visit/page.tsx`)
   - 방문 예약 접수 성공 시 `reportGoogleAdsConversion()` 호출.

---

## 3. 검증 결과
- `npx tsc --noEmit`: 타입 에러 0건 통과
- Git 및 Vercel 배포 트리거 준비 완료

---

## 4. 관련 파일
- `src/types/gtag.d.ts` (신규)
- `src/components/analytics/GoogleAdsTag.tsx` (신규)
- `src/app/layout.tsx` (수정)
- `src/components/RequestSection.tsx` (수정)
- `src/components/FloatingConsultForm.tsx` (수정)
- `src/app/qna/diagnosis/page.tsx` (수정)
- `src/app/qna/phone/page.tsx` (수정)
- `src/app/qna/visit/page.tsx` (수정)
