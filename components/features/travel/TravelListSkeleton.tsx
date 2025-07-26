import React from 'react';
import { cn } from '@/lib/utils';

export interface TravelListSkeletonProps {
  count?: number;
  className?: string;
}

const TravelCardSkeleton = () => (
  <div className="@container/skeleton-card bg-white rounded-xl border border-gray-200 shadow-soft p-4 @md/skeleton-card:p-6 animate-pulse">
    {/* 헤더 영역 */}
    <div className="flex @lg/skeleton-card:flex-row flex-col @lg/skeleton-card:items-start @lg/skeleton-card:justify-between mb-4">
      <div className="flex-1 min-w-0 @lg/skeleton-card:mb-0 mb-3">
        {/* 제목 */}
        <div className="h-6 @md/skeleton-card:h-7 bg-gray-200 rounded-lg w-3/4 mb-3" />
        
        {/* 목적지 */}
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
        
        {/* 설명 (큰 화면에서만 표시) */}
        <div className="@lg/skeleton-card:block hidden space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
      
      {/* 상태 배지 */}
      <div className="@lg/skeleton-card:ml-4 flex-shrink-0">
        <div className="h-6 bg-gray-200 rounded-full w-16" />
      </div>
    </div>

    {/* 날짜 정보 */}
    <div className="@container/skeleton-dates flex @md/skeleton-dates:flex-row flex-col @md/skeleton-dates:items-center @md/skeleton-dates:gap-6 gap-3 mb-4">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-gray-200 rounded mr-2" />
        <div className="h-4 bg-gray-200 rounded w-40" />
      </div>
      
      <div className="flex items-center">
        <div className="w-4 h-4 bg-gray-200 rounded mr-2" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    </div>

    {/* 통계 정보 */}
    <div className="@container/skeleton-stats flex @md/skeleton-stats:flex-row flex-col @md/skeleton-stats:items-center @md/skeleton-stats:justify-between gap-3">
      <div className="flex @sm/skeleton-stats:flex-row flex-col @sm/skeleton-stats:gap-4 gap-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2" />
          <div className="h-4 bg-gray-200 rounded w-14" />
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
      </div>
      
      {/* 공개 상태 배지 */}
      <div className="@md/skeleton-stats:ml-4 flex-shrink-0">
        <div className="h-5 bg-gray-200 rounded w-10" />
      </div>
    </div>

    {/* 호버 액션 (큰 화면에서만) */}
    <div className="@lg/skeleton-card:block hidden mt-4 pt-4 border-t border-gray-100">
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded flex-1" />
        <div className="h-8 bg-gray-200 rounded flex-1" />
      </div>
    </div>
  </div>
);

export const TravelListSkeleton = React.forwardRef<HTMLDivElement, TravelListSkeletonProps>(
  ({ count = 6, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          '@container/skeleton-list',
          className
        )}
        {...props}
      >
        {/* 그리드 레이아웃 - Container Queries 적용 */}
        <div className="grid @6xl/skeleton-list:grid-cols-3 @3xl/skeleton-list:grid-cols-2 grid-cols-1 gap-6">
          {Array.from({ length: count }).map((_, index) => (
            <TravelCardSkeleton key={index} />
          ))}
        </div>

        {/* 추가 로딩 인디케이터 */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-moonwave-primary rounded-full animate-spin" />
            <span className={cn(
              'font-pretendard text-sm',
              'tracking-korean-normal break-keep-ko'
            )}>
              여행 계획을 불러오는 중...
            </span>
          </div>
        </div>
      </div>
    );
  }
);

TravelListSkeleton.displayName = 'TravelListSkeleton';

// 개별 통계 카드 스켈레톤
export const StatsCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-200 animate-pulse">
    <div className="flex items-center">
      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
      <div className="ml-4 flex-1">
        <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
        <div className="h-8 bg-gray-200 rounded w-12" />
      </div>
    </div>
  </div>
);

// 전체 통계 섹션 스켈레톤
export const StatsListSkeleton = () => (
  <div className="@container/stats-skeleton">
    <div className="grid @2xl/stats-skeleton:grid-cols-4 @lg/stats-skeleton:grid-cols-3 @md/stats-skeleton:grid-cols-2 grid-cols-1 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatsCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

// 컴팩트 카드 스켈레톤 (작은 화면용)
export const CompactTravelCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-5 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded-full w-12" />
    </div>
    
    <div className="flex items-center mb-2">
      <div className="w-3 h-3 bg-gray-200 rounded mr-2" />
      <div className="h-3 bg-gray-200 rounded w-24" />
    </div>
    
    <div className="flex items-center justify-between">
      <div className="h-3 bg-gray-200 rounded w-20" />
      <div className="h-3 bg-gray-200 rounded w-16" />
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
  count = 6 
}: { 
  variant?: 'grid' | 'list' | 'compact';
  count?: number;
}) => {
  switch (variant) {
    case 'list':
      return <MobileTravelListSkeleton count={count} />;
    case 'compact':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: count }).map((_, index) => (
            <CompactTravelCardSkeleton key={index} />
          ))}
        </div>
      );
    default:
      return <TravelListSkeleton count={count} />;
  }
};