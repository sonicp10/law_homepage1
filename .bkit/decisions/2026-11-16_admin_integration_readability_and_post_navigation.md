# 2026-11-16 관리자 통합 정합성 고도화, 성공사례 세분화, 가독성 개선 및 본문 하단 네비게이션 구축

## 1. 개요
관리자 페이지의 방문자·성공사례 조회수 정합성 문제를 해결하고, 성공사례 카테고리 세분화(개인회생 성공사례 / 개인파산 성공사례), 전 서브 페이지 유기적 연동(`의뢰인 후기 관리` 신설 포함), 랜딩페이지 배지 가독성 개선, 에디터 단락 줄바꿈(`<p></p>`) 보존, 그리고 모든 칼럼/성공사례 상세 페이지 최하단의 `이전 글 / 다음 글` 네비게이션을 구축하였습니다.

---

## 2. 주요 작업 내역

### 2.1 방문 통계 및 게시글 조회수(`viewCount`) 정합성 확보 (`d27a9cb`)
- **원인**:
  - `Analytics` 테이블에 동일 IP의 5분 이내 연속 중복 호출(546건) 및 한국 포털·구글 비표준 크롤러(`Yeti`, `Daumoa`, `kakaotalk-scrap`, `66.249.*` 등 373건)가 포함되어 조회수가 부풀려짐.
  - 메인 대시보드(`/admin`)와 방문 통계(`/admin/statistics`)의 오늘 방문자 집계 기준 불일치.
  - 게시글 상세 API(`/api/posts/[id]`)에 봇 필터 및 새로고침 중복 방지 쿠키가 없어 구형 게시글 조회수가 구글봇에 의해 왜곡됨.
- **해결**:
  - `AnalyticsTracker.tsx`, `/api/analytics/track`, `/api/admin/analytics/stats`, `/api/admin/stats` 전체에 5분 중복 호출 차단 및 확장된 봇/스캐너 필터를 통일 적용하고 DB 허수 로그 919건을 정제.
  - `/api/posts/[id]`에 봇 차단, 관리자 기기/IP 제외, `viewed_posts` 쿠키(30분 쿨다운), 수정 화면 `?noIncrement=true`를 적용하고 기존 게시글 조회수를 실제 고객 열람 수와 동기화.
  - 모바일 성공사례 목록(`/s_story/rehab`, `/s_story/bankruptcy`) 상단 배너 높이를 최적화하여 첫 화면에서 즉시 사례 카드가 노출되도록 개선.

### 2.2 성공사례 카테고리 세분화 및 중복 노출 해결 (`52c0f05`)
- **원인**: 인천지방법원 개인회생 성공사례(`cmwekve5s000008l3d9l6akv9`) 태그에 `'개인회생, 개인파산'`이 함께 포함되어 개인파산 성공사례 탭에도 중복 노출됨.
- **해결**:
  - 관리자 새 글 작성(`/admin/columns/write`) 및 글 수정(`/admin/columns/edit/[id]`) 카테고리 선택지를 `About 개인회생`, `About 개인파산`, **`개인회생 성공사례`**, **`개인파산 성공사례`** 4종으로 세분화.
  - `/api/cases` 및 `/api/posts`에서 성공사례의 첫 번째 핵심 태그와 제목 기준으로 개인회생/개인파산 사례가 100% 배타적으로 분리 노출되도록 개선하고 기존 DB 태그 일괄 정규화.

### 2.3 관리자 전 서브 페이지 유기적 연동 및 `의뢰인 후기 관리` 신설 (`097f308`)
- **사이드바 활성 메뉴 정확도 개선 (`src/app/admin/layout.tsx`)**: `?cat=` 쿼리 파라미터까지 비교하여 현재 활성화된 카테고리 메뉴 1개만 하이라이트되도록 수정.
- **의뢰인 후기 관리 페이지 신설 (`src/app/admin/reviews/page.tsx`, `/api/admin/reviews`)**: 관리자 페이지 내에서 의뢰인 후기를 직접 등록·수정·공개/숨김 전환·삭제할 수 있는 전용 CRUD 구축 및 대시보드 연동.
- **대시보드 모달 즉시 답변 (`src/app/admin/page.tsx`)**: 대시보드에서 최근 1:1 게시판 문의 클릭 시 페이지 이동 없이 모달 내에서 즉시 답변 저장 가능하도록 구현.
- **관리자 계정 권한 수정 (`src/app/admin/accounts/page.tsx`)**: 기존 관리자 계정의 세부 권한(`콘텐츠 발행`, `상담 관리`), 등급, 직책 메모를 수정할 수 있는 모달 추가.
- **검색 초기화 버튼 즉시 반영**: 모든 관리 게시판(`columns`, `consultations`, `leads`, `board`)에서 `초기화` 클릭 시 즉시 전체 목록을 재조회하도록 수정.

### 2.4 랜딩페이지 배지·텍스트 가독성 개선 (`ee45c54`)
- `src/components/LandingPostSection.tsx`: 밝은 썸네일 위에서 보이지 않던 연한 하늘색(`#90CAF9`) 배지("회생 정보", "파산 성공사례", "회생 성공사례")를 **진한 네이비 배경(`bg-[#2C3E50]/95`) + 선명한 흰색 텍스트**로 교체.
- `src/app/page.tsx`, `src/components/RequestSection.tsx`, `src/app/globals.css`: 흐릿한 하늘색 강조 텍스트를 골드 브라운(`#A67C52`, `#8B6840`) 및 선명한 로열 블루(`#2563EB`)로 상향.

### 2.5 본문 단락 줄바꿈(`<p></p>`) 보존 및 기존 성공사례 전수 정규화 (`d3c2de0`, `ae4dbca`)
- **원인**: Tiptap 에디터에서 엔터로 띄운 빈 줄이 `<p></p>`로 저장되어 브라우저 렌더링 시 높이 0으로 붕괴됨.
- **해결**:
  - `PostDetailClient.tsx`, `/api/posts`, `globals.css`에서 빈 `<p></p>`를 `<p><br /></p>` 및 최소 높이(`min-height`)로 보존.
  - 기존 작성된 모든 성공사례(7건)와 칼럼(1건)의 DB 본문, 요약글(`**` 마크다운 기호 제거), 표준 분류 태그를 일괄 정규화.

### 2.6 게시글 상세 최하단 `이전 글 / 다음 글` 네비게이션 구현 (`3e72777`)
- `src/app/api/posts/[id]/route.ts` & `src/components/PostDetailClient.tsx`:
  - `About 개인회생`, `About 개인파산`, `개인회생 성공사례`, `개인파산 성공사례` 각 상세 페이지 본문 최하단에 맨 위로 올라가지 않고도 같은 카테고리의 **이전 글 / 다음 글**로 즉시 이동할 수 있는 2단 카드형 네비게이션 바 구현.

---

## 3. 커밋 및 배포 상태
- `d27a9cb`: `fix(admin): unify analytics bot/duplicate filtering and fix success story view counts & UX`
- `52c0f05`: `feat(admin): split success story category into rehab/bankruptcy and fix duplicate case display`
- `097f308`: `feat(admin): complete organic integration across all admin subpages, reviews CRUD, filters, and modals`
- `ee45c54`: `style(ui): replace low-contrast sky-blue badges and text with high-readability navy and gold`
- `d3c2de0`: `fix(editor): preserve empty paragraph line breaks (<p></p>) in post detail rendering`
- `ae4dbca`: `fix(posts): normalize all existing and future success stories with paragraph spacing, clean excerpts, and strict category tags`
- `3e72777`: `feat(post-detail): add bottom prev/next post navigation bar across all column and success story pages`
- GitHub `origin/main` 푸시 및 동기화 완료.
