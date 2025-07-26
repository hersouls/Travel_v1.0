# 🔧 Environment Setup Guide

Moonwave Travel 프로젝트의 환경 변수 설정 가이드입니다.

## 📋 필수 환경 변수 목록

### 🗄️ Supabase 설정 (필수)

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 🗺️ Google Maps API 설정 (필수)

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key
NEXT_PUBLIC_GOOGLE_PLACES_NEW_API_KEY=your_google_places_new_api_key
NEXT_PUBLIC_GOOGLE_DIRECTIONS_API_KEY=your_google_directions_api_key
NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY=your_google_geocoding_api_key
```

### 🔐 Google OAuth 설정 (선택적)

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 🌐 기타 설정

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🚀 Step-by-Step 설정 가이드

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트 대시보드에서 **Settings** → **API**로 이동합니다.
3. 다음 값들을 복사합니다:
   - **URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Supabase 데이터베이스 스키마 설정

```sql
-- SQL Editor에서 다음 명령어 실행
-- 또는 Migration 파일 적용
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/001_initial_schema.sql
```

### 3. Google Cloud Platform 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
2. 새 프로젝트를 생성하거나 기존 프로젝트를 선택합니다.
3. **APIs & Services** → **Enabled APIs & services**로 이동합니다.
4. 다음 API들을 활성화합니다:
   - Maps JavaScript API
   - Places API
   - Places API (New)
   - Directions API
   - Geocoding API

5. **APIs & Services** → **Credentials**로 이동합니다.
6. **Create Credentials** → **API Key**를 클릭합니다.
7. 생성된 API 키를 각 환경 변수에 설정합니다.

### 4. 환경 변수 파일 생성

#### 로컬 개발 환경

`.env.local` 파일을 프로젝트 루트에 생성:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Maps APIs
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIza...
NEXT_PUBLIC_GOOGLE_PLACES_NEW_API_KEY=AIza...
NEXT_PUBLIC_GOOGLE_DIRECTIONS_API_KEY=AIza...
NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY=AIza...

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### GitHub Actions (CI/CD)

Repository Settings → Secrets and variables → Actions에서 설정:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
NEXT_PUBLIC_GOOGLE_PLACES_NEW_API_KEY
NEXT_PUBLIC_GOOGLE_DIRECTIONS_API_KEY
NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY
GOOGLE_CLIENT_ID (optional)
GOOGLE_CLIENT_SECRET (optional)
```

#### Vercel 배포

Vercel Dashboard → Project Settings → Environment Variables에서 설정:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
NEXT_PUBLIC_GOOGLE_PLACES_NEW_API_KEY
NEXT_PUBLIC_GOOGLE_DIRECTIONS_API_KEY
NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY
GOOGLE_CLIENT_ID (optional)
GOOGLE_CLIENT_SECRET (optional)
NEXT_PUBLIC_SITE_URL
```

## ✅ 설정 확인

### 환경 변수 검증

```bash
npm run dev
```

개발 서버 시작 시 콘솔에서 환경 변수 상태를 확인할 수 있습니다:

```
🔧 Environment Variables Status:
✅ Supabase Connection: Ready
✅ Google Maps: Ready
✅ Google Places: Ready
✅ Google OAuth: Configured
🌍 Environment: development
🔗 Site URL: http://localhost:3000
```

### Supabase 연결 테스트

브라우저 개발자 도구 콘솔에서 확인:

```javascript
// 연결 테스트
console.log('Testing Supabase connection...');
```

## 🚨 문제 해결

### 자주 발생하는 오류들

#### 1. `Missing required environment variables`

**원인**: 필수 환경 변수가 설정되지 않음  
**해결**: `.env.local` 파일에 모든 필수 변수를 설정

#### 2. `Supabase connection test failed`

**원인**: 
- 잘못된 Supabase URL/Key
- 네트워크 연결 문제
- Supabase 프로젝트가 일시 중지됨

**해결**: 
1. Supabase 대시보드에서 URL과 Key 재확인
2. 프로젝트가 활성 상태인지 확인
3. API 키 권한 확인

#### 3. `Google Maps API errors`

**원인**: 
- API 키가 유효하지 않음
- 필요한 API가 활성화되지 않음
- API 사용량 한도 초과

**해결**:
1. Google Cloud Console에서 API 키 확인
2. 필요한 모든 API 활성화 확인
3. 사용량 및 요금 확인

#### 4. `Edge Runtime warnings`

**원인**: middleware에서 Node.js API 사용  
**해결**: 이미 코드에서 처리되었으며, 정상 작동합니다.

## 📞 추가 도움이 필요한 경우

1. **Supabase 문서**: https://supabase.com/docs
2. **Google Maps API 문서**: https://developers.google.com/maps/documentation
3. **Next.js 환경 변수 가이드**: https://nextjs.org/docs/basic-features/environment-variables

## 🔒 보안 주의사항

1. **절대 커밋하지 마세요**: `.env.local` 파일을 Git에 커밋하지 마세요
2. **API 키 제한**: Google API 키에 적절한 제한사항을 설정하세요
3. **정기적 회전**: API 키를 정기적으로 교체하세요
4. **최소 권한**: 필요한 최소한의 권한만 부여하세요
