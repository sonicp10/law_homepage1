# Decision Record: 2026-04-13 Address Update & FAQ/Procedure Enhancement

## Status
- **Date**: 2026-04-13
- **Decision Maker**: User & AI Assistant (Antigravity)
- **Status**: Approved & Implemented

## Context
사무소 이전으로 인한 주소 정보 갱신과 '개인회생' 메뉴의 실질적인 정보 가동성을 높이기 위해 '오시는 길', '회생절차', 'FAQ' 페이지의 고도화 작업이 수행됨.

## Decisions

### 1. Office Address Synchronization
- **주소 변경**: "서울 구로구 경인로 579, 502호(신도림동, 안성빌딩 A동)"로 전면 갱신.
- **오시는 길(Map)**: 주소 텍스트, '주소 복사' 기능, 네이버 지도 링크, 그리고 지하철 안내(신도림역 기준)를 통합 업데이트함.
- **기술적 해결**: 일부 환경에서 `navigator.clipboard`가 작동하지 않는 오류를 방지하기 위해 `isSecureContext` 체크 및 `execCommand('copy')` fallback 로직을 구현하여 주소 복사 기능의 안정성을 확보함.

### 2. Legal Procedure Visualization (Step Page)
- **7단계 프로세스**: 단순 요약 방식에서 7가지 상세 법률 단계로 세분화.
- **실무 지침 반영**: '법적 기준'과 '실무적 운용'의 차이점을 별도의 강조 박스로 구성하여 의뢰인에게 실질적인 도움을 줄 수 있도록 설계함.
- **인가 요건 도표화**: 복잡한 인가 기준(총 채무액 대비 변제 비율 등)을 데이터 테이블과 수식 그리드로 구조화함.

### 3. FAQ System with Search & Pagination
- **50개 문항 탑재**: 방대한 양의 FAQ 데이터를 키워드 검색과 페이지네이션 기능으로 최적화.
- **실시간 검색**: 질문과 답변 제목에서 키워드를 추출하여 실시간 필터링 기능 구현.
- **사용자 경험(UX)**: `Framer Motion`을 활용한 애니메이션 아코디언과 10개 단위 페이지네이션을 도입하여 정보 탐색 부하를 최소화함.

## Consequences
- 사이트의 정보 신뢰도가 최신 주소 반영을 통해 유지됨.
- '개인회생' 관련 전문 지식이 풍부하게 제공되어 잠재 고객의 전환율(Conversion) 상승 기대.
- 방대한 법률 데이터를 효과적으로 관리하고 사용자에게 전달할 수 있는 UI 컴포넌트 패턴 확립.
