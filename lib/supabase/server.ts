import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/types/database';

// 환경변수 검증 함수 (서버용)
function validateServerEnvironmentVariables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 빌드 시에는 placeholder 값으로 진행
  if (process.env.NODE_ENV === 'production' && !supabaseUrl) {
    return {
      url: 'https://placeholder.supabase.co',
      key: 'placeholder-key',
    };
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are missing on server. Using placeholder values.');
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

export const createServerSupabaseClient = () => {
  const { url, key } = validateServerEnvironmentVariables();
  const cookieStore = cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        } catch {
          // The `remove` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};

// 호환성을 위한 별칭
export const createClient = createServerSupabaseClient;
