'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/types/database';

type TravelPlan = Database['public']['Tables']['travel_plans']['Row'];

interface UseTravelPlansReturn {
  travels: TravelPlan[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTravelPlans(user: User | null): UseTravelPlansReturn {
  const [travels, setTravels] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchTravels = async () => {
    if (!user) {
      setTravels([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('travel_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setTravels(data || []);
    } catch (err) {
      console.error('여행 목록 조회 오류:', err);
      setError(err instanceof Error ? err.message : '여행 목록을 불러올 수 없습니다.');
      setTravels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravels();

    // 실시간 구독 설정
    if (user) {
      const subscription = supabase
        .channel('travel_plans_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'travel_plans',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            console.log('여행 계획 실시간 업데이트 감지');
            fetchTravels();
          }
        )
        .subscribe();

             return () => {
         subscription.unsubscribe();
       };
     }
   }, [user?.id, fetchTravels, supabase]);

  return {
    travels,
    loading,
    error,
    refetch: fetchTravels,
  };
}
