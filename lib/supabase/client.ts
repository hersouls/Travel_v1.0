import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/types/database';

export const createClient = () => {
  return createClientComponentClient<Database>();
};

// 브라우저에서 사용할 기본 클라이언트
export const supabase = createClient();