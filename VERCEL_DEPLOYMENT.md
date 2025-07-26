# Vercel 배포 가이드

## 🚀 Vercel 배포 단계

### 1. Vercel 계정 연결
1. [Vercel](https://vercel.com) 웹사이트에 접속
2. GitHub 계정으로 로그인
3. 프로젝트 import를 통해 이 저장소 연결

### 2. 환경 변수 설정
Vercel 대시보드의 프로젝트 설정에서 다음 환경 변수들을 설정해주세요:

#### 필수 환경 변수
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key
NEXT_PUBLIC_GOOGLE_PLACES_NEW_API_KEY=your_google_places_new_api_key
NEXT_PUBLIC_GOOGLE_DIRECTIONS_API_KEY=your_google_directions_api_key
NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY=your_google_geocoding_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

### 3. 도메인 설정
- Vercel에서 자동으로 생성되는 도메인: `your-project-name.vercel.app`
- 커스텀 도메인 연결 시 Vercel 대시보드에서 설정 가능

### 4. 배포 확인
- `main` 브랜치에 푸시하면 자동으로 배포됩니다
- Pull Request 생성 시 Preview 배포가 자동으로 생성됩니다

## 🔧 주요 변경사항

### GitHub Pages → Vercel 마이그레이션
1. **정적 export 제거**: `output: 'export'` 설정 제거로 동적 기능 활성화
2. **이미지 최적화**: Vercel의 이미지 최적화 기능 활용
3. **Server Actions**: 서버 사이드 기능 활용 가능
4. **API Routes**: 백엔드 API 엔드포인트 사용 가능
5. **자동 배포**: GitHub 연동으로 자동 배포 설정

### 성능 개선
- 이미지 최적화 (WebP, AVIF 포맷)
- 번들 크기 최적화
- 서버 사이드 렌더링 활용
- CDN을 통한 전역 배포

## 📝 추가 설정

### Supabase 설정 업데이트
Supabase 대시보드에서 다음 설정을 업데이트해주세요:
- Site URL: `https://your-vercel-domain.vercel.app`
- Redirect URLs: 
  - `https://your-vercel-domain.vercel.app/auth/callback`
  - `https://your-vercel-domain.vercel.app/auth/confirm`

### Google OAuth 설정 업데이트
Google Cloud Console에서:
- Authorized JavaScript origins: `https://your-vercel-domain.vercel.app`
- Authorized redirect URIs: `https://your-vercel-domain.vercel.app/auth/callback`

## 🎯 배포 후 확인사항
- [ ] 메인 페이지 로딩 확인
- [ ] 사용자 인증 기능 테스트
- [ ] Google Maps API 연동 확인
- [ ] 이미지 최적화 작동 확인
- [ ] 모바일 반응형 확인