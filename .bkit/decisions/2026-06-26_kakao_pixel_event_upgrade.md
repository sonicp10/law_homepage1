# 2026-06-26: 카카오 픽셀 이벤트 전면 고도화

## 1. 개요
카카오 픽셀 공식 가이드(https://kakaobusiness.gitbook.io/main/tool/pixel-sdk/install)를 기반으로,
기존 `pageView` 단일 이벤트에서 법무사 홈페이지에 최적화된 **전체 전환 퍼널 추적 체계**로 전면 업그레이드했습니다.

## 2. 작업 내역

### 1) KakaoPixel.tsx — 전역 이벤트 유틸 함수 제공 컴포넌트로 전면 개편
- 기존: `pageView()` 단독 이벤트만 존재
- 변경: 공식 문서 14개 이벤트 중 법무사 서비스에 필요한 핵심 이벤트를 `kakaoPixelEvent` 객체로 export
  - `pageView` — 페이지 방문 (기존 유지)
  - `completeRegistration('Consulting')` — **상담 신청 완료** (핵심 전환)
  - `participation('Consulting')` — 상담 폼 열기 / 자가진단 진입 (잠재고객)
  - `signUp('SignUp')` — 자가진단 제출 완료 (서비스신청)
  - `viewContent({ tag })` — 서비스 페이지(회생/파산) 조회
  - `search`, `purchase` 등 확장 가능 이벤트 모두 준비
- TypeScript 타입 선언(`KakaoPixelTracker` 인터페이스) 추가

### 2) FloatingConsultForm.tsx — 드래그 상담 위젯
- 위젯 열기 버튼 클릭 → `participation('Consulting')` 전송
- 상담 신청 완료(response.ok) → `completeRegistration('Consulting')` 전송

### 3) RequestSection.tsx — 메인 페이지 상담 신청 섹션
- 상담 신청 완료(response.ok) → `completeRegistration('Consulting')` 전송

### 4) ServicePageTracker.tsx — 신규 생성
- `src/components/analytics/ServicePageTracker.tsx` 신규 생성
- 서버 컴포넌트(레이아웃) 내에 삽입 가능한 클라이언트 전용 트래커
- 마운트 시 `viewContent({ tag: serviceName })` 전송

### 5) rehab/layout.tsx, bankruptcy/layout.tsx — 서비스 레이아웃
- `<ServicePageTracker serviceName="개인회생" />` 삽입
- `<ServicePageTracker serviceName="개인파산" />` 삽입

### 6) qna/diagnosis/page.tsx — 자가진단 페이지
- 페이지 마운트 시(useEffect []) → `participation('Consulting')` 전송
- 제출 완료 시 → `signUp('SignUp')` 전송

## 3. 전환 퍼널 추적 구조

| 단계 | 트리거 | 픽셀 이벤트 | 태그 |
|---|---|---|---|
| 서비스 조회 | 회생/파산 페이지 진입 | `viewContent` | 개인회생/개인파산 |
| 잠재고객 진입 | 상담 폼 열기 / 자가진단 시작 | `participation` | Consulting |
| 상담 신청 완료 | 폼 제출 성공 | `completeRegistration` | Consulting |
| 자가진단 완료 | 진단 제출 성공 | `signUp` | SignUp |
| 페이지 방문 | 모든 페이지 이동 | `pageView` | — |

## 4. 관련 파일
- `src/components/analytics/KakaoPixel.tsx` (전면 개편)
- `src/components/analytics/ServicePageTracker.tsx` (신규)
- `src/components/FloatingConsultForm.tsx`
- `src/components/RequestSection.tsx`
- `src/app/rehab/layout.tsx`
- `src/app/bankruptcy/layout.tsx`
- `src/app/qna/diagnosis/page.tsx`
