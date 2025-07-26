'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { TravelDay, DayPlan, Database } from '@/lib/types/database'

// 여행 일정과 세부 계획을 포함한 확장 타입
interface DayDetailWithPlans extends TravelDay {
  day_plans: DayPlan[]
}

interface UseDayDetailReturn {
  data: DayDetailWithPlans | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDayDetail(dayId: string): UseDayDetailReturn {
  const [data, setData] = useState<DayDetailWithPlans | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient<Database>()

  const fetchDayDetail = async () => {
    try {
      setLoading(true)
      setError(null)

      // 특정 여행 일정과 세부 계획을 함께 조회
      const { data: dayDetail, error: fetchError } = await supabase
        .from('travel_days')
        .select(`
          *,
          day_plans (
            *
          )
        `)
        .eq('id', dayId)
        .single()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      if (!dayDetail) {
        throw new Error('일별 계획을 찾을 수 없습니다.')
      }

      // day_plans를 order_index와 planned_time으로 정렬
      const sortedPlans = dayDetail.day_plans?.sort((a, b) => {
        // 먼저 order_index로 정렬
        if (a.order_index !== b.order_index) {
          return a.order_index - b.order_index
        }
        
        // order_index가 같으면 planned_time으로 정렬
        if (a.planned_time && b.planned_time) {
          return a.planned_time.localeCompare(b.planned_time)
        }
        
        // planned_time이 있는 것을 우선
        if (a.planned_time && !b.planned_time) return -1
        if (!a.planned_time && b.planned_time) return 1
        
        return 0
      }) || []

      setData({
        ...dayDetail,
        day_plans: sortedPlans
      } as DayDetailWithPlans)
    } catch (err) {
      console.error('일별 계획 조회 에러:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 실시간 구독 설정
  useEffect(() => {
    fetchDayDetail()

    // travel_days 테이블 변경 구독
    const daySubscription = supabase
      .channel(`travel_day_${dayId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'travel_days',
          filter: `id=eq.${dayId}`
        },
        (payload) => {
          console.log('일별 정보 실시간 업데이트:', payload)
          const updatedDay = payload.new
          setData(prevData => 
            prevData ? { ...prevData, ...updatedDay } : null
          )
        }
      )
      .subscribe()

    // day_plans 테이블 변경 구독 (해당 day에 속한 계획들만)
    const plansSubscription = supabase
      .channel(`day_plans_${dayId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'day_plans',
          filter: `travel_day_id=eq.${dayId}`
        },
        (payload) => {
          console.log('일별 계획 실시간 업데이트:', payload)
          fetchDayDetail() // 간단한 구현: 전체 다시 로드
        }
      )
      .subscribe()

    return () => {
      daySubscription.unsubscribe()
      plansSubscription.unsubscribe()
    }
  }, [dayId]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    refetch: fetchDayDetail
  }
}