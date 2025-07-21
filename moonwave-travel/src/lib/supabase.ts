import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 브라우저용 클라이언트
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// 서버용 클라이언트 (필요시)
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
};

// 데이터베이스 테이블 이름 상수
export const TABLES = {
  USERS: 'users',
  TRIPS: 'trips',
  PLANS: 'plans',
} as const;

// RLS (Row Level Security) 정책을 위한 헬퍼 함수
export const getUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};

// 에러 핸들링 헬퍼
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return {
    success: false,
    error: error.message || 'An error occurred',
  };
};