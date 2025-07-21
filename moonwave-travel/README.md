# Moonwave Travel v1.0 🌍✈️

모바일 여행 플래너 웹서비스 - 여행의 시작부터 끝까지 All-in-One 관리

## 📋 프로젝트 개요

**Moonwave Travel**은 사용자가 간편하게 여행 일정을 생성하고, Day별 세부 계획을 직관적으로 관리하며, 지도 기반 시각화까지 지원하는 모바일 웹서비스입니다.

### 🎯 핵심 기능
- **여행일정카드 생성** - 여행 국가와 기간을 선택하여 전체 여행의 기본 틀을 자동 생성
- **여행계획카드 등록** - Day별로 사진, 시간, 장소, 메모 등 상세 계획을 구체적으로 기록
- **Google 지도 API 연동** - 장소 검색 시 Google Place API를 통해 장소의 상세 정보(영업시간, 평점, 웹사이트 등)를 자동으로 불러와 저장
- **지도 뷰** - 생성된 모든 계획을 지도 위에서 한눈에 확인

### 👥 타겟 사용자
자유여행을 선호하며, 스마트폰으로 일정을 세부적으로 관리하고 싶은 여행자

## 🚀 주요 기능

### 1. 여행일정카드 관리
- 여행 국가/기간 설정
- 대표 이미지 등록
- Day별 자동 템플릿 생성

### 2. 여행계획카드 시스템
- Day별 세부 계획 관리
- 사진 최대 5장 첨부
- 유튜브 링크 연동
- 메모 및 상세 정보 기록

### 3. Google Maps 연동
- 장소 검색 및 자동완성
- Google Place API 실시간 연동
- 영업시간, 평점, 위치, 웹사이트 등 자동 정보 입력

### 4. 지도 시각화
- 전체 일정 지도 뷰
- 유형별 마커 표시
- 경로 연결 및 상세 정보 표시

## 🛠 기술 스택

### Frontend
- **Next.js 14** - React 기반 프레임워크 (App Router)
- **TypeScript** - 타입 안정성
- **TailwindCSS** - 스타일링
- **Lucide React** - 아이콘 라이브러리
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증

### Backend & Database
- **Supabase** - 백엔드 서비스 (Auth, Database, Storage)
- **PostgreSQL** - 데이터베이스
- **Google Maps API** - 지도 및 장소 정보 (향후)

### 주요 라이브러리
- @supabase/supabase-js - Supabase 클라이언트
- @supabase/ssr - Supabase SSR 지원
- date-fns - 날짜 처리
- react-hook-form - 폼 관리
- zod - 스키마 검증

## 📱 사용자 플로우

1. **메인 화면 (여행일정카드 목록)** → 사용자가 생성한 모든 여행일정카드 조회
2. **여행일정카드 생성** → 여행 국가와 기간을 설정하여 새로운 여행 생성
3. **여행일정 상세 (Day별 목록)** → Day별 여행계획카드 목록 조회 및 관리
4. **여행계획카드 상세/수정** → Day별 세부 일정 등록 및 수정
5. **장소 검색 (Google API)** → Google Places API를 활용한 장소 검색 및 선택
6. **전체 일정 지도 보기** → 등록된 모든 계획을 지도 위에서 시각화
7. **계정 관리** → 프로필 및 설정 관리

## 🗄 데이터베이스 구조

### 핵심 테이블
- **users** - 사용자 정보 (Supabase Auth 연동)
- **trips** - 여행일정 (User 1:N)
- **plans** - 여행계획 (Trip 1:N)

### 주요 필드
- **Trip (여행일정)**: tripId, userId, tripTitle, coverImage, startDate, endDate, createdAt
- **Plan (여행계획)**: planId, tripId, day, photos, youtubeLink, startTime, endTime, type, placeName, memo, googlePlaceId, address, latitude, longitude, openingHours, website, priceLevel, rating, createdAt

## 🔌 API 구조

### Supabase API 엔드포인트
- `POST /auth/v1/signup` - 회원가입
- `POST /auth/v1/signin` - 로그인
- `GET /rest/v1/trips` - 여행일정 조회
- `POST /rest/v1/trips` - 여행일정 생성
- `GET /rest/v1/plans` - 여행계획 조회
- `POST /rest/v1/plans` - 여행계획 생성

## 📊 성공 지표 (KPI)

- 첫 일정 생성/저장까지 평균 3분 이내
- 일평균 사용자(DAU) 100명 이상 (초기)
- 일정카드별 평균 계획 등록 5건 이상
- 사용자 피드백 기반 기능 개선 주기 2주 이내

## 🎨 UI/UX 특징

- **모바일 최적화** - iOS/Android 브라우저 지원
- **직관적 카드 UI** - 즉시성·가독성 극대화
- **3회 이내 터치** - 모든 주요 동작 완결
- **반응형 디자인** - 다양한 화면 크기 지원

## 📅 개발 로드맵

### 1단계 (MVP) ✅
- [x] 프로젝트 초기 설정
- [x] 기본 UI 컴포넌트 구축
- [x] Mock 데이터 구현 및 Supabase 블록처리
- [x] 메인 페이지 구현 (Mock 데이터 연동)
- [x] 데이터 서비스 레이어 구축
- [ ] 여행 생성/수정 기능
- [ ] 여행 상세 페이지

### 2단계 (기능 강화)
- [ ] Supabase 인증 연동
- [ ] 여행계획 관리 기능
- [ ] Google Maps 연동
- [ ] 이미지 업로드 기능

### 3단계 (확장)
- [ ] 일정 공유 및 초대 기능
- [ ] 그룹 기능
- [ ] PDF 내보내기
- [ ] 여행지 제휴

## 🔧 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone [repository-url]
cd moonwave-travel
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정 (선택사항)
현재 Mock 데이터 모드로 설정되어 있어 Supabase 설정 없이도 실행 가능합니다.

Supabase 연동을 원하는 경우:
```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 편집하여 Supabase 설정을 추가:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🗄 데이터베이스 설정

### 현재 상태: Mock 데이터 모드
프로젝트는 현재 Mock 데이터를 사용하여 프론트엔드 개발을 진행할 수 있도록 설정되어 있습니다.

- **Mock 데이터 위치**: `src/lib/mockData.ts`
- **데이터 서비스**: `src/lib/dataService.ts`
- **Supabase 연동**: `src/lib/supabase.ts` (주석 처리됨)

### Supabase 연동 (향후)
Supabase 연동을 원하는 경우:

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase-schema.sql` 실행
3. 프로젝트 설정에서 URL과 API 키 복사
4. `src/lib/supabase.ts`의 주석을 해제하고 환경 변수 설정

### 스키마 적용
```bash
# Supabase Dashboard의 SQL Editor에서 실행
# supabase-schema.sql 파일의 내용을 복사하여 실행
```

## 📝 개발 문서

프로젝트 관련 상세 문서는 `../Docs/` 폴더에서 확인할 수 있습니다:

- `PJT_Summary` - 프로젝트 개요
- `PRD` - 제품 요구사항 문서
- `FSD` - 기능 명세서
- `API` - API 정의서
- `ERD` - 데이터베이스 설계서
- `Service Plan` - 서비스 기획서
- `Design Guid` - 디자인 가이드

## 🧪 테스트

```bash
# 개발 모드
npm run dev

# 빌드 테스트
npm run build

# 린트 검사
npm run lint
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**Moonwave Travel** - 여행의 모든 순간을 더욱 특별하게 ✨
