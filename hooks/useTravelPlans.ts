import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import type { Database, DayPlan } from '@/lib/types/database';
import { getKoreanErrorMessage, logError } from '@/lib/utils/errorHandling';

type TravelPlan = Database['public']['Tables']['travel_plans']['Row'];
type TravelPlanWithDays = TravelPlan & {
  travel_days: {
    id: string;
    day_number: number;
    date: string;
    title: string | null;
    day_plans: DayPlan[];
  }[];
};

interface UseTravelPlansReturn {
  travelPlans: TravelPlanWithDays[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createTravelPlan: (
    data: Partial<TravelPlan> &
      Pick<
        TravelPlan,
        | 'title'
        | 'destination'
        | 'start_date'
        | 'end_date'
        | 'status'
        | 'is_public'
        | 'collaborators'
      >
  ) => Promise<TravelPlan | null>;
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

    // 서버 사이드 렌더링 중에는 건너뛰기
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('travel_plans')
        .select(
          `
          *,
          travel_days (
            id,
            day_number,
            date,
            title,
            day_plans (
              *
            )
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        logError(fetchError, 'database', 'fetchTravelPlans');
        throw new Error(getKoreanErrorMessage(fetchError, 'fetch'));
      }

      // travel_days를 day_number로 정렬
      const sortedData = (data || []).map((plan) => ({
        ...plan,
        travel_days: plan.travel_days.sort(
          (a, b) => a.day_number - b.day_number
        ),
      }));

      setTravelPlans(sortedData);
    } catch (err) {
      logError(err, 'database', 'fetchTravelPlans');
      console.error('여행 계획 가져오기 실패:', err);
      setError(
        err instanceof Error ? err : new Error(getKoreanErrorMessage(err, 'fetch'))
      );
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // 여행 계획 생성
  const createTravelPlan = useCallback(
    async (
      data: Partial<TravelPlan> &
        Pick<
          TravelPlan,
          | 'title'
          | 'destination'
          | 'start_date'
          | 'end_date'
          | 'status'
          | 'is_public'
          | 'collaborators'
        >
    ): Promise<TravelPlan | null> => {
      if (!user) {
        const authError = { message: 'Not authenticated' };
        logError(authError, 'auth', 'createTravelPlan');
        throw new Error(getKoreanErrorMessage(authError, 'auth'));
      }

      try {
        const { data: newPlan, error: createError } = await supabase
          .from('travel_plans')
          .insert({
            ...data,
            user_id: user.id,
            metadata: data.metadata || {},
            cover_image_url: data.cover_image_url || null,
          })
          .select()
          .single();

        if (createError) {
          logError(createError, 'database', 'createTravelPlan');
          throw new Error(getKoreanErrorMessage(createError, 'create'));
        }

        // 목록 새로고침
        await fetchTravelPlans();
        return newPlan;
      } catch (err) {
        logError(err, 'database', 'createTravelPlan');
        console.error('여행 계획 생성 실패:', err);
        setError(
          err instanceof Error
            ? err
            : new Error(getKoreanErrorMessage(err, 'create'))
        );
        return null;
      }
    },
    [user, supabase, fetchTravelPlans]
  );

  // 여행 계획 수정
  const updateTravelPlan = useCallback(
    async (id: string, data: Partial<TravelPlan>): Promise<boolean> => {
      if (!user) {
        const authError = { message: 'Not authenticated' };
        logError(authError, 'auth', 'updateTravelPlan');
        throw new Error(getKoreanErrorMessage(authError, 'auth'));
      }

      try {
        const { error: updateError } = await supabase
          .from('travel_plans')
          .update(data)
          .eq('id', id)
          .eq('user_id', user.id);

        if (updateError) {
          logError(updateError, 'database', 'updateTravelPlan');
          throw new Error(getKoreanErrorMessage(updateError, 'update'));
        }

        // 목록 새로고침
        await fetchTravelPlans();
        return true;
      } catch (err) {
        logError(err, 'database', 'updateTravelPlan');
        console.error('여행 계획 수정 실패:', err);
        setError(
          err instanceof Error
            ? err
            : new Error(getKoreanErrorMessage(err, 'update'))
        );
        return false;
      }
    },
    [user, supabase, fetchTravelPlans]
  );

  // 여행 계획 삭제
  const deleteTravelPlan = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        const authError = { message: 'Not authenticated' };
        logError(authError, 'auth', 'deleteTravelPlan');
        throw new Error(getKoreanErrorMessage(authError, 'auth'));
      }

      try {
        const { error: deleteError } = await supabase
          .from('travel_plans')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (deleteError) {
          logError(deleteError, 'database', 'deleteTravelPlan');
          throw new Error(getKoreanErrorMessage(deleteError, 'delete'));
        }

        // 목록 새로고침
        await fetchTravelPlans();
        return true;
      } catch (err) {
        logError(err, 'database', 'deleteTravelPlan');
        console.error('여행 계획 삭제 실패:', err);
        setError(
          err instanceof Error
            ? err
            : new Error(getKoreanErrorMessage(err, 'delete'))
        );
        return false;
      }
    },
    [user, supabase, fetchTravelPlans]
  );

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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'travel_plans',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTravelPlans();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'travel_days',
        },
        () => {
          fetchTravelPlans();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'day_plans',
        },
        () => {
          fetchTravelPlans();
        }
      )
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
