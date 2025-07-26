import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Database } from '@/lib/types/database';

type TravelPlan = Database['public']['Tables']['travel_plans']['Row'];
type TravelPlanWithDays = TravelPlan & {
  travel_days: {
    id: string;
    day_number: number;
    date: string;
    title: string | null;
    day_plans: {
      id: string;
      place_name: string;
      plan_type: string;
      planned_time: string | null;
    }[];
  }[];
};

interface UseTravelPlansReturn {
  travelPlans: TravelPlanWithDays[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createTravelPlan: (data: Partial<TravelPlan>) => Promise<TravelPlan | null>;
  updateTravelPlan: (id: string, data: Partial<TravelPlan>) => Promise<boolean>;
  deleteTravelPlan: (id: string) => Promise<boolean>;
}

export const useTravelPlans = (): UseTravelPlansReturn => {
  const { user, supabase } = useSupabase();
  const [travelPlans, setTravelPlans] = useState<TravelPlanWithDays[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTravelPlans = useCallback(async () => {
    if (!user) {
      setTravelPlans([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('travel_plans')
        .select(`
          *,
          travel_days (
            id,
            day_number,
            date,
            title,
            day_plans (
              id,
              place_name,
              plan_type,
              planned_time
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(`여행 데이터 로딩 실패: ${fetchError.message}`);
      }

      // travel_days를 day_number로 정렬
      const sortedData = (data || []).map(plan => ({
        ...plan,
        travel_days: plan.travel_days.sort((a, b) => a.day_number - b.day_number)
      }));

      setTravelPlans(sortedData);
    } catch (err) {
      console.error('여행 계획 가져오기 실패:', err);
      setError(err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다'));
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // 여행 계획 생성
  const createTravelPlan = useCallback(async (data: Partial<TravelPlan>): Promise<TravelPlan | null> => {
    if (!user) throw new Error('로그인이 필요합니다');

    try {
      const { data: newPlan, error: createError } = await supabase
        .from('travel_plans')
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (createError) {
        throw new Error(`여행 계획 생성 실패: ${createError.message}`);
      }

      // 목록 새로고침
      await fetchTravelPlans();
      return newPlan;
    } catch (err) {
      console.error('여행 계획 생성 실패:', err);
      setError(err instanceof Error ? err : new Error('여행 계획 생성에 실패했습니다'));
      return null;
    }
  }, [user, supabase, fetchTravelPlans]);

  // 여행 계획 수정
  const updateTravelPlan = useCallback(async (id: string, data: Partial<TravelPlan>): Promise<boolean> => {
    if (!user) throw new Error('로그인이 필요합니다');

    try {
      const { error: updateError } = await supabase
        .from('travel_plans')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) {
        throw new Error(`여행 계획 수정 실패: ${updateError.message}`);
      }

      // 목록 새로고침
      await fetchTravelPlans();
      return true;
    } catch (err) {
      console.error('여행 계획 수정 실패:', err);
      setError(err instanceof Error ? err : new Error('여행 계획 수정에 실패했습니다'));
      return false;
    }
  }, [user, supabase, fetchTravelPlans]);

  // 여행 계획 삭제
  const deleteTravelPlan = useCallback(async (id: string): Promise<boolean> => {
    if (!user) throw new Error('로그인이 필요합니다');

    try {
      const { error: deleteError } = await supabase
        .from('travel_plans')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        throw new Error(`여행 계획 삭제 실패: ${deleteError.message}`);
      }

      // 목록 새로고침
      await fetchTravelPlans();
      return true;
    } catch (err) {
      console.error('여행 계획 삭제 실패:', err);
      setError(err instanceof Error ? err : new Error('여행 계획 삭제에 실패했습니다'));
      return false;
    }
  }, [user, supabase, fetchTravelPlans]);

  // 초기 데이터 로딩 및 실시간 구독
  useEffect(() => {
    if (!user) {
      setTravelPlans([]);
      setLoading(false);
      return;
    }

    fetchTravelPlans();

    // 실시간 구독 설정
    const subscription = supabase
      .channel('travel_plans_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'travel_plans',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchTravelPlans();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'travel_days'
      }, () => {
        fetchTravelPlans();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'day_plans'
      }, () => {
        fetchTravelPlans();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchTravelPlans, user, supabase]);

  return {
    travelPlans,
    loading,
    error,
    refetch: fetchTravelPlans,
    createTravelPlan,
    updateTravelPlan,
    deleteTravelPlan,
  };
};