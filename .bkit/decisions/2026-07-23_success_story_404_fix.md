# 2026-07-23: 메인 페이지 성공사례 링크 404 오류 해결 및 라우트 개선

## 1. 개요
메인 랜딩 페이지의 '성공사례(SUCCESS_STORY)' 섹션에서 카드를 클릭했을 때, 올바르지 않은 경로(`/s_story/posts/{id}` 등)로 이동하여 404 에러가 발생하는 문제를 해결했습니다.

## 2. 원인 분석
- `LandingPostSection` 컴포넌트에서 SUCCESS_STORY 카테고리의 카드를 렌더링할 때, 링크가 존재하지 않는 `/s_story/posts/{id}`로 지정되어 있거나, 초기 수정 시도 시 잘못된 경로 분기가 적용되어 있었습니다.
- 실제 성공사례 데이터는 `Post` 모델을 공유하지만, 상세 페이지는 `/s_story/rehab/[id]` 및 `/s_story/bankruptcy/[id]` 형태로 분리하여 운영되어야 하는 구조였습니다. 하지만 해당 동적 라우트 컴포넌트 자체가 구현되어 있지 않았습니다.

## 3. 해결 방안 및 작업 내역

### 1) 상세 페이지 라우트 신설
기존에 구현되어 있던 `PostDetailClient` 컴포넌트를 재사용하여 각 분야별 성공사례 상세 페이지를 신규 생성했습니다.
- **개인회생 성공사례 상세 페이지 신설**
  - 경로: `src/app/s_story/rehab/[id]/page.tsx`
  - 내용: `<PostDetailClient backUrl="/s_story/rehab" />` 적용
- **개인파산 성공사례 상세 페이지 신설**
  - 경로: `src/app/s_story/bankruptcy/[id]/page.tsx`
  - 내용: `<PostDetailClient backUrl="/s_story/bankruptcy" />` 적용

### 2) 메인 랜딩 페이지 링크 분기 로직 수정
- **수정 파일**: `src/components/LandingPostSection.tsx`
- **내용**: `SUCCESS_STORY` 카테고리 렌더링 시, 각 포스트의 `tags` 필드를 검사하여 올바른 상세 페이지 경로로 이동하도록 수정했습니다.
  - `post.tags`에 '파산'이 포함된 경우 ➡️ `/s_story/bankruptcy/${post.id}`
  - 그 외(개인회생)의 경우 ➡️ `/s_story/rehab/${post.id}`
- **UI 개선**: 카드 상단 좌측 배지 텍스트를 태그에 따라 '파산 성공사례' 또는 '회생 성공사례'로 정확히 표시하도록 로직을 반영했습니다.

## 4. 기대 효과
- 메인 페이지에서 성공사례 클릭 시 404 페이지 이탈을 방지하여 사용자 경험(UX)을 개선했습니다.
- 회생/파산 분야별로 정확한 상세 페이지 뷰를 제공하여 잠재 고객의 전환율(상담 신청) 상승을 기대할 수 있습니다.
