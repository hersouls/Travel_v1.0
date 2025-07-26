'use client'

import { ChevronDown, ChevronUp, Plus, Calendar, MapPin } from 'lucide-react'
import { TravelDay, DayPlan } from '@/lib/types/database'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatKoreanDate } from '@/lib/utils'
import DayPlanCard from './DayPlanCard'
import Link from 'next/link'

interface TravelDayWithPlans extends TravelDay {
  day_plans: DayPlan[]
}

interface DayPlanAccordionProps {
  day: TravelDayWithPlans
  isExpanded: boolean
  onToggle: () => void
  travelId: string
}

export default function DayPlanAccordion({ 
  day, 
  isExpanded, 
  onToggle, 
  travelId 
}: DayPlanAccordionProps) {
  
  // 계획 유형별 카운트
  const planCounts = day.day_plans.reduce((counts, plan) => {
    counts[plan.plan_type] = (counts[plan.plan_type] || 0) + 1
    return counts
  }, {} as Record<string, number>)

  // 하루 총 예산
  const totalBudget = day.day_plans.reduce((total, plan) => 
    total + (plan.budget || 0), 0
  )

  return (
    <Card className="overflow-hidden">
      {/* 아코디언 헤더 */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* 날짜 정보 */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-travel-city to-travel-mountain rounded-lg flex flex-col items-center justify-center text-white">
                <div className="text-xs font-medium">
                  {new Date(day.date).toLocaleDateString('ko-KR', { month: 'short' })}
                </div>
                <div className="text-lg font-bold">
                  {new Date(day.date).getDate()}
                </div>
              </div>
            </div>

            {/* 일정 정보 */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {day.title || `${day.day_number}일차`}
                </h3>
                {day.theme && (
                  <Badge variant="outline" className="text-xs">
                    {day.theme}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span>{formatKoreanDate(day.date)}</span>
              </div>

              {/* 계획 요약 */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900">
                    {day.day_plans.length}개 계획
                  </span>
                </div>
                
                {totalBudget > 0 && (
                  <div className="text-gray-600">
                    예산: {totalBudget.toLocaleString()}원
                  </div>
                )}

                {/* 계획 유형 뱃지들 */}
                <div className="flex gap-1">
                  {Object.entries(planCounts).slice(0, 3).map(([type, count]) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type === 'restaurant' && '🍽️'}
                      {type === 'sightseeing' && '🏛️'}
                      {type === 'accommodation' && '🏨'}
                      {type === 'transportation' && '🚗'}
                      {type === 'shopping' && '🛍️'}
                      {type === 'entertainment' && '🎯'}
                      {type === 'meeting' && '👥'}
                      {type === 'others' && '📝'}
                      {count > 1 && ` ${count}`}
                    </Badge>
                  ))}
                  {Object.keys(planCounts).length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{Object.keys(planCounts).length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 토글 버튼 */}
          <div className="flex items-center gap-2">
            <Link href={`/travels/${travelId}/plans/${day.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                상세
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="p-2"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 아코디언 내용 */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 pt-4">
          {day.day_plans.length > 0 ? (
            <div className="space-y-3">
              {day.day_plans.map((plan) => (
                <DayPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-3">아직 계획이 없습니다.</p>
              <Button variant="default" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                계획 추가하기
              </Button>
            </div>
          )}
          
          {/* 추가 액션 버튼 */}
          {day.day_plans.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                계획 추가
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}