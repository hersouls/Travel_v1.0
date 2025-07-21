// Supabase 기능을 임시로 블록처리 - 나중에 연계 예정
// import { createClient } from '@supabase/supabase-js';
// import { createBrowserClient } from '@supabase/ssr';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 브라우저용 클라이언트
// export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// 서버용 클라이언트 (필요시)
// export const createServerClient = () => {
//   return createClient(supabaseUrl, supabaseAnonKey, {
//     auth: {
//       persistSession: false,
//     },
//   });
// };

// 데이터베이스 테이블 이름 상수
export const TABLES = {
  USERS: 'users',
  TRIPS: 'trips',
  PLANS: 'plans',
} as const;

// RLS (Row Level Security) 정책을 위한 헬퍼 함수
// export const getUserId = async () => {
//   const { data: { user } } = await supabase.auth.getUser();
//   return user?.id;
// };

// 에러 핸들링 헬퍼
export const handleSupabaseError = (error: unknown) => {
  console.error('Supabase error:', error);
  const errorMessage = error instanceof Error ? error.message : 'An error occurred';
  return {
    success: false,
    error: errorMessage,
  };
};

// Mock 데이터 사용을 위한 임시 함수들
export const getMockUserId = () => {
  return 'mock-user-id-123';
};

export const isMockMode = () => {
  return true; // Mock 모드 활성화
};