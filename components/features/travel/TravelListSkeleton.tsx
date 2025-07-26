import React from 'react';
import { cn } from '@/lib/utils';

export interface TravelListSkeletonProps {
  count?: number;
  className?: string;
}

const TravelCardSkeleton = () => (
  <div className="shadow-soft animate-pulse rounded-xl border border-gray-200 bg-white p-4 @container/skeleton-card @md/skeleton-card:p-6">
    {/* 헤더 영역 */}
    <div className="mb-4 flex flex-col @lg/skeleton-card:flex-row @lg/skeleton-card:items-start @lg/skeleton-card:justify-between">
      <div className="mb-3 min-w-0 flex-1 @lg/skeleton-card:mb-0">
        {/* 제목 */}
        <div className="mb-3 h-6 w-3/4 rounded-lg bg-gray-200 @md/skeleton-card:h-7" />

        {/* 목적지 */}
        <div className="mb-2 flex items-center">
          <div className="mr-2 h-4 w-4 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
        </div>

        {/* 설명 (큰 화면에서만 표시) */}
        <div className="hidden space-y-2 @lg/skeleton-card:block">
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-2/3 rounded bg-gray-200" />
        </div>
      </div>

      {/* 상태 배지 */}
      <div className="flex-shrink-0 @lg/skeleton-card:ml-4">
        <div className="h-6 w-16 rounded-full bg-gray-200" />
      </div>
    </div>

    {/* 날짜 정보 */}
    <div className="mb-4 flex flex-col gap-3 @container/skeleton-dates @md/skeleton-dates:flex-row @md/skeleton-dates:items-center @md/skeleton-dates:gap-6">
      <div className="flex items-center">
        <div className="mr-2 h-4 w-4 rounded bg-gray-200" />
        <div className="h-4 w-40 rounded bg-gray-200" />
      </div>

      <div className="flex items-center">
        <div className="mr-2 h-4 w-4 rounded bg-gray-200" />
        <div className="h-4 w-16 rounded bg-gray-200" />
      </div>
    </div>

    {/* 통계 정보 */}
    <div className="flex flex-col gap-3 @container/skeleton-stats @md/skeleton-stats:flex-row @md/skeleton-stats:items-center @md/skeleton-stats:justify-between">
      <div className="flex flex-col gap-2 @sm/skeleton-stats:flex-row @sm/skeleton-stats:gap-4">
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 rounded bg-gray-200" />
          <div className="h-4 w-12 rounded bg-gray-200" />
        </div>

        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 rounded bg-gray-200" />
          <div className="h-4 w-14 rounded bg-gray-200" />
        </div>

        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 rounded bg-gray-200" />
          <div className="h-4 w-12 rounded bg-gray-200" />
        </div>
      </div>

      {/* 공개 상태 배지 */}
      <div className="flex-shrink-0 @md/skeleton-stats:ml-4">
        <div className="h-5 w-10 rounded bg-gray-200" />
      </div>
    </div>

    {/* 호버 액션 (큰 화면에서만) */}
    <div className="mt-4 hidden border-t border-gray-100 pt-4 @lg/skeleton-card:block">
      <div className="flex gap-2">
        <div className="h-8 flex-1 rounded bg-gray-200" />
        <div className="h-8 flex-1 rounded bg-gray-200" />
      </div>
    </div>
  </div>
);

export const TravelListSkeleton = React.forwardRef<
  HTMLDivElement,
  TravelListSkeletonProps
>(({ count = 6, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('@container/skeleton-list', className)}
      {...props}
    >
      {/* 그리드 레이아웃 - Container Queries 적용 */}
      <div className="grid grid-cols-1 gap-6 @3xl/skeleton-list:grid-cols-2 @6xl/skeleton-list:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <TravelCardSkeleton key={index} />
        ))}
      </div>

      {/* 추가 로딩 인디케이터 */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-moonwave-primary" />
          <span
            className={cn(
              'font-pretendard text-sm',
              'tracking-korean-normal break-keep-ko'
            )}
          >
            여행 계획을 불러오는 중...
          </span>
        </div>
      </div>
    </div>
  );
});

TravelListSkeleton.displayName = 'TravelListSkeleton';

// 개별 통계 카드 스켈레톤
export const StatsCardSkeleton = () => (
  <div className="shadow-soft animate-pulse rounded-xl border border-gray-200 bg-white p-6">
    <div className="flex items-center">
      <div className="h-12 w-12 rounded-lg bg-gray-200" />
      <div className="ml-4 flex-1">
        <div className="mb-2 h-4 w-16 rounded bg-gray-200" />
        <div className="h-8 w-12 rounded bg-gray-200" />
      </div>
    </div>
  </div>
);

// 전체 통계 섹션 스켈레톤
export const StatsListSkeleton = () => (
  <div className="@container/stats-skeleton">
    <div className="mb-8 grid grid-cols-1 gap-6 @md/stats-skeleton:grid-cols-2 @lg/stats-skeleton:grid-cols-3 @2xl/stats-skeleton:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatsCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

// 컴팩트 카드 스켈레톤 (작은 화면용)
export const CompactTravelCardSkeleton = () => (
  <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-4">
    <div className="mb-3 flex items-center justify-between">
      <div className="h-5 w-2/3 rounded bg-gray-200" />
      <div className="h-4 w-12 rounded-full bg-gray-200" />
    </div>

    <div className="mb-2 flex items-center">
      <div className="mr-2 h-3 w-3 rounded bg-gray-200" />
      <div className="h-3 w-24 rounded bg-gray-200" />
    </div>

    <div className="flex items-center justify-between">
      <div className="h-3 w-20 rounded bg-gray-200" />
      <div className="h-3 w-16 rounded bg-gray-200" />
    </div>
  </div>
);

// 리스트 뷰 스켈레톤 (모바일 최적화)
export const MobileTravelListSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, index) => (
      <CompactTravelCardSkeleton key={index} />
    ))}
  </div>
);

// 다양한 스켈레톤 레이아웃을 위한 컴포넌트
export const ResponsiveTravelSkeleton = ({
  variant = 'grid',
  count = 6,
}: {
  variant?: 'grid' | 'list' | 'compact';
  count?: number;
}) => {
  switch (variant) {
    case 'list':
      return <MobileTravelListSkeleton count={count} />;
    case 'compact':
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: count }).map((_, index) => (
            <CompactTravelCardSkeleton key={index} />
          ))}
        </div>
      );
    default:
      return <TravelListSkeleton count={count} />;
  }
};
