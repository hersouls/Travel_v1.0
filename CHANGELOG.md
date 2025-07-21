# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-XX

### 🎨 Added - Tailwind UI Toolkit 업그레이드
- **Tailwind UI Toolkit** 적용으로 프리미엄 컴포넌트 시스템 구축
- **새로운 UI 컴포넌트** 추가:
  - `Badge` - 상태 및 카테고리 표시
  - `Avatar` - 사용자 프로필 이미지
  - `DropdownMenu` - 완전한 드롭다운 시스템
- **일관된 디자인 시스템** 구현:
  - Blue-600 메인 컬러 팔레트
  - 현대적인 그림자와 애니메이션
  - 접근성 고려한 사용자 인터페이스

### 🔄 Changed - 기존 컴포넌트 업그레이드
- **Button 컴포넌트**: Tailwind UI 스타일로 완전 재설계
  - variant: default, secondary, outline, ghost, destructive, success
  - size: sm, md, lg
  - 현대적인 포커스 및 호버 상태
- **Input 컴포넌트**: 현대적인 디자인 적용
  - focus-visible 스타일 개선
  - 에러 상태 디자인 개선
- **Card 컴포넌트**: 깔끔한 디자인과 일관된 스타일
  - rounded-lg, shadow-sm 적용
  - 일관된 패딩과 마진

### 🎯 Enhanced - 페이지별 디자인 개선
- **메인 페이지 (HomePage)**:
  - 히어로 섹션 추가 (Badge 기반 통계)
  - Avatar 기반 사용자 메뉴
  - 검색 및 필터 UI 개선
  - 통계 카드 디자인 현대화
- **여행 생성 페이지**:
  - 히어로 섹션 추가
  - 로딩 상태 개선 (스피너 애니메이션)
  - 여행 기간 표시 개선
  - 버튼 디자인 현대화
- **여행 상세 페이지**:
  - Day 탭에 Badge 컴포넌트 적용
  - 여행 정보 카드 개선
  - 로딩 상태 개선

### 🃏 Improved - 카드 컴포넌트 개선
- **TripCard 컴포넌트**:
  - Badge 컴포넌트로 국가 표시
  - 호버 효과 및 애니메이션 개선
  - 즐겨찾기 버튼 추가
  - 더욱 아름다운 그라데이션 배경
- **PlanCard 컴포넌트**:
  - Badge 컴포넌트로 계획 유형 표시
  - 별점 표시 개선 (SVG 아이콘 사용)
  - 사진 개수 표시 개선
  - 유튜브 링크 표시 개선

### 📚 Updated - 문서 업데이트
- **README.md**: Tailwind UI 업그레이드 내용 반영
  - 기술 스택 업데이트 (Next.js 15, Tailwind CSS 4)
  - UI/UX 특징 섹션 추가
  - 디자인 시스템 섹션 추가
  - 개발 로드맵 업데이트
- **Design Guid**: v2.0으로 업데이트
  - Tailwind UI 기반 컬러 시스템
  - 컴포넌트 정의 업데이트
  - 레이아웃 & 그리드 시스템 개선
  - 접근성 가이드 추가
- **화면정의서.md**: Tailwind UI Edition으로 업데이트
  - 디자인 시스템 특징 추가
  - 공통 디자인 요소 정의
  - 페이지별 디자인 패턴 상세화
- **PJT_Summary**: 업그레이드 사항 반영
  - 기술 스택 상세화
  - 디자인 시스템 특징 추가
  - 프로젝트 일정 업데이트

### 🛠 Technical - 기술적 개선
- **성능 최적화**:
  - 컴포넌트 최적화
  - 불필요한 리렌더링 방지
  - 이미지 최적화 개선
- **접근성 개선**:
  - 키보드 네비게이션 지원
  - 스크린 리더 지원
  - 색상 대비 개선
- **코드 품질**:
  - TypeScript 타입 안정성 강화
  - 컴포넌트 재사용성 향상
  - 일관된 네이밍 컨벤션

### 🎨 Design System - 디자인 시스템
- **색상 팔레트**:
  - Primary: Blue-600 (#2563EB)
  - Secondary: Gray-100 (#F3F4F6)
  - Success: Green-600 (#16A34A)
  - Warning: Orange-500 (#F97316)
  - Error: Red-600 (#DC2626)
- **타이포그래피**:
  - Inter 폰트 기본 적용
  - 일관된 폰트 크기와 굵기
- **스페이싱 시스템**:
  - Tailwind CSS 기반 일관된 간격
  - 반응형 브레이크포인트 최적화

## [1.0.0] - 2025-09-05

### 🚀 Added - 초기 릴리즈
- **핵심 기능**:
  - 여행일정카드 생성 및 관리
  - 여행계획카드 등록 및 수정
  - Google Maps API 연동
  - 지도 시각화 기능
- **기술 스택**:
  - Next.js, TypeScript, TailwindCSS
  - Supabase (데이터베이스)
  - Google Maps API
- **기본 UI/UX**:
  - 모바일 최적화 디자인
  - 직관적인 카드 UI
  - 반응형 레이아웃

---

## 버전 관리 규칙

### Major Version (X.0.0)
- 큰 기능 추가나 아키텍처 변경
- 호환되지 않는 API 변경

### Minor Version (0.X.0)
- 새로운 기능 추가
- 기존 기능 개선

### Patch Version (0.0.X)
- 버그 수정
- 성능 개선
- 문서 업데이트

---

**Moonwave Travel** - 여행의 모든 순간을 더욱 특별하게 ✨