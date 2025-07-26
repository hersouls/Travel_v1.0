'use client'

import { MapPin, Navigation } from 'lucide-react'

export default function TravelMapSkeleton() {
  return (
    <div className="w-full h-full bg-gray-100 relative overflow-hidden">
      {/* 지도 영역 스켈레톤 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
        {/* 도로 패턴 시뮬레이션 */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-300 opacity-40" />
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 opacity-40" />
          <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-300 opacity-40" />
          <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-gray-300 opacity-40" />
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-300 opacity-40" />
          <div className="absolute top-0 bottom-0 left-3/4 w-1 bg-gray-300 opacity-40" />
        </div>
        
        {/* 마커 스켈레톤들 */}
        <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-travel-food rounded-full opacity-60 animate-pulse flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div className="absolute top-1/2 left-2/3 w-8 h-8 bg-travel-mountain rounded-full opacity-60 animate-pulse flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div className="absolute top-2/3 left-1/3 w-8 h-8 bg-travel-beach rounded-full opacity-60 animate-pulse flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-travel-city rounded-full opacity-60 animate-pulse flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* 컨트롤 패널 스켈레톤 */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-300 rounded" />
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-300 rounded" />
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse flex items-center justify-center">
          <Navigation className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* 하단 정보 패널 스켈레톤 */}
      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-12" />
        </div>
      </div>

      {/* 로딩 오버레이 */}
      <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-travel-city rounded-full mx-auto mb-3 animate-pulse flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            지도를 불러오는 중...
          </h3>
          <p className="text-gray-600 text-sm break-keep-ko">
            Google Maps API를 초기화하고 있습니다
          </p>
        </div>
      </div>
    </div>
  )
}