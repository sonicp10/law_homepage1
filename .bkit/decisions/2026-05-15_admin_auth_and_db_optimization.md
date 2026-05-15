# 2026-05-15 Admin Auth Fix and Connection Optimization

## Context
관리자 페이지 로그인 불가 문제 및 Supabase DB 연결 초과(EMAXCONNSESSION) 에러 해결을 위한 긴급 대응.

## Decision
1. 관리자 계정(`sonicp@naver.com`)의 비밀번호를 `.env`에 정의된 `DATABASE_URL` 힌트를 기반으로 `zms!@7ghkdth`로 초기화함.
2. Prisma의 데이터베이스 연결 효율화를 위해 `pg` Pool 설정을 수정하여 각 인스턴스당 연결 수를 `max: 2`로 제한하고 유휴 연결 종료 시간을 설정함.
3. 서비스 오픈 전 보안 및 점검을 위해 메인 페이지를 '공사 중'으로 전환했다가 사용자의 요청에 따라 다시 원복함.
4. 외부 도메인 연결을 해제하여 일반인 접근을 차단함 (사용자 수동 조치).

## Implementation Details
- `scratch/reset_password.ts`: 관리자 비번 초기화 및 권한 부여 스크립트 실행.
- `src/lib/prisma.ts`: `PrismaPg` 어댑터 설정 내 `Pool` 옵션 최적화 (`max: 2`, `idleTimeoutMillis: 30000`).
- `src/app/page.tsx`: 유지보수 페이지 적용 후 다시 `6de25a0` 커밋 시점으로 원복.

## Status
- **Git**: 원격 `main` 브랜치에 모든 변경사항 푸시 완료.
- **DB**: Supabase DB 유저 테이블 업데이트 완료.
- **Vercel**: 최신 코드 배포 완료 (Hobby 플랜 최적화 적용).
