import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database';

// 환경변수 검증 함수
function validateEnvironmentVariables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 빌드 시에는 placeholder 값으로 진행
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    // 서버 사이드에서는 환경변수가 없어도 빌드 가능하도록 함
    return {
      url: supabaseUrl || 'https://placeholder.supabase.co',
      key: supabaseAnonKey || 'placeholder-key',
    };
  }

  // 런타임에는 실제 환경변수 필요
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are missing. Using placeholder values.');
    return {
      url: supabaseUrl || 'https://placeholder.supabase.co',
      key: supabaseAnonKey || 'placeholder-key',
    };
  }

  return {
    url: supabaseUrl,
    key: supabaseAnonKey,
  };
}

export const createClient = () => {
  const { url, key } = validateEnvironmentVariables();

  return createBrowserClient<Database>(url, key);
};

// 브라우저에서 사용할 기본 클라이언트
export const supabase = createClient();
