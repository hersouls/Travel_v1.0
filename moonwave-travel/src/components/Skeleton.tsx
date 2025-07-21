import React from 'react';
import { cn } from '@/utils/helpers';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  width, 
  height, 
  rounded = 'md' 
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        roundedClasses[rounded],
        className
      )}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};

// 특정 용도의 스켈레톤 컴포넌트들
export const TripCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <Skeleton className="w-full aspect-[1.618]" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <Skeleton className="h-4 w-20" />
        <div className="flex space-x-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-2 h-2 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const PlanCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <div className="flex space-x-4">
      <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  </div>
);

export const TripDetailSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-20 h-20 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
    
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <PlanCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default Skeleton;