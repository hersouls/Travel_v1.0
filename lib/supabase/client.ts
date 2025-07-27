import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database';
import { validateSupabaseConnection } from '@/lib/env';

export const createClient = () => {
  // 환경 변수 가져오기
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 개발 환경에서 연결 상태 확인
  if (process.env.NODE_ENV === 'development') {
    const isValid = validateSupabaseConnection();
    if (!isValid) {
      console.warn('⚠️ Supabase client created with placeholder values');
    }
  }

  // Fallback values for build/static generation
  const url = supabaseUrl || 'https://placeholder.supabase.co';
  const key = supabaseKey || 'placeholder-key';

  return createBrowserClient<Database>(url, key);
};

// 브라우저에서 사용할 기본 클라이언트
export const supabase = createClient();

// 연결 상태 확인 함수
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('profiles').select('count').limit(1);

    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test error:', error);
    return false;
  }
};
