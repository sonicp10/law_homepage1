# 카카오톡 1:1 상담 링크 정상화 및 외부 링크 안정화

## 1. 개요 및 배경
- **요청 사항**: 메인 및 전 페이지 우측 플로팅 메뉴의 카카오톡 상담 아이콘(노란색 말풍선) 클릭 시 정상 작동하지 않는 원인 파악 및 해결.
- **점검 일시**: 2026-10-16

## 2. 미작동 원인 분석
1. **채널 ID 불일치 (치명적)**
   - 기존 설정값: `http://pf.kakao.com/_xWdxfX/chat`
   - 실제 김형근 법무사 채널: `https://pf.kakao.com/_kRxdGX/chat`
   - 분석 결과: `_xWdxfX`는 프로필 정보가 없는 미등록/더미 채널로, 카카오톡 앱 연동 및 1:1 채팅 화면 진입이 불가했음.
2. **비보안 HTTP 프로토콜 사용**
   - 배포 도메인(`https://wooriro.co.kr`)은 HTTPS 환경인데 반해, 링크가 `http://`로 설정되어 카카오 서버의 308 Permanent Redirect 및 브라우저 보안(Mixed Content / 팝업 차단) 제약을 유발함.
3. **외부 링크 라우팅 처리**
   - 외부 URL에 대해 Next.js 내부 라우팅 컴포넌트(`<Link>`) 대신 표준 `<a>` 태그(`target="_blank" rel="noopener noreferrer"`)를 사용하여 브라우저 호환성 및 새 창 연결 안전성을 확보할 필요가 있었음.

## 3. 조치 내역
1. **`src/components/FloatingMenu.tsx` 수정**
   - 채널 URL을 공식 채널인 `https://pf.kakao.com/_kRxdGX/chat`로 변경.
   - 환경변수 `NEXT_PUBLIC_KAKAO_CHAT_URL` 지원 (추후 관리자나 환경변수로 유연하게 변경 가능하도록 구현).
   - 데스크톱 및 모바일 플로팅 메뉴 모두 표준 `<a>` 태그로 외부 링크 렌더링.
   - 카톡 상담 클릭 시 카카오 픽셀 전환 이벤트(`kakaoPixelEvent.participation('KakaoChat')`) 연동 추가.

## 4. 검증 결과
- `https://pf.kakao.com/_kRxdGX/chat` HTTP 200 정상 응답 및 모바일/PC 카카오톡 채팅 진입 스크립트 정상 동작 확인.
- `npm run build` 클린 빌드 검증 및 Vercel 자동 배포 연동.
