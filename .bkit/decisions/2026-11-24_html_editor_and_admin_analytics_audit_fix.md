# 2026-11-24 관리자 HTML 코드 편집기 고도화 및 대시보드/조회수 데이터 파이프라인 정밀 감사·패치

## 1. 배경 및 목적
- **외부 HTML 코드 무손실 편집 및 자체 편집기 양방향 연동**: 외부(Gemini Canvas 등)에서 생성한 `<style>`, `<script>`, `<input type="checkbox">`, `<button onclick="...">` 포함 HTML 칼럼/성공사례 문서를 홈페이지 편집기에 그대로 붙여넣어 인터랙티브 기능(자가점검 체크리스트, 계산기 등)과 끝라인 정렬(`800px`)이 깨짐 없이 1:1로 작동하도록 고도화.
- **성공사례 조회수(`viewCount`) 및 방문 통계(`Analytics`) 파이프라인 동기화**: 목록 페이지(`/s_story/rehab`, `/`) 유입과 개별 상세 페이지(`/s_story/rehab/[id]`) 열람 간의 데이터 흐름을 명확히 분리·시각화(`상세 조회수` + `목록 노출수`)하고, 관리자 대시보드 전 메뉴(10개)에 대한 전수 감사를 통해 페이지네이션 슬라이스 집계 오류 및 방문 상담 일정 누락 버그를 일괄 해결.

---

## 2. 세부 작업 내역

### 1) 관리자 편집기 무손실 HTML/코드 입력 및 인터랙티브 스크립트/정렬 완벽 호환 (`be0f50b`, `fd4d807`, `3187bfd`, `49000ff`)
- **무손실 HTML/코드 입력 탭 & 실시간 분할 미리보기 (`src/components/admin/RichEditor.tsx`)**:
  - 툴바 우측에 `</> HTML / 코드 입력` 전용 모드 및 `편집기 + 미리보기 분할` 토글 탑재.
  - `RawHtmlBlock` 커스텀 Tiptap 노드를 구현하여 외부 복합 HTML 블록과 하단 자체 편집기 문단(`☎ 상담 문의 : All About 회생•파산 | 02-6405-6363` 등)을 단일 에디터 내에서 동시 편집 및 이어쓰기 지원.
- **인터랙티브 `<script>` 및 버튼 하이드레이션 (`src/components/PostDetailClient.tsx`, `src/components/admin/RichEditor.tsx`)**:
  - `dangerouslySetInnerHTML`로 삽입된 `<script>` 노드를 실행 가능한 DOM 스크립트로 재마운트하고 `button:not([type])`에 `type="button"`을 자동 부여하여 체크리스트 점검 버튼 등이 정상 작동하도록 개선.
- **편집기 ↔ 실제 상세 페이지 800px 끝라인 1:1 정렬 일치 (`src/app/globals.css`, `src/components/PostDetailClient.tsx`)**:
  - `.rich-content > p, h1~h4, ul, ol, blockquote`의 기본 폭을 외부 HTML 카드와 동일한 `max-width: 800px; margin-left: auto; margin-right: auto;`로 통일하여 우측 정렬(`text-align: right`) 시 편집기와 실제 페이지의 끝라인이 정확히 일치하도록 수정.

### 2) 성공사례 조회수 파이프라인 동기화 및 관리자 전 메뉴 정밀 감사 패치 (`010e05e`)
- **상세 조회수 HTTP 캐시 방지 및 Analytics 역동기화 (`src/app/api/posts/[id]/route.ts`, `src/components/PostDetailClient.tsx`, `src/app/api/posts/route.ts`)**:
  - `GET /api/posts/[id]` 호출 및 응답에 `Cache-Control: no-store, no-cache, must-revalidate`를 적용하여 모바일 브라우저 캐시로 인한 조회수 증가 누락 방지.
  - `GET /api/posts`에서 `Analytics` 상세 페이지 로그(`/s_story/rehab/[id]` 등)와 `Post.viewCount`를 교차 검증하여 누락분 자동 보정 및 전체 페이지 기준 `totalDetailViews` 합계 산출.
  - 각 게시글 작성일 이후 목록 페이지(`/s_story/rehab`, `/s_story/bankruptcy`) 및 메인 홈(`/`)에서 의뢰인에게 노출된 **`목록 노출수(listExposureCount)`**를 산출하여 관리자 테이블에 `👁️ 상세 N` + `목록노출 N회`로 동시 표기 (`src/app/admin/columns/page.tsx`).
- **대시보드 및 상담 관리 전 메뉴 버그 수정 (`src/app/api/admin/stats/route.ts`, `src/app/admin/page.tsx`, `consultations`, `leads`, `board`, `accounts`)**:
  - 대시보드 `오늘 예정된 방문 상담 일정`이 최근 접수된 상담 6건(`recent.consultations`)만 필터링하여 사전 예약 건을 누락하던 문제를 해결하기 위해 `todayVisitSchedules` 전용 DB 쿼리 분리.
  - `전화/방문 상담`, `게시판 상담`, `상담 신청(리드)` 목록 API에서 DB 전체 기준 `pendingCount`를 반환하도록 개선하여 페이지 이동과 무관하게 정확한 전체 대기/미답변 건수 표시.
  - `관리자 계정 관리`의 활성 상태 토글 및 삭제 API 응답(`res.ok`) 에러 핸들링 보강.

---

## 3. 검증 및 배포 결과
- TypeScript 타입 검증 통과 (`npx tsc --noEmit` 에러 0건).
- GitHub `main` 브랜치 커밋 및 원격 저장소 푸시 완료.
