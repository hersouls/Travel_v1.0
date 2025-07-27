import { env } from './env';

/**
 * OAuth 리디렉션 URL을 환경에 따라 반환
 */
export function getOAuthRedirectUrl(next?: string): string {
  const baseUrl = env.IS_DEVELOPMENT
    ? env.OAUTH_DEVELOPMENT_REDIRECT_URL
    : env.OAUTH_REDIRECT_URL;

  const nextParam = next ? `?next=${encodeURIComponent(next)}` : '';
  return `${baseUrl}${nextParam}`;
}

/**
 * 현재 환경에서 허용된 JavaScript 원본 목록
 */
export const ALLOWED_ORIGINS = [
  'https://travel.moonwave.kr',
  'http://localhost:3000',
] as const;

/**
 * 현재 환경에서 허용된 리디렉션 URI 목록
 */
export const ALLOWED_REDIRECT_URIS = [
  'http://localhost:3000/auth/callback',
  'https://travel.moonwave.kr/auth/callback',
  'https://travel.moonwave.kr/travels',
] as const;

/**
 * 현재 origin이 허용된 JavaScript 원본인지 확인
 */
export function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.includes(origin as (typeof ALLOWED_ORIGINS)[number]);
}

/**
 * 현재 redirectTo가 허용된 리디렉션 URI인지 확인
 */
export function isAllowedRedirectUri(redirectTo: string): boolean {
  return ALLOWED_REDIRECT_URIS.some((allowed) =>
    redirectTo.startsWith(allowed)
  );
}

/**
 * OAuth 설정 검증
 */
export function validateOAuthConfig(): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Google OAuth 클라이언트 ID 확인
  if (!env.GOOGLE_CLIENT_ID) {
    issues.push('Google OAuth Client ID is not configured');
  }

  // Google OAuth 클라이언트 시크릿 확인 (서버 사이드에서만 필요)
  if (typeof window === 'undefined' && !env.GOOGLE_CLIENT_SECRET) {
    issues.push('Google OAuth Client Secret is not configured');
  }

  // 리디렉션 URL 확인
  const redirectUrl = getOAuthRedirectUrl();
  if (!isAllowedRedirectUri(redirectUrl)) {
    issues.push(`Redirect URL "${redirectUrl}" is not in allowed list`);
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * OAuth 상태 로깅 (개발 환경에서만)
 */
export function logOAuthStatus(): void {
  if (env.IS_DEVELOPMENT) {
    console.log('🔐 OAuth Configuration Status:');

    const config = validateOAuthConfig();
    console.log(
      `${config.isValid ? '✅' : '❌'} OAuth Config:`,
      config.isValid ? 'Valid' : 'Has issues'
    );

    if (!config.isValid) {
      config.issues.forEach((issue) => console.log(`  - ${issue}`));
    }

    console.log('🌐 Allowed Origins:', ALLOWED_ORIGINS);
    console.log('🔄 Allowed Redirect URIs:', ALLOWED_REDIRECT_URIS);
    console.log('📍 Current Redirect URL:', getOAuthRedirectUrl());
  }
}
