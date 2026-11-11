# 2026-11-11 Google Ads SSR 태그 최적화, 히어로 문구 개편 및 관리자 인기 페이지/콘텐츠 링크 고도화

## 1. 개요
구글 태그 어시스턴트(Tag Assistant)에서 `AW-18530312690` 태그가 초기 로드 시 누락되던 문제를 해결하고, 메인 히어로 섹션의 핵심 소구 문구를 사업자/자영업자 맞춤형으로 개편하였으며, 관리자 방문 통계 페이지의 인기 열람 페이지 가독성 및 클릭 이동 기능을 고도화하였습니다.

---

## 2. 주요 작업 내역

### 2.1 Google Ads (`AW-18530312690`) SSR `<head>` 직접 렌더링 수정
- **원인**: 기존 `next/script`의 `strategy="afterInteractive"` 방식은 초기 SSR HTML의 `<head>`에 `<link rel="preload" as="script">`만 생성하고 실제 `<script>` 태그를 클라이언트 하이드레이션 이후에 주입하여 태그 어시스턴트 초기 진단 시 누락 오류 발생.
- **해결**:
  - `src/app/layout.tsx`: `<GoogleAdsTag />`를 `<body>`에서 `<head>` 내부 최상단으로 이동.
  - `src/components/analytics/GoogleAdsTag.tsx`: 네이티브 `<script async src="...">` 및 초기화 `<script>`가 SSR 시점에 `<head>`에 즉시 포함되도록 개선.

### 2.2 메인 히어로 섹션 배너 문구 개편 (`src/app/page.tsx`)
- **제거**: `착수금 0원 우선 접수 · 수임료 전액 분납 시스템`
- **추가**:
  1. `사업자 대출·카드 대출 다중 채무 전문 해결`
  2. `자영업 폐업 위기 채무 탕감`

### 2.3 관리자 방문 통계 인기 열람 페이지 및 핵심 관심 콘텐츠 고도화
- **광고 파라미터 정규화 및 한글 페이지명 매핑 (`src/app/api/admin/analytics/stats/route.ts`)**:
  - `normalizePagePath`: `?gad_source=...&gclid=...` 등 광고 추적 쿼리 파라미터로 인해 동일 페이지가 분산 집계되던 문제를 정규화하여 실제 페이지 단위로 통합 집계.
  - `resolvePageTitle`: 정적 라우트(`/`, `/s_story/rehab`, `/qna/diagnosis` 등)의 한글 명칭 매핑 및 게시글 상세 페이지(`/rehab/posts/[id]`, `/s_story/rehab/[id]` 등)의 DB 실제 게시글 제목 자동 조회 연동.
  - `googleads.g.doubleclick.net` 등 구글 광고 리퍼러를 `🎯 구글 검색/배너 광고 (Google Ads)`로 스마트 분류.
- **인기 페이지 목록 및 핵심 관심 콘텐츠 클릭 이동 구현 (`src/app/admin/statistics/page.tsx`)**:
  - `의뢰인 인기 열람 페이지 (Top 10)`: 각 항목에 한글 페이지명과 정규화된 경로를 함께 표시하고, 항목 클릭 시 새 창에서 해당 페이지로 즉시 이동하도록 링크 적용.
  - `핵심 관심 콘텐츠 (AI 수임 증대 맞춤 전략)`: 최다 조회 페이지 배지를 클릭 가능한 외부 링크(`<a>`)로 전환하여 클릭 시 즉시 해당 페이지로 이동 가능하도록 구현.

---

## 3. 커밋 및 배포 상태
- `43fe543`: `fix(analytics): Google Ads(AW-18530312690) gtag 스크립트를 SSR <head> 내부에 직접 렌더링하도록 수정`
- `99d10a0`: `style(hero): 착수금 문구 제거 및 사업자/자영업 채무 해결 핵심 문구 2종 추가`
- `7559982`: `feat(admin): 인기 열람 페이지 한글 명칭/정규화 매핑 및 핵심 관심 콘텐츠 클릭 이동 링크 구현`
- GitHub `origin/main` 동기화 및 Vercel 배포 완료.
