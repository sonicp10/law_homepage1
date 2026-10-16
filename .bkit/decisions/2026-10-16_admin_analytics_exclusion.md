# 2026-10-16 방문통계 관리자 테스트 유입 자동 제외 및 로그 정리 기능 구현

## 1. 개요
- **배경**:
  - 관리자가 홈페이지 기능 및 상담 폼을 테스트하는 과정에서 발생한 페이지 방문이 방문자 수, 유입 통계, 전환율 집계에 합산되어 실제 잠재 의뢰인 유입 분석을 왜곡시키는 문제 발생.
- **목표**:
  - 관리자 기기 및 관리자 접속 IP에서의 테스트 방문을 트래킹 수집 및 통계 집계에서 원천 차단하고, 과거 테스트로 쌓인 로그를 원클릭으로 정리할 수 있도록 개선.

---

## 2. 4중 유입 차단 아키텍처

### 2.1 클라이언트 수집 차단 (`src/components/analytics/AnalyticsTracker.tsx`)
- 관리자 전용 경로(`/admin`)는 기본 제외.
- `localStorage.is_admin_session === 'true'` 확인 시 제외.
- 쿠키 `admin_device_excluded=true` 또는 `admin_session_v1` 확인 시 fetch 요청 자체를 중단(Skip).

### 2.2 로그인 시 1년 관리자 기기 쿠키 발급 (`src/app/api/admin/auth/login/route.ts`)
- 관리자 로그인 성공 시 `admin_device_excluded=true` (Max-Age: 1년) 쿠키를 브라우저에 발급.
- 로그인했던 기기는 로그아웃 상태나 비회원 모드에서도 1년간 테스트 방문이 통계로 수집되지 않음.
- 최근 관리자 로그인 IP(`admin_last_ip`)를 함께 기록.

### 2.3 백엔드 트래킹 API 방어 (`src/app/api/analytics/track/route.ts`)
- `admin_device_excluded` 쿠키, `admin_session_v1` JWT 세션, 또는 `admin_last_ip`와 일치하는 IP에서의 트래킹 요청을 DB 저장 없이 즉각 성공(Ignore) 처리.

### 2.4 방문 통계 집계 쿼리 차단 (`src/app/api/admin/analytics/stats/route.ts` & `src/app/api/admin/stats/route.ts`)
- 현재 접속 중인 관리자 IP 및 `127.0.0.1`, `::1`을 집계 필터(`ip: { notIn: excludedIps }`)에 자동 포함.
- 이미 DB에 저장되어 있던 관리자의 과거 테스트 방문 로그도 통계 화면 조회 시 완벽하게 배제되어 순수 의뢰인 유입 데이터만 산출.
- 대시보드의 당일 방문자 수(`todayVisits`)에서도 관리자 IP 및 경로 자동 제외.

### 2.5 과거 관리자 테스트 로그 영구 정리 기능 (`DELETE /api/admin/analytics/stats`)
- 관리자 통계 페이지 상단에 **[🛡️ 관리자 테스트 유입 자동 제외 중 (내 IP)]** 배지 표시.
- **[테스트 로그 정리]** 버튼을 통해 관리자 본인 IP로 기록된 과거 테스트 로그를 DB에서 원클릭으로 영구 삭제 가능.

---

## 3. 검증 결과
- `npm run build`: Turbopack 57개 라우트 빌드 에러 0건 통과.
