'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import TravelMap from '@/components/features/map/TravelMap'
import TravelMapSkeleton from '@/components/features/map/TravelMapSkeleton'

export default function MapPageClient() {
  const searchParams = useSearchParams()
  const travelId = searchParams.get('travelId') || undefined
  const dayId = searchParams.get('dayId') || undefined

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-200 flex-shrink-0">
        <Link 
          href={travelId ? `/travels/${travelId}` : '/travels'}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 tracking-korean-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-travel-city" />
            여행 지도
          </h1>
          <p className="text-gray-600 text-sm break-keep-ko">
            {travelId 
              ? dayId 
                ? '선택한 날짜의 계획을 지도에서 확인하세요'
                : '전체 여행 계획을 지도에서 확인하세요'
              : '모든 여행 계획을 지도에서 확인하세요'
            }
          </p>
        </div>
        
        {/* 뷰 옵션 버튼들 */}
        <div className="flex items-center gap-2">
          {travelId && (
            <Link href={`/travels/${travelId}/plans`}>
              <Button variant="outline" size="sm">
                일정 보기
              </Button>
            </Link>
          )}
          <Button variant="outline" size="sm">
            필터
          </Button>
        </div>
      </div>

      {/* 지도 컨테이너 */}
      <div className="flex-1 relative">
        <Suspense fallback={<TravelMapSkeleton />}>
          <TravelMap 
            travelId={travelId} 
            dayId={dayId}
          />
        </Suspense>
      </div>
    </div>
  )
}