'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TravelPlan, UpdateTravelPlan } from '@/lib/types/database';

interface UseUpdateTravelReturn {
  updateTravel: (
    travelId: string,
    data: Partial<UpdateTravelPlan>
  ) => Promise<TravelPlan>;
  loading: boolean;
  error: string | null;
}

export function useUpdateTravel(): UseUpdateTravelReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const updateTravel = async (
    travelId: string,
    data: Partial<UpdateTravelPlan>
  ): Promise<TravelPlan> => {
    try {
      setLoading(true);
      setError(null);

      // 현재 사용자 확인
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('로그인이 필요합니다.');
      }

      // 여행 계획 소유권 확인
      const { data: existingTravel, error: fetchError } = await supabase
        .from('travel_plans')
        .select('user_id')
        .eq('id', travelId)
        .single();

      if (fetchError) {
        throw new Error('여행 계획을 찾을 수 없습니다.');
      }

      if (existingTravel.user_id !== user.id) {
        throw new Error('이 여행 계획을 수정할 권한이 없습니다.');
      }

      // 업데이트 데이터 준비
      const updateData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      // Supabase에서 여행 계획 업데이트
      const { data: travel, error: updateError } = await supabase
        .from('travel_plans')
        .update(updateData)
        .eq('id', travelId)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      if (!travel) {
        throw new Error('여행 계획 업데이트에 실패했습니다.');
      }

      return travel;
    } catch (err) {
      console.error('여행 업데이트 에러:', err);
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateTravel,
    loading,
    error,
  };
}
