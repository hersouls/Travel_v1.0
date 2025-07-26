'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TravelPlan, CreateTravelPlanForm } from '@/lib/types/database';

interface UseCreateTravelReturn {
  createTravel: (data: CreateTravelPlanForm) => Promise<TravelPlan>;
  loading: boolean;
  error: string | null;
}

export function useCreateTravel(): UseCreateTravelReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const createTravel = async (
    data: CreateTravelPlanForm
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

      // 여행 계획 데이터 준비
      const travelData = {
        user_id: user.id,
        title: data.title.trim(),
        destination: data.destination.trim(),
        start_date: data.start_date,
        end_date: data.end_date,
        description: data.description?.trim() || null,
        cover_image_url: data.cover_image_url?.trim() || null,
        is_public: data.is_public || false,
        status: 'planning' as const,
        collaborators: [],
        metadata: {},
      };

      // Supabase에 여행 계획 생성
      const { data: travel, error: insertError } = await supabase
        .from('travel_plans')
        .insert([travelData])
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      if (!travel) {
        throw new Error('여행 계획 생성에 실패했습니다.');
      }

      // 여행 기간에 따른 travel_days 자동 생성
      await createTravelDays(travel);

      return travel;
    } catch (err) {
      console.error('여행 생성 에러:', err);
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createTravelDays = async (travel: TravelPlan) => {
    try {
      const startDate = new Date(travel.start_date);
      const endDate = new Date(travel.end_date);
      const travelDays = [];

      const currentDate = new Date(startDate);
      let dayNumber = 1;

      while (currentDate <= endDate) {
        travelDays.push({
          travel_plan_id: travel.id,
          day_number: dayNumber,
          date: currentDate.toISOString().split('T')[0],
          title: `${dayNumber}일차`,
          theme: null,
        });

        currentDate.setDate(currentDate.getDate() + 1);
        dayNumber++;
      }

      const { error: daysError } = await supabase
        .from('travel_days')
        .insert(travelDays);

      if (daysError) {
        console.error('여행 일정 생성 에러:', daysError);
        // 메인 여행 계획은 이미 생성되었으므로 에러를 throw하지 않음
      }
    } catch (err) {
      console.error('여행 일정 자동 생성 실패:', err);
      // 메인 여행 계획은 이미 생성되었으므로 에러를 throw하지 않음
    }
  };

  return {
    createTravel,
    loading,
    error,
  };
}
