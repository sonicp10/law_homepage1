# Supabase DB 이전 및 구현 요구사항 명세서 (2026-04-14)

본 문서는 현재 법률사무소 홈페이지의 백엔드 기능을 Supabase(PostgreSQL) 환경으로 원활히 이전하기 위한 데이터 구조 및 비즈니스 로직 명세입니다.

## 1. 데이터베이스 테이블 구조 (SQL)

### A. 리드/상담 신청 관리 (Leads)
상담 위젯 및 3분 자가진단 시스템의 핵심 테이블입니다.
- **Table Name**: `leads`
- **Columns**:
  - `id`: UUID (Primary Key)
  - `name`: TEXT (의뢰인 성함)
  - `phone`: TEXT (연락처, 정규화 필요)
  - `debt_amount`: TEXT (채무액, 선택)
  - `preferred_type`: TEXT (회생/파산/기타)
  - `content`: TEXT (상담 상세 내용)
  - `status`: TEXT (Enum: PENDING, CONTACTED, IN_PROGRESS, COMPLETED, CANCELLED)
  - `source`: TEXT (유입 경로: DRAGGABLE_WIDGET, DIAGNOSIS_FORM 등)
  - `extra_info`: JSONB (자가진단 정보: 생년월일, 주거형태, 가족관계 등 가변 데이터)
  - `is_encrypted`: BOOLEAN (데이터 암호화 처리 여부)
  - `created_at`: TIMESTAMP WITH TIME ZONE (DEFAULT now())

### B. 콘텐츠 관리 (Posts)
성공사례 및 법률 정보 게시판 테이블입니다.
- **Table Name**: `posts`
- **Columns**:
  - `id`: UUID
  - `title`: TEXT
  - `content`: TEXT (HTML 또는 Markdown)
  - `excerpt`: TEXT (요약)
  - `thumbnail`: TEXT (Supabase Storage URL 연동)
  - `category`: TEXT (REHAB, BANKRUPTCY, SUCCESS_STORY, COLUMN)
  - `view_count`: INTEGER (DEFAULT 0)
  - `published`: BOOLEAN (DEFAULT true)

## 2. 핵심 비즈니스 로직 및 구현 가이드

### A. 자가진단 및 위젯 리드 수집
- **API Endpoint**: `/api/leads`
- **Supabase Edge Functions 활용**:
  - 클라이언트에서 `supabase.from('leads').insert()`를 직접 호출하거나, 서버 사이드 보안이 필요한 경우 Edge Function에서 유효성 검사 후 삽입.
  - `extra_info` 필드는 `JSONB` 타입으로 설정하여 폼의 필드가 추가되더라도 스키마 변경 없이 대응 가능해야 함.

### B. 데이터 보안 및 RLS (Row Level Security)
- **보안 원칙**: 모든 의뢰인 개인정보는 공개적으로 조회되어서는 안 됨.
- **RLS Policy**:
  - `anon`: `INSERT` 권한만 허용 (상담 신청 전용)
  - `authenticated (Admin)`: 모든 권한 (`SELECT`, `UPDATE`, `DELETE`) 허용
  - `service_role`: 백엔드 크론잡 또는 알림 발송 서비스용

### C. 실시간 알림 시스템
- **Supabase Realtime**:
  - 새로운 리드가 `leads` 테이블에 삽입될 때 관리자 대시보드에서 실시간 알림(Toast) 노출.
- **Database Webhooks**:
  - `INSERT` 트리거 발생 시 외부 API(알림톡, 이메일 등)를 호출하여 관리자에게 알림 전송.

## 3. Git 및 Bkit 기록 사항
- **Prisma Schema**: `prisma/schema.prisma`를 Supabase 초기화의 기준 스크마로 활용.
- **API 연동**: `src/app/api/leads/route.ts`에 구현된 데이터 매핑 로직을 Supabase 클라이언트 메서드로 치환 준비.

## 4. 권장 마이그레이션 순서
1. Supabase 프로젝트 생성 및 SQL Editor를 통해 테이블 생성.
2. 환경 변수 (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) 설정.
3. `src/hooks/useSupabaseLeads.ts`와 같은 커스텀 훅을 생성하여 기존 Prisma fetch 로직 대체.
4. 기존 로컬 DB/Supabase의 `Lead` 데이터를 시드 스크립트로 이관.
