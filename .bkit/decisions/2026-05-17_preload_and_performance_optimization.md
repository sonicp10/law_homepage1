# 의사결정: Next.js 라우터 사전패치(Prefetch) 최적화 및 프리로드 경고 해결

## 컨텍스트 (Context)
메인 홈페이지(`HomePage`)를 로드할 때 브라우저 개발자 도구 콘솔에 다음과 같은 리소스 프리로드 경고가 대량으로 출력되는 현상이 보고되었습니다:
> `The resource https://law-homepage1.vercel.app/images/consultation-banner.jpg was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate as value and it is preloaded intentionally.`

경고 대상이 되는 이미지 리소스는 서브페이지(개인회생, 개인파산, 상담문의, 성공사례, 회사소개 등)의 각 상단 비주얼 영역에 사용되는 고해상도 배너 이미지 5종이었습니다:
- `/images/consultation-banner.jpg` (상담문의 레이아웃)
- `/story-banner-clean.jpg` (성공사례 레이아웃)
- `/images/bankruptcy-banner-liberation.jpg` (개인파산 레이아웃)
- `/images/rehab_banner.png?v=3` (개인회생 레이아웃)
- `/images/intro_banner.png` (회사소개 레이아웃)

## 분석된 원인 (Problem Analysis)
1. **Next.js App Router의 기본 사전패치(Aggressive Prefetching)**:
   Next.js의 `<Link>` 컴포넌트는 기본적으로 사용자의 뷰포트 내에 링크가 보일 때 해당 라우트의 컴포넌트, 레이아웃, 스타일 번들을 백그라운드에서 자동으로 사전패치(`prefetch={true}`)합니다.
2. **레이아웃 리소스 자동 프리로드**:
   헤더 메뉴 및 하단 플로팅 메뉴에 선언된 링크들에 의해 Next.js가 다른 라우트의 레이아웃 코드를 백그라운드에서 파싱하고, 브라우저가 해당 레이아웃에서 렌더링될 배너 이미지들을 `<link rel="preload">` 형태로 미리 요청하게 됩니다.
3. **리소스 낭비 및 브라우저 경고**:
   사용자가 즉시 해당 메뉴를 클릭하여 들어가지 않으면, 브라우저는 "리소스를 미리 다운로드(Preload)했지만 정작 페이지에서는 몇 초 내에 사용하지 않았다"고 인지하여 경고를 띄웁니다. 이는 모바일 기기에서의 과도한 대역폭(데이터) 낭비와 초기 로딩 속도(Lighthouse 점수) 저하를 유발하는 비효율적인 구조입니다.

## 결정된 솔루션 (Proposed Solution)
*   **비집중 사전패치 설정 (`prefetch={false}`) 도입**:
    헤더(`Header.tsx`) 및 플로팅 메뉴(`FloatingMenu.tsx`)에 선언된 서브페이지 링크들에 `prefetch={false}` 속성을 명시적으로 부여합니다.
*   **영향 및 이점**:
    - **경고 메시지 원천 차단**: 초기 진입 시점에 사용하지도 않는 5종의 고해상도 배너 이미지를 미리 다운로드하라는 프리로드 명령이 해제되어 콘솔 경고가 완벽히 사라집니다.
    - **네트워크 대역폭 절약**: 메인 화면 진입 시 불필요한 번들 및 이미지 파일 전송이 차단되어, 초기 로딩 성능 및 모바일 환경에서의 데이터 낭비가 획기적으로 줄어듭니다.
    - **사용자 경험(UX) 유지**: `prefetch={false}`를 설정하더라도 사용자가 메뉴에 마우스를 올리는(Hover) 순간 Next.js가 즉시 사전패치를 실행하므로, 실제 클릭하여 이동할 때의 로딩 지연은 발생하지 않는 지능적 최적화(Hover-based prefetching)가 활성화됩니다.

## 변경된 파일 목록
- [src/components/Header.tsx](file:///d:/Vibe_Coding/law_homepage1/src/components/Header.tsx)
  - 데스크톱 GNB 메뉴 링크, 드롭다운 서브메뉴 링크, 모바일 슬라이더 메뉴 링크에 `prefetch={false}` 일괄 적용
- [src/components/FloatingMenu.tsx](file:///d:/Vibe_Coding/law_homepage1/src/components/FloatingMenu.tsx)
  - 데스크톱 플로팅 퀵메뉴 링크 및 모바일 하단 탭 바 링크에 `prefetch={false}` 일괄 적용

## 의사결정자
*   **개발자**: Antigravity (AI Coding Assistant)
*   **확인 날짜**: 2026-05-17
