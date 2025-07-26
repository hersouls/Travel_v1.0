'use client';

import { MapPin, Navigation } from 'lucide-react';

export default function TravelMapSkeleton() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-100">
      {/* 지도 영역 스켈레톤 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
        {/* 도로 패턴 시뮬레이션 */}
        <div className="absolute inset-0">
          <div className="absolute left-0 right-0 top-1/4 h-1 bg-gray-300 opacity-40" />
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-300 opacity-40" />
          <div className="absolute left-0 right-0 top-3/4 h-1 bg-gray-300 opacity-40" />
          <div className="absolute bottom-0 left-1/4 top-0 w-1 bg-gray-300 opacity-40" />
          <div className="absolute bottom-0 left-1/2 top-0 w-1 bg-gray-300 opacity-40" />
          <div className="absolute bottom-0 left-3/4 top-0 w-1 bg-gray-300 opacity-40" />
        </div>

        {/* 마커 스켈레톤들 */}
        <div className="bg-travel-food absolute left-1/4 top-1/3 flex h-8 w-8 animate-pulse items-center justify-center rounded-full opacity-60">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        <div className="bg-travel-mountain absolute left-2/3 top-1/2 flex h-8 w-8 animate-pulse items-center justify-center rounded-full opacity-60">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        <div className="bg-travel-beach absolute left-1/3 top-2/3 flex h-8 w-8 animate-pulse items-center justify-center rounded-full opacity-60">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        <div className="bg-travel-city absolute right-1/4 top-1/4 flex h-8 w-8 animate-pulse items-center justify-center rounded-full opacity-60">
          <MapPin className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* 컨트롤 패널 스켈레톤 */}
      <div className="absolute right-4 top-4 space-y-2 rounded-lg bg-white p-3 shadow-lg">
        <div className="flex h-8 w-8 animate-pulse items-center justify-center rounded bg-gray-200">
          <div className="h-4 w-4 rounded bg-gray-300" />
        </div>
        <div className="flex h-8 w-8 animate-pulse items-center justify-center rounded bg-gray-200">
          <div className="h-4 w-4 rounded bg-gray-300" />
        </div>
        <div className="flex h-8 w-8 animate-pulse items-center justify-center rounded bg-gray-200">
          <Navigation className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* 하단 정보 패널 스켈레톤 */}
      <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-white p-4 shadow-lg">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="mb-1 h-4 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-6 w-12 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>

      {/* 로딩 오버레이 */}
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
        <div className="rounded-lg bg-white p-6 text-center shadow-lg">
          <div className="bg-travel-city mx-auto mb-3 flex h-12 w-12 animate-pulse items-center justify-center rounded-full">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">
            지도를 불러오는 중...
          </h3>
          <p className="text-sm text-gray-600 break-keep-ko">
            Google Maps API를 초기화하고 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
