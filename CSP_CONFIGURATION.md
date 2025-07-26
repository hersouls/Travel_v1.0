# Content Security Policy (CSP) Configuration

## 문제 상황
"The Content Security Policy of your site blocks the use of 'eval' in JavaScript" 오류가 발생했습니다.

## 원인 분석
1. **개발 모드**: Next.js는 개발 모드에서 빠른 빌드와 디버깅을 위해 `eval`을 사용합니다
2. **외부 라이브러리**: Google Maps API 등 일부 라이브러리가 내부적으로 `eval`을 사용할 수 있습니다
3. **CSP 설정 부재**: 명시적인 CSP 헤더 설정이 없었습니다

## 해결 방법

### 1. Next.js 설정 수정 (`next.config.js`)
환경별로 다른 CSP 정책을 적용하도록 설정했습니다:

```javascript
async headers() {
  const isDev = process.env.NODE_ENV === 'development';
  
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://maps.googleapis.com https://maps.gstatic.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://maps.googleapis.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].filter(Boolean).join('; ');

  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: cspDirectives,
        },
      ],
    },
  ];
}
```

### 2. 환경별 정책
- **개발 환경**: `'unsafe-eval'` 허용 - Next.js 개발 서버의 HMR(Hot Module Replacement) 지원
- **프로덕션 환경**: `'unsafe-eval'` 제거 - 보안 강화

### 3. CSP 지시어 설명
- `default-src 'self'`: 기본적으로 같은 도메인에서만 리소스 로드
- `script-src`: 스크립트 소스 제한 (Google Maps API 포함)
- `style-src 'unsafe-inline'`: 인라인 스타일 허용 (Tailwind CSS 등)
- `img-src data: https: blob:`: 이미지 소스 허용 (base64, HTTPS, blob)
- `connect-src`: API 연결 허용 (Supabase, Google Maps)

### 4. 보안 강화 사항
- `object-src 'none'`: 플러그인 차단
- `base-uri 'self'`: 기본 URI 제한
- `form-action 'self'`: 폼 제출 제한

## 적용 후 확인사항
1. 개발 모드에서 CSP 오류가 해결되었는지 확인
2. Google Maps 기능이 정상 작동하는지 확인
3. Supabase 연결이 정상 작동하는지 확인
4. 이미지 업로드 및 표시가 정상 작동하는지 확인

## 추가 보안 권장사항
- 프로덕션에서 더 엄격한 CSP 정책 고려
- nonce 또는 hash 기반 스크립트 보안 적용 검토
- 정기적인 CSP 정책 검토 및 업데이트