import {
  createServerComponentClient,
  createRouteHandlerClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/types/database';

export const createServerSupabaseClient = () => {
  return createServerComponentClient<Database>({ cookies });
};

export const createRouteHandlerSupabaseClient = () => {
  return createRouteHandlerClient<Database>({ cookies });
};
