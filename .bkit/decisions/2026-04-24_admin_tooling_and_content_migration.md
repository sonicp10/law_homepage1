# Decision Record: Admin Tooling and Content Management Migration (2026-04-24)

## Context
사용자 경험의 일관성을 높이기 위해 사이트 전반의 명칭을 'About'으로 표준화하고, 일반 사용자 페이지에 노출되어 있던 성공사례 등록 기능을 관리자 전용 기능으로 통합하여 보안과 전문성을 강화할 필요가 있었습니다.

## Decision Summary
1. **명칭 표준화**: 모든 법률 칼럼 카테고리 명칭을 'All'에서 'About'으로 변경하여 브랜딩 통일성을 확보함.
2. **랜딩 페이지 UI 고도화**: 
   - 'About 개인회생/파산' 섹션을 카드형 그리드로 추가.
   - 기존 '맞춤형 솔루션' 섹션을 삭제하고 6개 카드 구성의 '성공사례' 그리드 섹션으로 대체.
3. **콘텐츠 관리 체계 개편**:
   - 사용자 페이지의 성공사례 등록 버튼 및 관련 페이지(`s_story/write`, `case-write`)를 삭제.
   - 관리자 대시보드에 '성공사례 관리' 메뉴를 추가하고 게시글 관리 시스템에 통합.
4. **이미지 관리 기능 강화**:
   - 관리자 페이지에서 외부 URL 입력뿐만 아니라 로컬 파일을 직접 업로드할 수 있는 API 및 UI 구현.

## Proposed Changes

### UI/UX Updates
- **Global**: 'All' -> 'About' 명칭 일괄 변경 (`Header`, `PostDetailClient`, `FloatingMenu`, `AdminLayout` 등)
- **Landing Page**: `About` 섹션 및 `성공사례` 6개 카드 섹션 구현 (`src/app/page.tsx`, `LandingPostSection.tsx`)
- **Success Story**: 사용자 페이지 등록 기능 제거 (`s_story/rehab`, `s_story/bankruptcy`)

### Admin Features
- **Admin Columns**: 
  - `SUCCESS_STORY` 카테고리 필터링 및 작성 지원.
  - URL 파라미터 연동을 통한 메뉴-탭 동기화 최적화.
- **Image Upload**:
  - `/api/admin/upload` 라우트 생성 (public/uploads 저장).
  - 글 작성/수정 시 파일 선택 및 서버 업로드 UI 통합.

### Technical Debt & Cleanup
- 미사용 임시 스크립트 및 테스트용 API 삭제 (`scratch/`, `api/seed`, `api/test-db` 등).
- 성공사례 등록 버튼 삭제 과정에서 발생한 JSX 구문 오류 수정.

## Verification
- [x] 메인 페이지 'About' 및 '성공사례' 섹션 렌더링 확인.
* [x] 관리자 페이지에서 성공사례 필터링 및 등록 기능 확인.
* [x] 관리자 페이지 이미지 업로드 및 미리보기 정상 작동 확인.
* [x] 불필요한 파일 삭제 후 `npm run dev` 정상 작동 확인.

## Notes
- 업로드된 이미지는 서버의 `public/uploads` 디렉토리에 저장되며, 영구적인 호스팅을 위해서는 향후 클라우드 스토리지(S3 등) 연동을 고려할 수 있음.
