import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database';

export const createClient = () => {
  // Provide fallback values for static build
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
};

// 브라우저에서 사용할 기본 클라이언트
export const supabase = createClient();
