# 2026-05-28 관리자 에디터 기능 개선 및 버그 수정

## 개요
관리자 페이지 글 작성 에디터(RichEditor)의 주요 버그를 해결하고, 색상 팔레트 확장 및 서식 템플릿 다양화를 완료하였다.

---

## 변경 사항

### 1. 일반체 / 볼드체 굵기 구분 불가 버그 해결
- **원인**: Pretendard 폰트 CDN URL이 브라우저의 로컬 폰트와 충돌하여 font-weight 400/700 구분이 시각적으로 나타나지 않는 문제
- **해결**:
  - `pretendard.css` → `pretendard-dynamic-subset.css` 로 교체
  - font-family 스택 최상위에 `"Pretendard Variable"` 추가
  - `.prose-editor p` 및 `.prose-content p`에 `font-weight: 400 !important` 명시

### 2. 물결 구분선(hr.hr-wavy) 미표시 버그 해결
- **원인**: `6px` 높이로 인한 브라우저 렌더링 누락 및 URL 인코딩 방식 불일치
- **해결**:
  - 높이 `12px`로 확장
  - SVG 이미지를 **Base64 인코딩 URL** 방식으로 변환하여 안정적 렌더링 보장
  - `background-size: 20px 4px`, `background-position: center` 추가

### 3. 구분선 4종 독립 스타일 보장
- `.prose-editor hr.hr-solid/dashed/gradient/wavy` 각각에 `!important` 속성 부여하여 브라우저 기본 `<hr>` 스타일 덮어쓰기 충돌 방지

### 4. 글자색 팔레트 확장
- 기존 8색 → **20색** 확장 (검정/Navy/회색 계열 + 빨강/주황/노랑/초록/파랑/보라 전체 계열 세분화)
- 🌈 `+` 커스텀 컬러 피커 버튼 추가 → `<input type="color">` 연동

### 5. 하이라이트 팔레트 확장
- 기존 6색 → **12색** 확장 (파스텔 전체 계열: 노랑/베이지/주황/초록/민트/파랑/연보라/분홍 등)
- `+` 커스텀 피커 버튼 추가

### 6. 서식 템플릿 확장 (3종 → 7종)
| 기존 | 신규 추가 |
|---|---|
| 성공사례 브리핑 | 대표 법무사 프로필 카드 |
| 법률 정보 가이드 | 개인회생 진행 절차 타임라인 |
| 상담 유도 CTA | 자주 묻는 질문 FAQ 박스 |
| | 신청 전후 비교표 |

---

## 관련 커밋
- `0d8eb91` feat: 글자색/하이라이트 색상 팔레트 다양화, 커스텀 컬러 피커 지원 및 신규 법률 전문 서식 템플릿 4종 추가
- `dbe6732` fix: 에디터 내 일반체/볼드체 대비 개선 및 물결 구분선 노출 오류 해결
- `7c117a0` fix: Tiptap CustomHorizontalRule 노드로 구분선 class 속성 보존

## 수정된 파일
- `src/components/RichEditor.tsx` — 색상 팔레트, 커스텀 피커, 템플릿 7종
- `src/app/globals.css` — 폰트 패밀리, 볼드 가중치, 구분선 스타일
