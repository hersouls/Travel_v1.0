'use client'

import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { TravelPlan } from '@/lib/types/database'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatKoreanDate, calculateTravelDuration } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

interface TravelCardProps {
  travel: TravelPlan
}

export default function TravelCard({ travel }: TravelCardProps) {
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
    <Link href={`/travels/${travel.id}`} className="block">
      <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden h-full">
        {/* 커버 이미지 */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          {travel.cover_image_url ? (
            <Image
              src={travel.cover_image_url}
              alt={travel.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-travel-beach to-travel-mountain flex items-center justify-center">
              <MapPin className="w-12 h-12 text-white/80" />
            </div>
          )}
          
          {/* 상태 뱃지 */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant="secondary" 
              className={`${statusColors[travel.status]} text-white border-none`}
            >
              {statusLabels[travel.status]}
            </Badge>
          </div>

          {/* 공개/비공개 표시 */}
          {travel.is_public && (
            <div className="absolute top-3 left-3">
              <Badge variant="outline" className="bg-white/90 text-gray-700">
                공개
              </Badge>
            </div>
          )}
        </div>

        {/* 카드 내용 */}
        <div className="p-6">
          <div className="space-y-3">
            {/* 제목과 목적지 */}
            <div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors break-keep-ko">
                {travel.title}
              </h3>
              <div className="flex items-center gap-1 text-gray-600 mt-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{travel.destination}</span>
              </div>
            </div>

            {/* 날짜 정보 */}
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {formatKoreanDate(travel.start_date)} - {formatKoreanDate(travel.end_date)}
              </span>
            </div>

            {/* 기간 */}
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{duration}일</span>
            </div>

            {/* 협업자 수 (있는 경우) */}
            {travel.collaborators && travel.collaborators.length > 0 && (
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">
                  {travel.collaborators.length}명과 함께
                </span>
              </div>
            )}

            {/* 설명 (있는 경우) */}
            {travel.description && (
              <p className="text-sm text-gray-600 line-clamp-2 break-keep-ko">
                {travel.description}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}