# 2026-10-27: 방문 통계 서버 타임존(UTC) 버그 수정 및 KST(한국 표준시) 동기화

## 1. 개요 및 배경
Google Ads 광고를 통한 실시간 유입 고객(오후 15시~20시 사이 5건)이 홈페이지 관리자 대시보드 통계 화면의 "24시간대별 방문 패턴" 그래프에서 15~21시 구간에 표시되지 않고 0건으로 누락되어 보이는 문제를 발견하고 해결했습니다.

- **원인 분석**:
  - 실제 DB(PostgreSQL/Supabase)에는 구글 광고 유입(15:46, 16:59, 18:39, 18:43, 19:20 KST) 데이터가 정상 기록되어 있었음.
  - Vercel/Node.js 서버리스 런타임이 세계표준시(UTC+0)로 구동되어 `item.createdAt.getHours()` 호출 시 한국 시각(15~19시)이 아닌 UTC 시각(06~10시)으로 잘못 집계됨.
  - 그 결과 한국 시간 오후 유입이 오전 6시~10시 막대로 9시간 앞당겨져 표시되었고 15~21시는 비어 보이는 현상 발생.
  - 기간 필터링(`startDate`, `endDate`), 일자별 추이(`chartData`), 요일별 분포(`dayChart`) 역시 UTC 기준으로 계산되어 한국 시간대와 어긋나는 결함 존재.

---

## 2. 작업 내역

### 1) 백엔드 KST 타임존 변환 시스템 구축 (`src/app/api/admin/analytics/stats/route.ts`)
- **KST 헬퍼 함수 구현**:
  - `toKST(date)`: UTC 타임스탬프에 9시간 오프셋 적용
  - `getKSTDateString(date)`: 한국 시간 기준 `YYYY-MM-DD` 문자열 반환
  - `getKSTStartOfDay(dateStr)`: 한국 시간 기준 당일 `00:00:00.000+09:00` Date 생성
  - `getKSTEndOfDay(dateStr)`: 한국 시간 기준 당일 `23:59:59.999+09:00` Date 생성
- **기간 필터링 정확도 확보**:
  - `period === 'day'`(오늘) 조회 시 한국 시간 기준 당일 00시부터 23:59:59까지 정확한 범위 설정.
  - 주간, 월간, 분기, 연간 및 직접 지정 범위도 모두 KST 기준 일치.
- **24시간대별 방문 패턴 집계 보정**:
  - `toKST(item.createdAt).getUTCHours()`를 기반으로 00:00부터 23:00까지의 시간대 매핑.
  - 오후 15시~20시 유입이 `15:00`, `16:00`, `18:00`, `19:00` 시간대에 정확히 누적되도록 수정.
- **일자별 및 요일별 집계 KST 동기화**:
  - 일자별 추이(`chartData`)와 요일별 방문 분포(`dayChart`)를 모두 KST 기준으로 변환하여 하루 밀림/누락 방지.

### 2) 프론트엔드 브라우저 로컬 시간대 보정 (`src/app/admin/statistics/page.tsx`)
- 클라이언트 브라우저에서 `toISOString().split('T')[0]` 사용 시 오전 9시 이전 UTC 전날 날짜가 선택되는 부작용 방지.
- 로컬 시간대 기준 `formatDateToLocal` 함수를 적용하여 당일 날짜 문자열 일관성 유지.

---

## 3. 검증 결과
- **DB 시뮬레이션 및 정밀 검증**:
  - 2026-10-27 당일 13건의 방문 기록 중 구글 유입 고객 5건을 포함한 15:00(1건), 16:00(1건), 18:00(2건), 19:00(3건) 집계 정상 확인.
- **TypeScript 타입 체크**:
  - `npx tsc --noEmit` 검사 0건 통과.

---

## 4. 관련 파일
- `src/app/api/admin/analytics/stats/route.ts` (수정)
- `src/app/admin/statistics/page.tsx` (수정)
- `.bkit/decisions/2026-10-27_analytics_kst_timezone_fix.md` (신규)
