export const validateGoogleMapsEnv = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    'NEXT_PUBLIC_GOOGLE_PLACES_API_KEY', 
    'NEXT_PUBLIC_GOOGLE_PLACES_NEW_API_KEY',
    'NEXT_PUBLIC_GOOGLE_DIRECTIONS_API_KEY',
    'NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY',
  ]

  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  )

  if (missingVars.length > 0) {
    throw new Error(
      `다음 Google API 키가 설정되지 않았습니다: ${missingVars.join(', ')}`
    )
  }
  
  // 개발 환경에서 경고 (프로덕션만 사용)
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️  개발 환경 사용 금지 - travel.moonwave.kr에서만 테스트하세요')
  }
}

export const validateSupabaseEnv = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.')
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다.')
  }
}

export const validateAllEnv = () => {
  validateGoogleMapsEnv()
  validateSupabaseEnv()
  
  console.log('✅ 모든 환경변수 검증 완료')
}