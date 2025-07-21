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
- **Next.js** - React 기반 프레임워크
- **TypeScript** - 타입 안정성
- **TailwindCSS** - 스타일링

### Backend & Database
- **Google Maps API** - 지도 및 장소 정보
- **Cloud DB** - Firebase/Supabase (예정)

### 주요 라이브러리
- Google Maps JavaScript API
- Google Places API
- JWT 인증

## 📱 사용자 플로우

1. **메인화면** → 여행일정카드 목록 조회
2. **여행일정카드 생성** → 국가/기간 설정
3. **Day별 상세** → 여행계획카드 추가/수정
4. **장소 검색** → Google Place API 연동
5. **전체 지도** → 등록된 모든 계획 지도 뷰
6. **계정 관리** → 프로필 및 설정

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

## 🎨 UI/UX 특징

### 디자인 철학
- **"파동, 연결, 확장성"** - Moonwave Coding의 핵심 디자인 원칙
- **빠른 프로토타입, 심플함, 감성적 깊이** 공존
- **부드러운 사용자 경험** - 사용자의 흐름을 끊지 않는 UI

### 컬러 시스템
- **Primary**: #6C63FF (Moonwave Main)
- **Secondary**: #F3F4F6 (Background)
- **Accent**: #FFD700 (Highlight)
- **Error**: #FF3860, **Success**: #21B573

### 타이포그래피
- **기본 폰트**: Pretendard / Inter
- **모바일 최적화**: H1 1.5rem, Body 0.95rem
- **데스크탑**: H1 2rem, H2 1.5rem, Body 1rem

### 레이아웃 & 반응형
- **12-Column Grid**: 데스크탑 기준 그리드 시스템
- **Mobile First**: 모바일 1~2컬럼, 데스크탑 12컬럼 확장
- **브레이크포인트**: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)
- **터치 영역**: 최소 48x48px 이상 권장

### 컴포넌트 디자인
- **Button**: 둥근 모서리, 그림자 효과, Radix 기준
- **Card**: 최소 padding 20px, xl 라운드, soft shadow
- **Modal**: Center align, 배경 dimmed

### 접근성
- **WCAG 기준**: 텍스트와 배경 4.5:1 이상 대비
- **스크린리더 대응**: aria-label, role 등 시맨틱 마크업
- **키보드 내비게이션**: Tab, Enter, ESC 등 모든 UI 조작 가능
- **모션 감소**: motion-reduce 설정 시 애니메이션 제거

### 애니메이션 & 모션
- **Framer Motion**: 주요 Fade, Slide, Scale 애니메이션
- **지속 시간**: 0.2~0.4초 자연스러운 가속도
- **모바일 최소화**: 핵심 액션/전환에만 모션 적용

## 📅 개발 로드맵

### 1단계 (MVP)
- 핵심 기능 개발 및 런칭
- 여행카드, 계획카드, 지도연동

### 2단계 (기능 강화)
- 사용성 개선
- 여행 회고/기록 기능 강화
- 멀티미디어 연동 확장

### 3단계 (확장)
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

## 📝 개발 문서

프로젝트 관련 상세 문서는 `Docs/` 폴더에서 확인할 수 있습니다:

- `PJT_Summary` - 프로젝트 개요
- `PRD` - 제품 요구사항 문서
- `FSD` - 기능 명세서
- `API` - API 정의서
- `ERD` - 데이터베이스 설계서
- `Service Plan` - 서비스 기획서
- `Design Guid` - 디자인 가이드

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
