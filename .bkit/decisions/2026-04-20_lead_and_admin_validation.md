# Decision Record: 2026-04-20 Lead Validation & Admin CRUD Enhancement

## Status
- **Date**: 2026-04-20
- **Decision Maker**: User & AI Assistant
- **Status**: Approved & Implemented

## Context
본격적인 홈페이지 운영을 앞두고, 상담 신청 데이터가 누락 없이 수집되는지 기술적으로 검증하고, 이를 관리자가 효율적으로 처리할 수 있는 대시보드 기능을 완성해야 했음.

## Decisions

### 1. Prisma Schema & Lead Logic Reinforcement
- **변경 사항**: `Lead` 모델의 필드 확장 및 관계 설정 보강.
- **의도**: 단순 상담 신청을 넘어, 고객의 상태(State), 유입 경로 등을 더 정밀하게 추적하기 위함. `src/app/api/leads/route.ts`의 예외 처리를 강화하여 데이터 누락 가능성을 차단함.

### 2. Technical Validation (Scratch Testing)
- **수행 내용**: `scratch/test-lead-full.js` 등의 스크립트를 통해 API 엔드포인트부터 DB 저장까지의 전 과정을 시뮬레이션함.
- **결과**: 백엔드 로직의 안정성을 확인하였으며, 이를 통해 상담 신청 폼(`FloatingConsultForm`, `RequestSection`)의 신뢰도를 확보함.

### 3. Integrated Admin Dashboard
- **구현 범위**: `/admin/leads`, `/admin/consultations`, `/admin/board` 등의 페이지를 유기적으로 연결.
- **UI/UX**: 기존의 파편화된 게시판 관리 기능을 어드민 시스템 내부로 완전히 내재화하여 관리 동선을 단축함.

### 4. Page Cleanup
- **정리**: 불필요한 `src/app/qna/ask` 페이지를 삭제하고, 자가진단(`diagnosis`) 페이지로 상담 동선을 단일화하여 사용자 혼란을 방지함.

## Consequences
- 상담 누락 없는 안정적인 운영 기반 마련.
- 관리자가 별도의 도구 없이 홈페이지 내부에서 모든 비즈니스 데이터(고객, 상단, 게시글)를 컨트롤할 수 있게 됨.
