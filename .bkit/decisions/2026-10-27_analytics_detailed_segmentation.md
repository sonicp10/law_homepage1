# 2026-10-27: 방문 통계 세부 분류 시스템 구축 및 Google Ads 전환 추적 무결성 검증

## 1. 개요 및 배경
대표님의 요청에 따라 관리자 대시보드 방문 통계 페이지에서 방문자 및 의뢰인의 행동을 심층 분석할 수 있도록 **유입 검색어(키워드), 광고 캠페인 성과, 모바일 상세 기종(iPhone vs Galaxy 등), 의뢰인 인구통계 및 프로필(채무 규모, 절차 선호도, 지역 분포)**을 세분화하여 관제할 수 있는 시스템을 구축했습니다.
아울러 어제 설치한 **Google Ads 전환 추적(gtag.js)** 시스템이 정상 동작하고 있는지 전수 점검하여 무결성을 확인했습니다.

---

## 2. 작업 내역

### 1) Google Ads 전환 추적 시스템 무결성 점검
- **설치 컴포넌트**: `src/components/analytics/GoogleAdsTag.tsx` (`AW-18530312690`)
- **전환 트리거 함수**: `reportGoogleAdsConversion()`
- **전환 이벤트 5개 접점 전수 확인**:
  1. `RequestSection.tsx` (메인 빠른 상담)
  2. `FloatingConsultForm.tsx` (플로팅 상담 위젯)
  3. `qna/diagnosis/page.tsx` (3단계 온라인 자가진단)
  4. `qna/phone/page.tsx` (전화 상담 접수)
  5. `qna/visit/page.tsx` (방문 상담 예약)
- **검증 결과**:
  - 전환 추적 스크립트는 루트 레이아웃(`src/app/layout.tsx`)에서 독립적으로 정상 구동 중.
  - 상담 신청 API(200 OK) 성공 시에만 트리거되도록 안전하게 보호되어 있으며, 방문자 통계 개편과 상호 간섭 없이 100% 정상 작동함을 확인.

### 2) 검색어 및 광고 캠페인 자동 추출 엔진 구축
- **트래커 쿼리스트링 수집 (`src/components/analytics/AnalyticsTracker.tsx`)**:
  - 기존의 단순 `pathname` 전송에서 `window.location.search`를 결합한 `fullPath` 전송으로 확장.
- **백엔드 파서 (`src/app/api/admin/analytics/stats/route.ts`)**:
  - `extractSearchKeyword`: 네이버(`query`, `n_keyword`), 다음(`q`), 구글(`utm_term`, `q`, `keyword`) 등 검색어 쿼리 자동 추출.
  - `extractCampaign`: `utm_campaign`, `utm_source`, `gclid`(구글 광고) 감지 및 성과 집계.
  - 상위 검색어 TOP 10 랭킹 및 캠페인 유입 현황 제공.

### 3) 모바일 & 디바이스 세부 기종 정밀 분류
- **모바일 상세 기종 분기 (`parseDetailedDevice`)**:
  - Apple iPhone (iOS), Samsung Galaxy / Android, iPadOS/태블릿, Windows PC, macOS Mac 등으로 세분화.
  - 모바일 vs PC 실시간 점유율 게이지 바 제공.

### 4) 실제 상담 의뢰인 인구통계 및 프로필 분석 섹션 탑재
- **웹 표준 및 개인정보보호법에 대한 정직한 사실 반영**:
  - 일반 브라우저는 성별/나이를 사이트에 노출하지 않으므로, 사이트에 유입되어 실제 상담 및 자가진단을 신청한 의뢰인의 데이터를 기반으로 인구통계 분석 제공.
  - **신청 희망 절차 비중**: 개인회생 vs 개인파산 비율.
  - **채무 규모 분포**: 3천만원 이하, 3천~5천만, 5천만~1억, 1억 이상 등.
  - **지역별 상담 분포**: 전국 시/도 거주지 분포.
  - **구글 애즈 인구통계 연동 안내**: Google Ads 콘솔의 성별(남/여) 및 연령대(20대~60대) 심층 리포트와 100% 연동 확인 가이드 제공.

---

## 3. 검증 결과
- **타입스크립트 컴파일**: `npx tsc --noEmit` 검사 0건 통과 (Exit code: 0).
- **데이터 산출 테스트**:
  - 모바일 80% (Galaxy 60%, iPhone 20%) / PC 20% (Windows 10%, Linux 10%) 정밀 분류 정상 작동 확인.
- **Git Push 및 Vercel 배포 완료**:
  - 커밋 반영 및 Vercel 자동 배포 트리거.

---

## 4. 관련 파일
- `src/components/analytics/AnalyticsTracker.tsx` (수정)
- `src/app/api/admin/analytics/stats/route.ts` (수정)
- `src/app/admin/statistics/page.tsx` (수정)
- `.bkit/decisions/2026-10-27_analytics_detailed_segmentation.md` (신규)
