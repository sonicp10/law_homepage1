# Decision Record: 2026-04-08 UI/UX Overhaul

## Status
- **Date**: 2026-04-08
- **Decision Maker**: User & AI Assistant (Antigravity)
- **Status**: Approved & Implemented

## Context
기존의 홈페이지 구조가 복잡하고 푸터의 정보 가용성이 낮아, '따뜻함'과 '전문성'이라는 브랜드 아이덴티티를 강화하기 위한 전면적인 개편이 필요했음.

## Decisions

### 1. GNB Structure Reorganization
- **핵심 메뉴**: [회사소개, 개인회생, 개인파산, 성공사례, 상담문의]로 단순화 및 집중화.
- **의도**: 법무사 사무소의 핵심 수익 모델인 회생/파산 서비스를 전면 배치하여 사용자 전환 경로를 단축함.

### 2. Dual-Tone Footer Branding
- **Upper (White)**: 로고 및 상세 사업자 정보를 배치. 가독성을 위해 15-16px 폰트와 볼드체 사용.
- **Lower (Warm Beige #D4CEC1)**: 카피라이트 영역을 분리하여 안정감을 줌.
- **Info Layout**: [상호명 | 대표 | 사업자번호], [주소], [대표전화 | 팩스 | 이메일]의 3단 좌측 정렬 레이아웃 확립.
- **SNS Icons**: 이미지 1번(법무법인 서울) 스타일을 참조하여 딥 네이비 원형 배경에 화이트 그래프 아이콘 적용.

### 3. Hero Section Spacing
- 헤더와의 간섭을 피하고 안정감을 주기 위해 상단 패딩을 `pt-20`에서 `pt-40`으로 상향 조정함.

## Consequences
- 사이트 전반의 신뢰도와 가독성이 향상됨.
- 향후 기능 추가 시 일관된 디자인 시스템(컬러, 폰트 위계)을 따를 수 있는 기준이 마련됨.
