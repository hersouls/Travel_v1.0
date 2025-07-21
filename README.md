# Moonwave Travel v1.0 🌍✈️

모바일 여행 플래너 웹서비스 - 여행의 시작부터 끝까지 All-in-One 관리

## 📋 프로젝트 개요

**Moonwave Travel**은 사용자가 간편하게 여행 일정을 생성하고, Day별 세부 계획을 직관적으로 관리하며, 지도 기반 시각화까지 지원하는 모바일 웹서비스입니다.

### 🎯 핵심 기능
- **여행일정카드 생성** - 여행 국가와 기간 선택, 일정 자동 생성
- **여행계획카드 등록** - Day별로 사진, 시간, 장소, 메모 등 상세 계획 기록
- **Google 지도 연동** - 장소 검색 시 상세 정보 자동 불러오기
- **전체 일정 지도 뷰** - 모든 계획을 지도 위에서 시각화

### 👥 타겟 사용자
자유여행을 선호하며, 스마트폰으로 일정을 세부적으로 관리하고 싶은 여행자

## 🚀 주요 기능

### 1. 여행일정카드 관리
- 여행 국가/기간 설정
- 대표 이미지 등록
- Day별 자동 템플릿 생성
- 현대적인 카드 UI 디자인

### 2. 여행계획카드 시스템
- Day별 세부 계획 관리
- 사진 최대 5장 첨부
- 유튜브 링크 연동
- 메모 및 상세 정보 기록
- Badge 기반 계획 유형 표시

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
- **Next.js 15** - React 기반 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS 4** - 현대적인 스타일링
- **Tailwind UI Toolkit** - 프리미엄 UI 컴포넌트
- **Lucide React** - 아이콘 시스템

### Backend & Database
- **Google Maps API** - 지도 및 장소 정보
- **Supabase** - 실시간 데이터베이스 및 인증

### 주요 라이브러리
- Google Maps JavaScript API
- Google Places API
- React Hook Form
- Zod (스키마 검증)
- date-fns (날짜 처리)

## 🎨 UI/UX 특징

### 디자인 시스템
- **Tailwind UI 기반** - 프리미엄 컴포넌트 시스템
- **일관된 색상 팔레트** - Blue-600 메인 컬러
- **현대적인 그림자** - 부드러운 depth 효과
- **반응형 디자인** - 모바일 우선 설계
- **접근성 고려** - 키보드 네비게이션, 포커스 상태

### 컴포넌트 시스템
- **Button** - 다양한 variant와 size 지원
- **Input** - 현대적인 포커스 및 에러 상태
- **Card** - 깔끔한 디자인과 일관된 스타일
- **Badge** - 상태 및 카테고리 표시
- **Avatar** - 사용자 프로필 이미지
- **DropdownMenu** - 완전한 드롭다운 시스템

### 사용자 경험
- **모바일 최적화** - iOS/Android 브라우저 지원
- **직관적 카드 UI** - 즉시성·가독성 극대화
- **3회 이내 터치** - 모든 주요 동작 완결
- **부드러운 애니메이션** - 자연스러운 전환 효과

## 📱 사용자 플로우

1. **메인화면** → 여행일정카드 목록 조회 (Badge 기반 통계 표시)
2. **여행일정카드 생성** → 국가/기간 설정 (현대적인 폼 UI)
3. **Day별 상세** → 여행계획카드 추가/수정 (Badge 기반 유형 표시)
4. **장소 검색** → Google Place API 연동
5. **전체 지도** → 등록된 모든 계획 지도 뷰
6. **계정 관리** → Avatar 기반 사용자 메뉴

## 🗄 데이터베이스 구조

### 핵심 테이블
- **User** - 사용자 정보
- **Trip** - 여행일정 (User 1:N)
- **Plan** - 여행계획 (Trip 1:N)

### 주요 필드
- 여행일정: tripId, userId, tripTitle, startDate, endDate, coverImage
- 여행계획: planId, tripId, day, placeName, startTime, endTime, type, photos, memo, googlePlaceId

## 🔌 API 구조

### REST API 엔드포인트
- `POST /api/v1/users/signup` - 회원가입
- `POST /api/v1/users/login` - 로그인
- `GET /api/v1/trips` - 여행일정 조회
- `POST /api/v1/trips` - 여행일정 생성
- `GET /api/v1/trips/{tripId}/plans` - 여행계획 조회
- `POST /api/v1/trips/{tripId}/plans` - 여행계획 생성
- `GET /api/v1/places/search` - 장소 검색

## 📊 성공 지표 (KPI)

- 첫 일정 생성/저장까지 평균 3분 이내
- 일평균 사용자(DAU) 100명 이상 (초기)
- 일정카드별 평균 계획 등록 5건 이상
- 사용자 피드백 기반 기능 개선 주기 2주 이내

## 📅 개발 로드맵

### 1단계 (MVP) ✅ 완료
- 핵심 기능 개발 및 런칭
- 여행카드, 계획카드, 지도연동
- **Tailwind UI 기반 현대적 디자인 적용**

### 2단계 (기능 강화) 🔄 진행중
- 사용성 개선
- 여행 회고/기록 기능 강화
- 멀티미디어 연동 확장
- **추가 UI 컴포넌트 개발**

### 3단계 (확장) 📋 계획
- 일정 공유 및 초대 기능
- 그룹 기능
- PDF 내보내기
- 여행지 제휴

## 🔧 설치 및 실행

```bash
# 프로젝트 클론
git clone [repository-url]
cd moonwave-travel

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 환경 설정
```bash
# .env.local 파일 생성
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 📝 개발 문서

프로젝트 관련 상세 문서는 `Docs/` 폴더에서 확인할 수 있습니다:

- `PJT_Summary` - 프로젝트 개요
- `PRD` - 제품 요구사항 문서
- `FSD` - 기능 명세서
- `API` - API 정의서
- `ERD` - 데이터베이스 설계서
- `Service Plan` - 서비스 기획서
- `Design Guid` - 디자인 가이드 (Tailwind UI 업데이트됨)
- `화면정의서.md` - UI/UX 화면 정의서

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Blue-600 (#2563EB)
- **Secondary**: Gray-100 (#F3F4F6)
- **Success**: Green-600 (#16A34A)
- **Warning**: Orange-500 (#F97316)
- **Error**: Red-600 (#DC2626)

### 타이포그래피
- **Heading**: Inter, font-semibold
- **Body**: Inter, font-normal
- **Caption**: Inter, text-sm

### 컴포넌트 스페이싱
- **Container**: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- **Card**: p-6, rounded-lg, shadow-sm
- **Button**: h-10 px-4 py-2, rounded-lg

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

*Tailwind UI Toolkit으로 구현된 현대적이고 아름다운 사용자 경험*
