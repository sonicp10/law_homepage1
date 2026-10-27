# 2026-10-27: 방문 통계 KST 타임존 보정 및 검색엔진/광고 봇 필터링을 통한 통계 무결성 확보

## 1. 개요 및 배경
1. **Google Ads 통계와 홈페이지 통계 불일치 문제**:
   - 구글 광고(Google Ads) 통계에는 오늘(2026-10-27) 오후 15시~20시 사이 5회의 클릭이 발생했으나, 홈페이지 관리자 대시보드 "24시간대별 방문 패턴" 차트에는 15~21시 사이가 비어있고 오전 6시~10시에 집계되는 오류 발생.
2. **방문자 수치 및 페이지뷰 신뢰성 의구심**:
   - 구글 광고 클릭은 5회인데 홈페이지 순 방문자 수(8명), 총 페이지뷰(12~15회)로 집계되어 허수 트래픽이 섞여 있는 현상 발생.

---

## 2. 근본 원인 분석
1. **서버 타임존(UTC) 버그**:
   - Vercel/Node.js 런타임이 UTC(+0)로 동작하여 `item.createdAt.getHours()` 호출 시 한국 시각(KST, UTC+9)보다 9시간 늦은 UTC 시간(06~10시)으로 그룹화됨.
2. **검색엔진/광고 심사 크롤러 봇(Bot) 무차별 수집**:
   - Googlebot, AdsBot-Google-Mobile, Ads-Naver, Bytespider, HeadlessChrome 등이 사이트를 인덱싱/심사할 때 자바스크립트를 구동하여 트래킹 API(`/api/analytics/track`)를 호출함.
   - 트래킹 및 통계 API에 봇 필터링이 없어 허수 봇 트래픽이 순 방문자(UV)와 페이지뷰(PV)에 그대로 합산되어 지표를 왜곡함.

---

## 3. 작업 내역

### 1) 백엔드 KST 타임존 변환 시스템 구축 (`src/app/api/admin/analytics/stats/route.ts`)
- **KST 헬퍼 함수 구현**:
  - `toKST(date)`, `getKSTDateString(date)`, `getKSTStartOfDay(dateStr)`, `getKSTEndOfDay(dateStr)` 구현.
- **기간 필터링 정확도 확보**:
  - 한국 시간 기준 당일 00:00:00.000 ~ 23:59:59.999 범위로 정확히 쿼리.
- **24시간대별 방문 패턴 집계 보정**:
  - `toKST(item.createdAt).getUTCHours()` 기반으로 오후 15시~20시 유입이 `15:00`, `16:00`, `18:00`, `19:00`에 정확히 표시되도록 보정.

### 2) 봇/크롤러 필터링 및 단일 쿼리 기반 정밀 통계 (`track/route.ts`, `stats/route.ts`)
- **트래킹 수집 단계 봇 차단 (`src/app/api/analytics/track/route.ts`)**:
  - `BOT_REGEX` 검사를 통해 크롤러/봇의 유입은 DB에 저장하지 않고 조기 리턴하여 허수 데이터 유입 원천 방지.
- **통계 집계 단계 정밀 정제 (`src/app/api/admin/analytics/stats/route.ts`)**:
  - 과거 누적된 데이터에서도 봇 로그를 자동 분리하여 순수 사람 의뢰인의 PV, UV, 유입 경로, 인기 페이지, 요일/시간대 통계만 산출.
  - 관리자 헤더에 `🤖 봇/크롤러 N건 필터링 완료` 배지 제공.

### 3) 프론트엔드 브라우저 로컬 시간대 보정 (`src/app/admin/statistics/page.tsx`)
- 클라이언트 브라우저에서 `formatDateToLocal` 함수를 사용하여 오전 9시 이전 UTC 전날 날짜가 찍히는 부작용 해결.

---

## 4. 검증 결과
- **구글 광고 통계와 100% 일치 확인**:
  - 15:46 KST (1명 - 구글 광고 클릭) $\rightarrow$ 15:00 막대 (1건)
  - 16:59 KST (1명 - 구글 광고 클릭) $\rightarrow$ 16:00 막대 (1건)
  - 18:39, 18:43 KST (1명 - 구글 광고 2회 클릭) $\rightarrow$ 18:00 막대 (2건)
  - 19:20 KST (1명 - 구글 광고 클릭) $\rightarrow$ 19:00 막대 (1건)
  - 총합 5회 클릭 $\rightarrow$ DB 구글 유입 5회 완벽 일치.
- **봇 6건 정상 분리**:
  - AdsBot, Googlebot, Bytespider, HeadlessChrome 허수 로그 분리 성공.
- **TypeScript 타입 체크**:
  - `npx tsc --noEmit` 무결성 검증 통과 (Exit code: 0).

---

## 5. 관련 파일
- `src/app/api/analytics/track/route.ts` (수정)
- `src/app/api/admin/analytics/stats/route.ts` (수정)
- `src/app/admin/statistics/page.tsx` (수정)
- `.bkit/decisions/2026-10-27_analytics_kst_timezone_fix.md` (신규/수정)
