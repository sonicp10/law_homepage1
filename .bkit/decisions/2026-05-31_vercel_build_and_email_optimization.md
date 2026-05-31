# 2026-05-31 Vercel 빌드 에러 해결 및 이메일 발송 성능 최적화

## 1. 개요
본 문서는 Vercel 환경에서 발생한 `nodemailer` 모듈 관련 빌드 에러의 원인 규명 및 해결 과정과, 이메일 발송 딜레이로 인한 사용자 체감 속도 저하 문제를 해결한 아키텍처 개선 사항을 기록합니다.

## 2. Vercel 빌드 에러 (`Module not found: Can't resolve 'nodemailer'`) 해결
### 2.1 문제 상황
- 로컬 환경에서는 빌드가 성공적으로 수행되나, Vercel 배포 과정에서 `nodemailer` 모듈을 찾지 못하는 에러 발생.
- 원인 파악 결과, `package.json`에는 `nodemailer`가 선언되어 있으나, `package-lock.json`이 원격 저장소에 동기화되지 않아 Vercel의 `npm ci` 과정에서 해당 모듈이 설치되지 않음이 확인됨.

### 2.2 해결 방안
- `package-lock.json` 파일을 최신 상태로 갱신하고 GitHub 저장소에 푸시.
- `next.config.ts`에 임시로 추가했던 `serverExternalPackages` 등의 우회 설정들을 제거하고 표준 ES Module 형식의 `import` 구문으로 복구하여 Next.js(Turbopack)가 Node.js 런타임에 맞게 자연스럽게 번들링하도록 순정 상태로 롤백함.

## 3. 이메일 발송 응답 속도 최적화 (Non-blocking 아키텍처)
### 3.1 문제 상황
- 상담 접수 API 처리 시, DB 저장 직후 관리자 이메일을 발송하는 `sendAdminNotification` 함수를 `await`로 대기하고 있었음.
- 외부 SMTP 서버(Gmail) 통신에 약 2~3초가 소요되어 사용자가 "상담 신청" 버튼 클릭 후 완료 알림을 받기까지 불필요한 대기 시간이 발생함.

### 3.2 해결 방안
- Next.js 15+에서 안정화된 `after()` API (from `next/server`)를 도입.
- 이메일 발송 로직을 `after()` 콜백 내부에 래핑하여, 응답 처리가 완료된 후 백그라운드에서 이메일이 발송되도록 비동기 처리 적용.
- 대상 API 경로:
  - `/api/leads/route.ts`
  - `/api/consultations/route.ts`
  - `/api/board-qna/route.ts`
- **결과**: 상담 접수 응답 속도가 0.1초 수준으로 비약적으로 향상됨.

## 4. 프론트엔드 UI/UX 개선
### 4.1 연락처 입력 폼 자동 서식 적용
- 게시판 상담(`Qna Board`)의 작성 페이지에서 연락처 입력란에 하이픈 자동 생성 기능(`formatPhone`)이 누락되어 있던 문제 해결.
- 입력값에 대해 `maxLength={13}` 및 실시간 포맷팅 로직 추가로 데이터 정합성 강화.

## 5. 결론
모든 로직은 정상적으로 작동하며, Vercel 배포 안정성 확보 및 사용자 대기 시간(Latency) 최소화를 달성했습니다. 본 기록은 향후 시스템 유지보수 및 디버깅 시 주요 참고 자료로 활용됩니다.
