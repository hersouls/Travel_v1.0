'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import TravelMap from '@/components/features/map/TravelMap';
import TravelMapSkeleton from '@/components/features/map/TravelMapSkeleton';

export default function MapPageClient() {
  const searchParams = useSearchParams();
  const travelId = searchParams.get('travelId') || undefined;
  const dayId = searchParams.get('dayId') || undefined;

  return (
    <div className="flex h-screen flex-col">
      {/* 헤더 */}
      <div className="flex flex-shrink-0 items-center gap-4 border-b border-gray-200 bg-white p-4">
        <Link
          href={travelId ? `/travels/${travelId}` : '/travels'}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900 tracking-korean-tight">
            <MapPin className="text-travel-city h-6 w-6" />
            여행 지도
          </h1>
          <p className="text-sm text-gray-600 break-keep-ko">
            {travelId
              ? dayId
                ? '선택한 날짜의 계획을 지도에서 확인하세요'
                : '전체 여행 계획을 지도에서 확인하세요'
              : '모든 여행 계획을 지도에서 확인하세요'}
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
      <div className="relative flex-1">
        <Suspense fallback={<TravelMapSkeleton />}>
          <TravelMap />
        </Suspense>
      </div>
    </div>
  );
}
