'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TravelPlan, TravelDay, DayPlan } from '@/lib/types/database';

// 여행 상세 정보를 위한 확장 타입
interface TravelWithDays extends TravelPlan {
  travel_days: (TravelDay & {
    day_plans: DayPlan[];
  })[];
}

interface UseTravelDetailReturn {
  data: TravelWithDays | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTravelDetail(travelId: string): UseTravelDetailReturn {
  const [data, setData] = useState<TravelWithDays | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchTravelDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // 여행 계획과 관련 데이터 조회
      const { data: travel, error: fetchError } = await supabase
        .from('travel_plans')
        .select(
          `
          *,
          travel_days (
            *,
            day_plans (
              *
            )
          )
        `
        )
        .eq('id', travelId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!travel) {
        throw new Error('여행 정보를 찾을 수 없습니다.');
      }

      // 현재 사용자가 액세스 권한이 있는지 확인
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && travel.user_id !== user.id && !travel.is_public) {
        throw new Error('이 여행 계획에 액세스할 권한이 없습니다.');
      }

      setData(travel as TravelWithDays);
    } catch (err) {
      console.error('여행 상세 조회 에러:', err);
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  // 실시간 구독 설정
  useEffect(() => {
    fetchTravelDetail();

    // travel_plans 테이블 변경 구독
    const travelSubscription = supabase
      .channel(`travel_detail_${travelId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'travel_plans',
          filter: `id=eq.${travelId}`,
        },
        (payload) => {
          console.log('여행 정보 실시간 업데이트:', payload);
          const updatedTravel = payload.new;
          setData((prevData) =>
            prevData ? { ...prevData, ...updatedTravel } : null
          );
        }
      )
      .subscribe();

    // travel_days 테이블 변경 구독
    const daysSubscription = supabase
      .channel(`travel_days_${travelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'travel_days',
          filter: `travel_plan_id=eq.${travelId}`,
        },
        (payload) => {
          console.log('여행 일정 실시간 업데이트:', payload);
          // 전체 데이터 다시 로드 (간단한 구현)
          fetchTravelDetail();
        }
      )
      .subscribe();

    // day_plans 테이블 변경 구독
    const plansSubscription = supabase
      .channel(`day_plans_${travelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'day_plans',
        },
        (payload) => {
          console.log('일별 계획 실시간 업데이트:', payload);
          // 전체 데이터 다시 로드 (간단한 구현)
          fetchTravelDetail();
        }
      )
      .subscribe();

    return () => {
      travelSubscription.unsubscribe();
      daysSubscription.unsubscribe();
      plansSubscription.unsubscribe();
    };
  }, [travelId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    refetch: fetchTravelDetail,
  };
}
