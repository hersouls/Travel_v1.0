# GitHub Actions 설정 가이드

## 🚀 개요

이 프로젝트는 Vercel 배포에 최적화된 GitHub Actions 워크플로우를 사용합니다. 두 가지 주요 워크플로우가 구성되어 있습니다:

1. **`vercel-deployment.yml`** - Vercel 배포 자동화
2. **`ci.yml`** - 코드 품질 검사 및 테스트

## 🔧 필수 Secret 설정

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 secrets을 설정해주세요:

### Vercel 관련 Secrets

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

### 환경 변수 Secrets

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
```

## 📋 Vercel Token 생성 방법

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. Settings → Tokens으로 이동
3. "Create Token" 클릭
4. 토큰 이름 입력 (예: `github-actions`)
5. Scope를 적절히 설정
6. 생성된 토큰을 `VERCEL_TOKEN` secret으로 추가

## 📋 Organization & Project ID 확인 방법

```bash
# Vercel CLI 설치 (로컬에서)
npm i -g vercel

# 프로젝트 루트에서 실행
vercel link

# .vercel/project.json 파일 확인
cat .vercel/project.json
```

## 🔄 워크플로우 동작 방식

### CI 워크플로우 (`ci.yml`)

- **트리거**: 모든 push, pull request
- **기능**:
  - TypeScript 타입 검사
  - ESLint 코드 검사
  - Prettier 포맷 검사
  - 빌드 테스트
  - 의존성 보안 검사
  - Lighthouse 성능 테스트 (PR만)

### Vercel 배포 워크플로우 (`vercel-deployment.yml`)

- **트리거**: main/develop 브랜치 push, main 브랜치 PR
- **기능**:
  - 코드 품질 검사
  - Preview 배포 (PR)
  - Production 배포 (main 브랜치)
  - 보안 스캔
  - 자동 댓글로 배포 URL 공유

## 🚦 브랜치 전략

- **`main`** - Production 배포
- **`develop`** - Development 환경
- **`feature/*`** - 기능 개발 브랜치

## 📊 성능 모니터링

### Lighthouse CI

- Pull Request 시 자동으로 성능 테스트 실행
- 성능, 접근성, 모범 사례, SEO 점수 확인
- 결과는 GitHub Actions 아티팩트로 저장

### 성능 기준

- **Performance**: 70% 이상
- **Accessibility**: 90% 이상
- **Best Practices**: 80% 이상
- **SEO**: 80% 이상

## 🔒 보안

### 보안 검사 항목

- npm audit을 통한 의존성 취약점 검사
- TruffleHog를 통한 시크릿 누출 검사
- GitHub Dependency Review

## 🐛 문제 해결

### 일반적인 오류

#### 1. Vercel 토큰 오류

```
Error: Vercel token is invalid
```

- Vercel 토큰이 올바르게 설정되었는지 확인
- 토큰이 만료되지 않았는지 확인

#### 2. 환경 변수 오류

```
Error: Missing environment variables
```

- 모든 필수 환경 변수가 Secrets에 설정되었는지 확인

#### 3. 빌드 실패

```
Error: Build failed
```

- 로컬에서 `npm run build` 테스트
- 타입 에러나 린트 에러 수정

## 📈 모니터링

### GitHub Actions 대시보드

- Actions 탭에서 워크플로우 실행 상태 확인
- 실패한 작업의 로그 확인

### Vercel 대시보드

- 배포 상태 및 성능 메트릭 확인
- 함수 실행 로그 모니터링

## 🔄 업데이트

워크플로우 파일을 수정한 후:

1. 변경사항을 main 브랜치에 push
2. Actions 탭에서 실행 결과 확인
3. 필요시 Secret 값 업데이트

## 📝 추가 설정

### Branch Protection Rules (권장)

Repository Settings > Branches에서:

- Require status checks to pass before merging
- Require branches to be up to date before merging
- Include administrators

### Auto-merge 설정

- Pull Request에서 자동 병합 활성화
- 모든 검사 통과 시 자동 병합
