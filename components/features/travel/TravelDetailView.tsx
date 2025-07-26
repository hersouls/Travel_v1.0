'use client'

import { useState } from 'react'
import { ArrowLeft, Edit, Share2, Calendar, MapPin, Users, Clock, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { useTravelDetail } from '@/lib/hooks/useTravelDetail'
import { formatKoreanDate, calculateTravelDuration } from '@/lib/utils'
import DayPlanCard from '../day-plan/DayPlanCard'

interface TravelDetailViewProps {
  travelId: string
}

export default function TravelDetailView({ travelId }: TravelDetailViewProps) {
  const { data: travel, loading, error } = useTravelDetail(travelId)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  if (loading) {
    return <div>여행 정보를 불러오는 중...</div>
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">여행 정보를 불러오는데 실패했습니다.</p>
        <p className="text-gray-500 text-sm break-keep-ko">{error}</p>
      </div>
    )
  }

  if (!travel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">여행 정보를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const duration = calculateTravelDuration(travel.start_date, travel.end_date)
  
  // 상태별 색상 매핑
  const statusColors = {
    planning: 'bg-travel-city',
    ongoing: 'bg-travel-adventure', 
    completed: 'bg-travel-mountain',
    cancelled: 'bg-gray-400'
  }

  const statusLabels = {
    planning: '계획중',
    ongoing: '진행중',
    completed: '완료됨',
    cancelled: '취소됨'
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/travels"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-korean-tight">
              {travel.title}
            </h1>
            <Badge 
              variant="secondary" 
              className={`${statusColors[travel.status]} text-white border-none`}
            >
              {statusLabels[travel.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{travel.destination}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            공유
          </Button>
          <Link href={`/travels/${travelId}/edit`}>
            <Button variant="primary" size="md" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              수정
            </Button>
          </Link>
        </div>
      </div>

      {/* 커버 이미지 */}
      {travel.cover_image_url && (
        <div className="relative aspect-[16/6] bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={travel.cover_image_url}
            alt={travel.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* 여행 정보 카드 */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">여행 기간</p>
              <p className="font-semibold">
                {formatKoreanDate(travel.start_date)} - {formatKoreanDate(travel.end_date)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">총 기간</p>
              <p className="font-semibold">{duration}일</p>
            </div>
          </div>

          {travel.collaborators && travel.collaborators.length > 0 && (
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">함께 가는 사람</p>
                <p className="font-semibold">{travel.collaborators.length}명</p>
              </div>
            </div>
          )}
        </div>

        {travel.description && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">여행 설명</h3>
            <p className="text-gray-700 break-keep-ko">{travel.description}</p>
          </div>
        )}
      </Card>

      {/* 일정별 계획 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">일정별 계획</h2>
          <Button 
            variant="outline" 
            size="md" 
            className="flex items-center gap-2"
            onClick={() => {/* 새 계획 추가 모달 열기 */}}
          >
            <Plus className="w-4 h-4" />
            계획 추가
          </Button>
        </div>

        {travel.travel_days && travel.travel_days.length > 0 ? (
          <div className="space-y-4">
            {travel.travel_days.map((day) => (
              <Card key={day.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {day.title || `${day.day_number}일차`}
                    </h3>
                    <p className="text-gray-600">{formatKoreanDate(day.date)}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDay(selectedDay === day.day_number ? null : day.day_number)}
                  >
                    {selectedDay === day.day_number ? '접기' : '펼치기'}
                  </Button>
                </div>

                {selectedDay === day.day_number && (
                  <div className="space-y-3">
                    {day.day_plans && day.day_plans.length > 0 ? (
                      day.day_plans.map((plan) => (
                        <DayPlanCard key={plan.id} plan={plan} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>아직 계획이 없습니다.</p>
                        <Button variant="primary" size="sm" className="mt-2">
                          첫 계획 추가하기
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">일정이 아직 생성되지 않았습니다.</p>
            <Button variant="primary">일정 생성하기</Button>
          </div>
        )}
      </div>
    </div>
  )
}