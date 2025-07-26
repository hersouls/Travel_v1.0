'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/types/database'

interface UseDeleteTravelReturn {
  deleteTravel: (travelId: string) => Promise<void>
  loading: boolean
  error: string | null
}

export function useDeleteTravel(): UseDeleteTravelReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient<Database>()

  const deleteTravel = async (travelId: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // 현재 사용자 확인
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('로그인이 필요합니다.')
      }

      // 여행 계획 소유권 확인
      const { data: existingTravel, error: fetchError } = await supabase
        .from('travel_plans')
        .select('user_id')
        .eq('id', travelId)
        .single()

      if (fetchError) {
        throw new Error('여행 계획을 찾을 수 없습니다.')
      }

      if (existingTravel.user_id !== user.id) {
        throw new Error('이 여행 계획을 삭제할 권한이 없습니다.')
      }

      // 관련 데이터 삭제 (Cascade 관계로 자동 삭제되지만 명시적으로 처리)
      // 1. travel_days의 ID들을 먼저 가져오기
      const { data: travelDays } = await supabase
        .from('travel_days')
        .select('id')
        .eq('travel_plan_id', travelId)

      const travelDayIds = travelDays?.map(day => day.id) || []

      // 2. day_plans 삭제
      const { error: dayPlansDeleteError } = travelDayIds.length > 0 ? 
        await supabase
          .from('day_plans')
          .delete()
          .in('travel_day_id', travelDayIds) :
        { error: null }

      // 3. travel_days 삭제
      const { error: travelDaysDeleteError } = await supabase
        .from('travel_days')
        .delete()
        .eq('travel_plan_id', travelId)

      // 4. payment_history 삭제
      const { error: paymentDeleteError } = await supabase
        .from('payment_history')
        .delete()
        .eq('travel_plan_id', travelId)

      // 5. collaborators 삭제
      const { error: collaboratorsDeleteError } = await supabase
        .from('collaborators')
        .delete()
        .eq('travel_plan_id', travelId)

      // 6. 마지막으로 travel_plans 삭제
      const { error: travelDeleteError } = await supabase
        .from('travel_plans')
        .delete()
        .eq('id', travelId)

      if (travelDeleteError) {
        throw new Error(travelDeleteError.message)
      }

      // 에러가 있어도 로그만 출력 (메인 삭제는 성공했으므로)
      if (dayPlansDeleteError) console.warn('일별 계획 삭제 경고:', dayPlansDeleteError)
      if (travelDaysDeleteError) console.warn('여행 일정 삭제 경고:', travelDaysDeleteError)
      if (paymentDeleteError) console.warn('결제 이력 삭제 경고:', paymentDeleteError)
      if (collaboratorsDeleteError) console.warn('협업자 삭제 경고:', collaboratorsDeleteError)

    } catch (err) {
      console.error('여행 삭제 에러:', err)
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    deleteTravel,
    loading,
    error
  }
}