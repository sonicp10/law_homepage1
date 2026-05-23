# QnA 게시판 API 파싱 수정 및 Next.js 설정 경고 해결

## Date
2026-05-23

## Context
1. **QnA 게시판 오류**: `/qna/board` 페이지에서 `/api/board-qna`를 호출해 질문 목록을 렌더링하고 있었으나, API가 리턴하는 `{ items, totalCount, totalPages }` 구조의 JSON을 직접 배열로 다루려 하여 `TypeError` 런타임 오류가 발생했습니다.
2. **Next.js 빌드 경고**: `next.config.ts` 파일에서 Next.js 16+ 버전에서 더 이상 지원하지 않는 `eslint` 설정 필드를 포함하고 있어, 빌드 검증 중에 `Unrecognized key(s) in object: 'eslint'` 경고가 계속 발생했습니다.

## Decisions Made
1. **API 파싱 로직 개선 (`src/app/qna/board/page.tsx`)**:
   - `fetch` 결과로 들어온 데이터 내에 `.items`가 배열 형태로 있는지 안전하게 체크하도록 로직을 강화했습니다.
   - 예외 상황 및 오류 발생 시 빈 배열(`[]`)을 반환하도록 설계하여 에러 전파를 막고 안정성을 도모했습니다.
2. **Next.js 설정 최적화 (`next.config.ts`)**:
   - 지원하지 않는 `eslint` 구성 필드를 제거하여, 빌드 검사 과정에서 발생하는 콘솔 경고 메시지를 완전히 없앴습니다.

## Status
성공적으로 완료되었으며 빌드 검증을 모두 마쳤습니다.
