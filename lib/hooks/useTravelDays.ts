'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { TravelDay, DayPlan, Database } from '@/lib/types/database'

// 여행 일정과 세부 계획을 포함한 확장 타입
interface TravelDayWithPlans extends TravelDay {
  day_plans: DayPlan[]
}

interface UseTravelDaysReturn {
  data: TravelDayWithPlans[] | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useTravelDays(travelId: string): UseTravelDaysReturn {
  const [data, setData] = useState<TravelDayWithPlans[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient<Database>()

  const fetchTravelDays = async () => {
    try {
      setLoading(true)
      setError(null)

      // 여행 일정과 세부 계획을 함께 조회
      const { data: travelDays, error: fetchError } = await supabase
        .from('travel_days')
        .select(`
          *,
          day_plans (
            *
          )
        `)
        .eq('travel_plan_id', travelId)
        .order('day_number', { ascending: true })

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      // day_plans도 order_index로 정렬
      const sortedDays = travelDays?.map(day => ({
        ...day,
        day_plans: day.day_plans?.sort((a, b) => a.order_index - b.order_index) || []
      })) || []

      setData(sortedDays as TravelDayWithPlans[])
    } catch (err) {
      console.error('여행 일정 조회 에러:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 실시간 구독 설정
  useEffect(() => {
    fetchTravelDays()

    // travel_days 테이블 변경 구독
    const daysSubscription = supabase
      .channel(`travel_days_${travelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'travel_days',
          filter: `travel_plan_id=eq.${travelId}`
        },
        (payload) => {
          console.log('여행 일정 실시간 업데이트:', payload)
          fetchTravelDays() // 간단한 구현: 전체 다시 로드
        }
      )
      .subscribe()

    // day_plans 테이블 변경 구독
    const plansSubscription = supabase
      .channel(`day_plans_travel_${travelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'day_plans'
        },
        (payload) => {
          console.log('일별 계획 실시간 업데이트:', payload)
          fetchTravelDays() // 간단한 구현: 전체 다시 로드
        }
      )
      .subscribe()

    return () => {
      daysSubscription.unsubscribe()
      plansSubscription.unsubscribe()
    }
  }, [travelId]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    refetch: fetchTravelDays
  }
}