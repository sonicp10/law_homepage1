# Rich Editor Enhancements & UI Fixes

## Date: 2026-06-16

### 1. Rich Editor (`RichEditor.tsx`) 기능 고도화
- **BubbleMenu / FloatingMenu 도입**: 텍스트를 드래그해서 블록 지정하거나 이미지를 클릭했을 때 커서 바로 주변에 플로팅 툴바가 뜨도록 기능 추가. 긴 본문 작성 시 스크롤을 위로 올려 메인 툴바를 찾는 번거로움을 해결함.
- **TipTap 모듈 임포트 수정**: Tiptap v3 버전업에 따른 `BubbleMenu` 등의 컴포넌트 임포트 경로를 `@tiptap/react`에서 `@tiptap/react/menus`로 올바르게 업데이트함.
- **Sticky 툴바 버그 픽스**: 부모 컨테이너(`div`)에 `overflow-hidden` 속성이 들어가 있으면 내부의 `position: sticky`가 동작하지 않는 브라우저 렌더링 특성 발견. `src/app/admin/columns/write/page.tsx`와 `edit/[id]/page.tsx`의 에디터 감싸개 영역에서 `overflow-hidden`을 제거하여 스크롤 시 메인 툴바가 상단에 정상적으로 따라다니도록 수정함.

### 2. 랜딩 페이지 성공사례 섹션 UI 및 로직 픽스 (`LandingPostSection.tsx`)
- **라벨 오표기 수정**: 메인 홈페이지 성공사례 섹션 썸네일 좌측 상단에 무조건 `파산 정보`로 표기되던 문제를 수정. `category === 'SUCCESS_STORY'`인 경우, 게시글의 고유 `tags`를 판별하여 `회생 성공사례` 혹은 `파산 성공사례`로 자동 분기 노출되도록 개선함.
- **이동 링크(href) 수정**: 클릭 시 이동되는 개별 게시글 상세 페이지 경로도 태그에 맞춰 올바르게 라우팅되도록 수정.

### 3. 게시글 상세 페이지 UI 최적화 (`PostDetailClient.tsx`)
- **영문 카테고리 한글화**: `SUCCESS_STORY` 문자열이 그대로 노출되던 메타 태그를 `성공사례`로 한글 치환되도록 수정.
- **썸네일(대표 이미지) 짤림 문제 해결**: 썸네일 이미지의 CSS 속성을 `object-cover` (비율 무시하고 컨테이너에 꽉 채우며 자름)에서 `object-contain bg-gray-50 max-h-[600px]` (비율을 유지하며 전체를 다 보여줌)로 변경하여 썸네일이 온전히 렌더링되도록 수정함.

### 4. Git 및 Bkit 업데이트
- 본 내용에 대한 마일스톤 정리와 원격 레포지토리 푸시 진행.
