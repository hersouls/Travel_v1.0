/**
 * 환경 변수 검증 및 타입 안전성 확보
 */

// 필수 환경 변수 목록
const requiredEnvVars = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

  // Google Maps API
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_GOOGLE_PLACES_API_KEY:
    process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
  NEXT_PUBLIC_GOOGLE_PLACES_NEW_API_KEY:
    process.env.NEXT_PUBLIC_GOOGLE_PLACES_NEW_API_KEY,
  NEXT_PUBLIC_GOOGLE_DIRECTIONS_API_KEY:
    process.env.NEXT_PUBLIC_GOOGLE_DIRECTIONS_API_KEY,
  NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY:
    process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
} as const;

// 선택적 환경 변수 목록
const optionalEnvVars = {
  // Google OAuth (인증 기능 사용 시 필요)
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  // Site URL
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL || 'https://travel.moonwave.kr',
} as const;

/**
 * 환경 변수 검증 함수
 */
export function validateEnv(): void {
  const missingVars: string[] = [];

  // 필수 환경 변수 검증
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.map((v) => `- ${v}`).join('\n')}\n\nPlease check your .env.local file or GitHub Secrets.`
    );
  }
}

/**
 * 타입 안전한 환경 변수 접근
 */
export const env = {
  // Supabase
  SUPABASE_URL: requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

  // Google Maps
  GOOGLE_MAPS_API_KEY: requiredEnvVars.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  GOOGLE_PLACES_API_KEY: requiredEnvVars.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY!,
  GOOGLE_PLACES_NEW_API_KEY:
    requiredEnvVars.NEXT_PUBLIC_GOOGLE_PLACES_NEW_API_KEY!,
  GOOGLE_DIRECTIONS_API_KEY:
    requiredEnvVars.NEXT_PUBLIC_GOOGLE_DIRECTIONS_API_KEY!,
  GOOGLE_GEOCODING_API_KEY:
    requiredEnvVars.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY!,

  // Optional
  GOOGLE_CLIENT_ID: optionalEnvVars.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: optionalEnvVars.GOOGLE_CLIENT_SECRET,
  SITE_URL: optionalEnvVars.NEXT_PUBLIC_SITE_URL!,

  // 환경 구분
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

/**
 * 개발 환경에서만 환경 변수 로깅
 */
export function logEnvStatus(): void {
  if (env.IS_DEVELOPMENT) {
    console.log('🔧 Environment Variables Status:');
    console.log('✅ Supabase URL:', env.SUPABASE_URL ? 'Set' : '❌ Missing');
    console.log(
      '✅ Supabase Key:',
      env.SUPABASE_ANON_KEY ? 'Set' : '❌ Missing'
    );
    console.log(
      '✅ Google Maps:',
      env.GOOGLE_MAPS_API_KEY ? 'Set' : '❌ Missing'
    );
    console.log(
      '✅ Google Places:',
      env.GOOGLE_PLACES_API_KEY ? 'Set' : '❌ Missing'
    );
    console.log(
      '🔒 Google OAuth:',
      env.GOOGLE_CLIENT_ID ? 'Set' : 'Not configured'
    );
  }
}

// 환경 변수 초기 검증 (빌드 시)
if (typeof window === 'undefined') {
  try {
    validateEnv();
    logEnvStatus();
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    if (env.IS_PRODUCTION) {
      process.exit(1);
    }
  }
}
