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

  // OAuth Redirect URLs
  OAUTH_REDIRECT_URL:
    process.env.OAUTH_REDIRECT_URL ||
    'https://travel.moonwave.kr/auth/callback',
  OAUTH_DEVELOPMENT_REDIRECT_URL:
    process.env.OAUTH_DEVELOPMENT_REDIRECT_URL ||
    'http://localhost:3000/auth/callback',
} as const;

/**
 * 플레이스홀더나 테스트 값인지 확인
 */
function isPlaceholderValue(value: string | undefined): boolean {
  if (!value) return true;

  const placeholderPatterns = [
    'placeholder',
    'test_key',
    'test.supabase.co',
    'your_',
    'YOUR_',
    'example',
    'EXAMPLE',
  ];

  return placeholderPatterns.some((pattern) => value.includes(pattern));
}

/**
 * 환경 변수 검증 함수
 */
export function validateEnv(): void {
  const missingVars: string[] = [];
  const placeholderVars: string[] = [];

  // 필수 환경 변수 검증
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      missingVars.push(key);
    } else if (isPlaceholderValue(value)) {
      placeholderVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.map((v) => `- ${v}`).join('\n')}\n\nPlease check your .env.local file or environment configuration.`
    );
  }

  if (placeholderVars.length > 0) {
    console.warn(
      `⚠️ Placeholder values detected in environment variables:\n${placeholderVars.map((v) => `- ${v}`).join('\n')}\n\nPlease set proper values for production deployment.`
    );
  }
}

/**
 * Supabase 연결 상태 확인
 */
export function validateSupabaseConnection(): boolean {
  const supabaseUrl = requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase: Environment variables not set');
    return false;
  }

  if (isPlaceholderValue(supabaseUrl) || isPlaceholderValue(supabaseKey)) {
    console.warn('⚠️ Supabase: Using placeholder values');
    return false;
  }

  try {
    new URL(supabaseUrl);
    console.log('✅ Supabase: Configuration appears valid');
    return true;
  } catch {
    console.error('❌ Supabase: Invalid URL format');
    return false;
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

  // OAuth URLs
  OAUTH_REDIRECT_URL: optionalEnvVars.OAUTH_REDIRECT_URL!,
  OAUTH_DEVELOPMENT_REDIRECT_URL:
    optionalEnvVars.OAUTH_DEVELOPMENT_REDIRECT_URL!,

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

    // Supabase 상태
    const supabaseValid = validateSupabaseConnection();
    console.log(
      `${supabaseValid ? '✅' : '❌'} Supabase Connection:`,
      supabaseValid ? 'Ready' : 'Not configured properly'
    );

    // Google Maps 상태
    const mapsValid = !isPlaceholderValue(env.GOOGLE_MAPS_API_KEY);
    console.log(
      `${mapsValid ? '✅' : '❌'} Google Maps:`,
      mapsValid ? 'Ready' : 'Not configured properly'
    );

    // Google Places 상태
    const placesValid = !isPlaceholderValue(env.GOOGLE_PLACES_API_KEY);
    console.log(
      `${placesValid ? '✅' : '❌'} Google Places:`,
      placesValid ? 'Ready' : 'Not configured properly'
    );

    // OAuth 상태
    console.log('🌍 Environment:', env.NODE_ENV);
    console.log('🔗 Site URL:', env.SITE_URL);
  }
}

// 환경 변수 초기 검증 (빌드 시)
if (typeof window === 'undefined') {
  try {
    validateEnv();
    logEnvStatus();

    // OAuth 상태 로깅 추가
    try {
      const { logOAuthStatus } = await import('./oauth');
      logOAuthStatus();
    } catch (error) {
      console.warn('⚠️ OAuth status logging failed:', error);
    }
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    if (env.IS_PRODUCTION) {
      process.exit(1);
    }
  }
}
