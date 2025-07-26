'use client'

import { useState } from 'react'
import { ArrowLeft, Calendar, MapPin, Plus, Edit, Trash2, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useDayDetail } from '@/lib/hooks/useDayDetail'
import { formatKoreanDate } from '@/lib/utils'
import PlanEditor from './PlanEditor'
import PlanTimeline from './PlanTimeline'

interface DayPlanDetailProps {
  travelId: string
  dayId: string
}

export default function DayPlanDetail({ travelId, dayId }: DayPlanDetailProps) {
  const { data: dayDetail, loading, error } = useDayDetail(dayId)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPlan, setEditingPlan] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')

  if (loading) {
    return <div>일별 계획을 불러오는 중...</div>
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">일별 계획을 불러오는데 실패했습니다.</p>
        <p className="text-gray-500 text-sm break-keep-ko">{error}</p>
      </div>
    )
  }

  if (!dayDetail) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">일별 계획을 찾을 수 없습니다.</p>
      </div>
    )
  }

  // 하루 총 예산
  const totalBudget = dayDetail.day_plans.reduce((total, plan) => 
    total + (plan.budget || 0), 0
  )

  // 예상 총 소요시간 
  const totalDuration = dayDetail.day_plans.reduce((total, plan) => 
    total + (plan.duration_minutes || 0), 0
  )

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link 
          href={`/travels/${travelId}/plans`}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-korean-tight">
              {dayDetail.title || `${dayDetail.day_number}일차`}
            </h1>
            {dayDetail.theme && (
              <Badge variant="outline">
                {dayDetail.theme}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatKoreanDate(dayDetail.date)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'list' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            목록
          </Button>
          <Button 
            variant={viewMode === 'timeline' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            타임라인
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            className="flex items-center gap-2"
            onClick={() => setShowEditor(true)}
          >
            <Plus className="w-4 h-4" />
            계획 추가
          </Button>
        </div>
      </div>

      {/* 일정 요약 카드 */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-travel-city mb-1">
              {dayDetail.day_plans.length}
            </div>
            <div className="text-sm text-gray-600">총 계획</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-travel-adventure mb-1">
              {totalDuration > 0 ? `${Math.round(totalDuration / 60)}h` : '-'}
            </div>
            <div className="text-sm text-gray-600">예상 소요시간</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-travel-food mb-1">
              {totalBudget > 0 ? `${(totalBudget / 10000).toFixed(0)}만원` : '-'}
            </div>
            <div className="text-sm text-gray-600">예상 예산</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-travel-mountain mb-1">
              {dayDetail.day_plans.filter(plan => plan.planned_time).length}
            </div>
            <div className="text-sm text-gray-600">시간 설정됨</div>
          </div>
        </div>
      </Card>

      {/* 계획 목록 또는 타임라인 */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {dayDetail.day_plans.length > 0 ? (
            dayDetail.day_plans.map((plan, index) => (
              <Card key={plan.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* 순서 번호 */}
                    <div className="flex-shrink-0 w-8 h-8 bg-travel-city text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    
                    {/* 계획 내용 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 break-keep-ko">
                          {plan.place_name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {plan.plan_type === 'restaurant' && '🍽️ 식당'}
                          {plan.plan_type === 'sightseeing' && '🏛️ 관광'}
                          {plan.plan_type === 'accommodation' && '🏨 숙박'}
                          {plan.plan_type === 'transportation' && '🚗 교통'}
                          {plan.plan_type === 'shopping' && '🛍️ 쇼핑'}
                          {plan.plan_type === 'entertainment' && '🎯 여가'}
                          {plan.plan_type === 'meeting' && '👥 만남'}
                          {plan.plan_type === 'others' && '📝 기타'}
                        </Badge>
                      </div>
                      
                      {plan.place_address && (
                        <div className="flex items-center gap-1 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{plan.place_address}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {plan.planned_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{plan.planned_time.slice(0, 5)}</span>
                          </div>
                        )}
                        
                        {plan.duration_minutes && (
                          <span>{plan.duration_minutes}분</span>
                        )}
                        
                        {plan.budget && (
                          <span className="text-travel-food font-medium">
                            {plan.budget.toLocaleString()}원
                          </span>
                        )}
                      </div>
                      
                      {plan.notes && (
                        <p className="text-gray-700 text-sm mt-3 break-keep-ko">
                          {plan.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingPlan(plan.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  아직 계획이 없습니다
                </h3>
                <p className="text-gray-600 break-keep-ko">
                  이날의 여행 계획을 추가해보세요!
                </p>
              </div>
              <Button 
                variant="primary" 
                className="flex items-center gap-2"
                onClick={() => setShowEditor(true)}
              >
                <Plus className="w-4 h-4" />
                첫 계획 추가하기
              </Button>
            </div>
          )}
        </div>
      ) : (
        <PlanTimeline 
          plans={dayDetail.day_plans} 
          onEditPlan={setEditingPlan}
        />
      )}

      {/* 계획 편집기 모달 */}
      {showEditor && (
        <PlanEditor
          dayId={dayId}
          planId={editingPlan}
          onClose={() => {
            setShowEditor(false)
            setEditingPlan(null)
          }}
        />
      )}
    </div>
  )
}