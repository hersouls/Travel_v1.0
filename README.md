# 🚀 Moonwave Travel - Next.js 프로젝트

> 스마트한 여행 계획 시스템 - Smart Travel Planning System

## 📋 프로젝트 개요

Moonwave Travel은 협업 기반의 여행 계획 관리 시스템입니다. Next.js 14 App Router, Supabase, Google Maps API를 활용하여 실시간 협업과 지도 통합 기능을 제공합니다.

## 🎯 완료된 Phase 1 체크리스트

### ✅ Next.js 프로젝트 초기화

- [x] **Next.js 14 프로젝트 생성** (App Router)
- [x] **package.json 설정** (dev 스크립트 localhost 금지)
- [x] **next.config.js 설정** (환경변수 및 보안 설정)
- [x] **tailwind.config.js 설정**
  - [x] Pretendard 폰트 설정
  - [x] Container Queries 플러그인
  - [x] Moonwave 컬러 시스템
- [x] **tsconfig.json TypeScript 설정**

### ✅ 프로젝트 구조 생성

- [x] **app/ 디렉토리 구조 설정**
  - [x] `layout.tsx` (루트 레이아웃)
  - [x] `page.tsx` (홈페이지)
  - [x] `globals.css` (Tailwind + Pretendard)
  - [x] `loading.tsx`, `error.tsx`, `not-found.tsx`
- [x] **components/ 디렉토리 구조**
  - [x] `ui/` (기본 UI 컴포넌트)
  - [x] `providers/` (전역 프로바이더)

### ✅ Supabase 연동

- [x] **Supabase 클라이언트 설정** (`lib/supabase/client.ts`)
- [x] **Supabase 서버 컴포넌트 설정** (`lib/supabase/server.ts`)
- [x] **SupabaseProvider 컴포넌트 생성**
- [x] **타입 정의** (`lib/types/database.ts`)

### ✅ 기본 UI 컴포넌트

- [x] **Button 컴포넌트** (Pretendard 폰트 적용)
- [x] **Card 컴포넌트** (Container Queries 적용)
- [x] **Input 컴포넌트**
- [x] **Badge 컴포넌트** (여행 유형별)

### ✅ 배포 설정

- [x] **GitHub Actions 워크플로우** (`.github/workflows/vercel-deployment.yml`)
- [x] **환경 변수 검증 시스템** (`lib/env.ts`)
- [x] **Vercel 배포 설정** (동적 기능 지원)

## 🛠 기술 스택

### Frontend

- **Next.js 14** - App Router, SSG/SSR
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 퍼스트 CSS
- **Container Queries** - 반응형 컴포넌트

### Backend & Database

- **Supabase** - PostgreSQL, Auth, Real-time
- **Row Level Security** - 데이터 보안

### Maps & Location

- **Google Maps API** - 지도 서비스
- **Google Places API** - 장소 검색
- **Google Directions API** - 경로 안내

### Design & Typography

- **Pretendard 폰트** - 한글 최적화
- **Moonwave 컬러 시스템** - 브랜드 아이덴티티
- **Lucide React** - 아이콘 시스템

## 🚀 배포 플랫폼 변경사항

### GitHub Pages → Vercel 마이그레이션 완료 ✅

**주요 변경사항:**
- ✅ **정적 Export 제거**: 동적 기능 활성화 (Server Actions, API Routes)
- ✅ **이미지 최적화**: Vercel 네이티브 이미지 최적화 지원
- ✅ **자동 배포**: GitHub 연동을 통한 자동 배포 설정
- ✅ **성능 향상**: Edge Functions 및 CDN 최적화
- ✅ **도메인 설정**: `travel.moonwave.kr` 커스텀 도메인 연결

**마이그레이션 혜택:**
- 더 빠른 빌드 및 배포 시간
- 실시간 Preview 배포 (Pull Request)
- 향상된 이미지 최적화 (WebP, AVIF)
- 서버사이드 기능 지원

## 🚀 시작하기

### 1. 환경 변수 설정

```bash
# .env.local 파일 생성
cp .env.example .env.local
```

필요한 환경 변수:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your-google-places-api-key
# ... 기타 Google API 키들
```

### 2. 개발 서버 실행

```bash
# 의존성 설치
npm install

# 타입 체크
npm run type-check

# 개발 서버 시작 (localhost 사용 안 함)
npm run dev
```

### 3. 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# Vercel 배포용 빌드
# 자동으로 최적화된 빌드 생성
```

## 📁 프로젝트 구조

```
moonwave-travel/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   ├── globals.css        # 글로벌 스타일
│   ├── loading.tsx        # 로딩 UI
│   ├── error.tsx          # 에러 UI
│   └── not-found.tsx      # 404 페이지
├── components/            # React 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── index.ts
│   └── providers/         # 전역 프로바이더
│       └── SupabaseProvider.tsx
├── lib/                   # 유틸리티 및 설정
│   ├── supabase/          # Supabase 설정
│   ├── google-maps/       # Google Maps 유틸리티
│   ├── types/             # TypeScript 타입
│   ├── utils.ts           # 공통 유틸리티
│   └── env.ts             # 환경 변수 검증
├── public/                # 정적 파일
├── supabase/              # 데이터베이스 스키마
└── .github/workflows/     # GitHub Actions
```

## 🎨 디자인 시스템

### 컬러 팔레트

- **Primary**: Blue (#3b82f6) - 신뢰감, 안정성
- **Secondary**: Purple (#8b5cf6) - 혁신, 창의성
- **Travel Colors**: 여행 유형별 컬러 (해변, 산, 도시, 자연 등)

### 타이포그래피

- **Pretendard 폰트** - 한글 최적화
- **Korean Letter Spacing** - 한글 자간 최적화
- **Break Keep Korean** - 한글 줄바꿈 최적화

### 반응형 디자인

- **Container Queries** - 컴포넌트 기반 반응형
- **Mobile First** - 모바일 우선 설계
- **Safe Area** - iOS 노치 대응

## 📊 성능 지표

### 빌드 결과

- **First Load JS**: ~96KB (홈페이지)
- **Static Generation**: 모든 페이지 정적 생성
- **No TypeScript Errors**: 타입 안전성 확보

### 코드 품질

- **ESLint**: Next.js 권장 설정
- **Prettier**: 코드 포매팅
- **TypeScript Strict Mode**: 엄격한 타입 체크

## 🔧 다음 단계 (Phase 2)

### Week 3: 여행 관리 기능

- [ ] 여행 일정 CRUD
- [ ] 여행 관련 컴포넌트
- [ ] 커스텀 훅

### Week 4: Day별 계획 관리

- [ ] Day별 계획 페이지
- [ ] 계획 관련 컴포넌트
- [ ] 실시간 동기화

### Week 5: 지도 통합

- [ ] Google Maps 연동
- [ ] Google Places 연동
- [ ] 지도 기능

## 🤝 협업 가이드

### 문유의 역할

- ✅ GitHub Repository 설정
- ✅ Supabase 프로젝트 생성
- ✅ 환경 변수 설정
- ✅ 커스텀 도메인 설정

### Cursor AI의 역할 (완료)

- ✅ Next.js 프로젝트 초기화
- ✅ 컴포넌트 및 유틸리티 개발
- ✅ 타입 정의 및 설정
- ✅ 배포 파이프라인 구성

## 📝 라이선스

이 프로젝트는 Moonwave의 소유입니다.

---

**🎉 Phase 1 완료!** Next.js 프로젝트 초기화와 기본 구조 생성이 완료되었습니다. 이제 Vercel을 통한 `travel.moonwave.kr` 배포가 완료되었습니다.
