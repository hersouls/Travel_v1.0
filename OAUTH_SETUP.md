# OAuth 2.0 설정 가이드

이 문서는 Moonwave Travel 프로젝트의 OAuth 2.0 설정에 대한 가이드입니다.

## 🎯 설정된 OAuth 구성

### 승인된 JavaScript 원본
- `https://travel.moonwave.kr` (프로덕션)
- `http://localhost:3000` (개발 환경)

### 승인된 리디렉션 URI
- `http://localhost:3000/auth/callback` (개발 환경)
- `https://travel.moonwave.kr/auth/callback` (프로덕션)
- `https://travel.moonwave.kr/travels` (프로덕션)

## 🔧 Google OAuth 설정

### 1. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 프로젝트 선택 또는 새 프로젝트 생성
3. **APIs & Services** > **Credentials** 메뉴로 이동
4. **Create Credentials** > **OAuth 2.0 Client IDs** 선택

### 2. OAuth 클라이언트 생성

#### Web Application 클라이언트 생성
1. **Application type**: Web application 선택
2. **Name**: "Moonwave Travel" 입력
3. **Authorized JavaScript origins** 추가:
   ```
   https://travel.moonwave.kr
   http://localhost:3000
   ```
4. **Authorized redirect URIs** 추가:
   ```
   http://localhost:3000/auth/callback
   https://travel.moonwave.kr/auth/callback
   https://travel.moonwave.kr/travels
   ```

### 3. 환경 변수 설정

생성된 OAuth 클라이언트 정보를 환경 변수에 설정:

```bash
# .env.local 파일에 추가
GOOGLE_CLIENT_ID=your_google_client_id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🔐 Supabase OAuth 설정

### 1. Supabase Dashboard 설정

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속
2. 프로젝트 선택
3. **Authentication** > **Providers** 메뉴로 이동
4. **Google** 제공자 활성화

### 2. Google OAuth 정보 입력

Supabase Google 제공자 설정에서:
- **Client ID**: Google Cloud Console에서 생성한 클라이언트 ID
- **Client Secret**: Google Cloud Console에서 생성한 클라이언트 시크릿
- **Redirect URL**: Supabase에서 제공하는 리디렉션 URL 사용

## 🚀 구현된 기능

### 1. OAuth 콜백 처리
- `app/(auth)/auth/callback/route.ts`: OAuth 콜백을 처리하는 API 라우트
- 인증 코드를 세션으로 교환
- 성공 시 `/travels` 페이지로 리디렉션

### 2. 환경별 리디렉션 URL 관리
- `lib/oauth.ts`: OAuth 관련 유틸리티 함수
- 개발/프로덕션 환경에 따른 자동 URL 선택
- 허용된 원본 및 리디렉션 URI 검증

### 3. 보안 설정
- `middleware.ts`: OAuth 콜백 경로 허용
- 허용된 도메인 검증
- 환경 변수 검증

## 🔍 설정 확인

### 개발 환경에서 확인
```bash
npm run dev
```

콘솔에서 다음 정보 확인:
```
🔐 OAuth Configuration Status:
✅ OAuth Config: Valid
🌐 Allowed Origins: ['https://travel.moonwave.kr', 'http://localhost:3000']
🔄 Allowed Redirect URIs: ['http://localhost:3000/auth/callback', 'https://travel.moonwave.kr/auth/callback', 'https://travel.moonwave.kr/travels']
📍 Current Redirect URL: http://localhost:3000/auth/callback
```

### 프로덕션 환경에서 확인
```bash
npm run build
npm start
```

## 🛠️ 문제 해결

### 일반적인 문제들

1. **"Invalid redirect_uri" 오류**
   - Google Cloud Console의 승인된 리디렉션 URI 확인
   - Supabase의 리디렉션 URL 설정 확인

2. **"OAuth authentication failed" 오류**
   - 환경 변수 설정 확인
   - Google OAuth 클라이언트 ID/시크릿 확인

3. **"No authorization code" 오류**
   - OAuth 콜백 URL 설정 확인
   - 브라우저 콘솔에서 네트워크 오류 확인

### 디버깅 방법

1. **환경 변수 확인**
   ```bash
   # 개발 환경에서 환경 변수 상태 확인
   npm run dev
   ```

2. **OAuth 설정 검증**
   ```typescript
   import { validateOAuthConfig } from '@/lib/oauth';
   
   const config = validateOAuthConfig();
   console.log(config);
   ```

3. **네트워크 요청 확인**
   - 브라우저 개발자 도구 > Network 탭
   - OAuth 관련 요청 확인

## 📝 참고 사항

- OAuth 설정 변경 후 적용까지 5분에서 몇 시간이 걸릴 수 있습니다.
- 개발 환경에서는 `localhost:3000`을 사용하고, 프로덕션에서는 `travel.moonwave.kr`을 사용합니다.
- 모든 OAuth 관련 URL은 HTTPS를 사용해야 합니다 (개발 환경 제외).