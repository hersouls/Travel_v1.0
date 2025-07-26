import React from 'react';
import { cn } from '@/lib/utils';

export function TravelListSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 스켈레톤 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded-lg shimmer mb-2" />
            <div className="h-5 w-32 bg-gray-200 rounded shimmer" />
          </div>
          
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <div className="h-8 w-16 bg-gray-200 rounded-lg shimmer" />
            <div className="h-8 w-20 bg-gray-200 rounded-lg shimmer" />
            <div className="h-8 w-28 bg-gray-200 rounded-lg shimmer" />
          </div>
        </div>

        {/* 카드 그리드 스켈레톤 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <TravelCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TravelCardSkeleton() {
  return (
    <div className={cn(
      '@container bg-white rounded-xl border border-gray-200',
      'shadow-sm overflow-hidden'
    )}>
      {/* 커버 이미지 스켈레톤 */}
      <div className="@md:h-48 h-40 bg-gray-200 shimmer relative">
        {/* 상태 배지 스켈레톤 */}
        <div className="absolute top-3 left-3">
          <div className="h-6 w-16 bg-white/50 rounded-full shimmer" />
        </div>
      </div>
      
      {/* 카드 내용 스켈레톤 */}
      <div className="@md:p-6 p-4">
        {/* 제목과 목적지 */}
        <div className="mb-4">
          <div className="h-6 w-3/4 bg-gray-200 rounded shimmer mb-2" />
          <div className="h-4 w-1/2 bg-gray-200 rounded shimmer mb-2" />
          <div className="h-4 w-2/3 bg-gray-200 rounded shimmer" />
        </div>
        
        {/* 설명 */}
        <div className="mb-4">
          <div className="h-4 w-full bg-gray-200 rounded shimmer mb-1" />
          <div className="h-4 w-3/4 bg-gray-200 rounded shimmer" />
        </div>
        
        {/* 통계 정보 */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-4 w-12 bg-gray-200 rounded shimmer" />
          <div className="h-4 w-16 bg-gray-200 rounded shimmer" />
          <div className="h-4 w-12 bg-gray-200 rounded shimmer" />
        </div>
        
        {/* 계획 미리보기 */}
        <div className="flex flex-wrap gap-1 mb-4">
          <div className="h-6 w-16 bg-gray-200 rounded shimmer" />
          <div className="h-6 w-20 bg-gray-200 rounded shimmer" />
          <div className="h-6 w-14 bg-gray-200 rounded shimmer" />
        </div>
        
        {/* 액션 버튼들 */}
        <div className="flex items-center justify-between gap-2">
          <div className="h-8 flex-1 bg-gray-200 rounded-lg shimmer" />
          <div className="flex items-center gap-1">
            <div className="h-8 w-8 bg-gray-200 rounded-lg shimmer" />
            <div className="h-8 w-8 bg-gray-200 rounded-lg shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}