'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TravelPlan, TravelStatus } from '@/lib/types/database';

interface UseTravelPlansOptions {
  status?: TravelStatus;
  limit?: number;
  userId?: string;
}

interface UseTravelPlansReturn {
  data: TravelPlan[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTravelPlans(
  options: UseTravelPlansOptions = {}
): UseTravelPlansReturn {
  const { status, limit, userId } = options;
  const [data, setData] = useState<TravelPlan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchTravelPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      // 현재 사용자 가져오기 (userId가 제공되지 않은 경우)
      let currentUserId = userId;
      if (!currentUserId) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('로그인이 필요합니다.');
        }
        currentUserId = user.id;
      }

      // 쿼리 빌드
      let query = supabase
        .from('travel_plans')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });

      // 상태 필터 적용
      if (status) {
        query = query.eq('status', status);
      }

      // 제한 적용
      if (limit) {
        query = query.limit(limit);
      }

      const { data: travels, error: fetchError } = await query;

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setData(travels || []);
    } catch (err) {
      console.error('여행 계획 조회 에러:', err);
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  // 실시간 구독 설정
  useEffect(() => {
    fetchTravelPlans();

    // 현재 사용자 확인
    const setupRealtimeSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const currentUserId = userId || user.id;

      // travel_plans 테이블 변경 구독
      const subscription = supabase
        .channel(`travel_plans_${currentUserId}`)
        .on(
          'postgres_changes',
          {
            event: '*', // INSERT, UPDATE, DELETE 모두 구독
            schema: 'public',
            table: 'travel_plans',
            filter: `user_id=eq.${currentUserId}`,
          },
          (payload) => {
            console.log('실시간 변경:', payload);

            if (payload.eventType === 'INSERT') {
              const newTravel = payload.new as TravelPlan;
              setData((prevData) =>
                prevData ? [newTravel, ...prevData] : [newTravel]
              );
            } else if (payload.eventType === 'UPDATE') {
              const updatedTravel = payload.new as TravelPlan;
              setData(
                (prevData) =>
                  prevData?.map((travel) =>
                    travel.id === updatedTravel.id ? updatedTravel : travel
                  ) || null
              );
            } else if (payload.eventType === 'DELETE') {
              const deletedTravel = payload.old as TravelPlan;
              setData(
                (prevData) =>
                  prevData?.filter(
                    (travel) => travel.id !== deletedTravel.id
                  ) || null
              );
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    setupRealtimeSubscription();
  }, [status, limit, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    refetch: fetchTravelPlans,
  };
}
