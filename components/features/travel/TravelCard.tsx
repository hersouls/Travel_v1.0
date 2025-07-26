import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Users, Clock, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn, formatKoreanDate, calculateTravelDuration } from '@/lib/utils';
import type { Database } from '@/lib/types/database';

type TravelPlan = Database['public']['Tables']['travel_plans']['Row'];
type TravelPlanWithDays = TravelPlan & {
  travel_days: {
    id: string;
    day_number: number;
    date: string;
    title: string | null;
    day_plans: {
      id: string;
      place_name: string;
      plan_type: string;
      planned_time: string | null;
    }[];
  }[];
};

export interface TravelCardProps {
  travel: TravelPlanWithDays;
  onEdit?: (travel: TravelPlanWithDays) => void;
  onDelete?: (travel: TravelPlanWithDays) => void;
  className?: string;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'planning':
      return {
        label: '계획 중',
        variant: 'secondary' as const,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        dotColor: 'bg-blue-500'
      };
    case 'ongoing':
      return {
        label: '진행 중',
        variant: 'default' as const,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        dotColor: 'bg-green-500'
      };
    case 'completed':
      return {
        label: '완료',
        variant: 'outline' as const,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        dotColor: 'bg-gray-400'
      };
    default:
      return {
        label: '알 수 없음',
        variant: 'outline' as const,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        dotColor: 'bg-gray-400'
      };
  }
};

export const TravelCard = React.forwardRef<HTMLDivElement, TravelCardProps>(
  ({ travel, onEdit, onDelete, className, ...props }, ref) => {
    const statusConfig = getStatusConfig(travel.status || 'planning');
    const duration = calculateTravelDuration(travel.start_date, travel.end_date);
    const totalPlans = travel.travel_days.reduce((sum, day) => sum + day.day_plans.length, 0);

    const [showActions, setShowActions] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          // 기본 스타일 - Pretendard 적용
          'font-pretendard antialiased',
          
          // Container Queries 설정
          '@container/card bg-white rounded-xl border border-gray-200',
          'shadow-soft hover:shadow-lg transition-all duration-300',
          'hover:scale-[1.02] hover:-translate-y-1',
          
          // 반응형 패딩
          'p-4 @md/card:p-6',
          
          className
        )}
        {...props}
      >
        {/* 헤더 */}
        <div className="flex @lg/card:flex-row flex-col @lg/card:items-start @lg/card:justify-between mb-4">
          <div className="flex-1 min-w-0 @lg/card:mb-0 mb-3">
            <div className="flex items-start justify-between mb-2">
              <Link 
                href={`/travels/${travel.id}`}
                className="group flex-1 min-w-0"
              >
                <h3 className={cn(
                  'font-pretendard font-semibold text-lg @md/card:text-xl',
                  'text-gray-900 tracking-korean-tight break-keep-ko',
                  'group-hover:text-moonwave-primary transition-colors duration-200',
                  'line-clamp-2'
                )}>
                  {travel.title}
                </h3>
              </Link>
              
              {/* 액션 버튼 */}
              <div className="relative ml-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowActions(!showActions)}
                  className="@lg/card:opacity-0 @lg/card:group-hover:opacity-100 transition-opacity duration-200"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
                
                {showActions && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                    <button
                      onClick={() => {
                        onEdit?.(travel);
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      수정
                    </button>
                    <button
                      onClick={() => {
                        onDelete?.(travel);
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* 목적지 */}
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className={cn(
                'font-pretendard text-sm @md/card:text-base',
                'tracking-korean-normal break-keep-ko truncate'
              )}>
                {travel.destination}
              </span>
            </div>
            
            {/* 설명 */}
            {travel.description && (
              <p className={cn(
                'font-pretendard text-sm text-gray-600 @lg/card:block hidden',
                'tracking-korean-normal break-keep-ko line-clamp-2'
              )}>
                {travel.description}
              </p>
            )}
          </div>
          
          {/* 상태 배지 */}
          <div className="@lg/card:ml-4 flex-shrink-0">
            <div className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
              statusConfig.bgColor,
              statusConfig.color
            )}>
              <span className={cn('w-2 h-2 rounded-full mr-2', statusConfig.dotColor)} />
              {statusConfig.label}
            </div>
          </div>
        </div>

        {/* 날짜 정보 */}
        <div className="@container/dates flex @md/dates:flex-row flex-col @md/dates:items-center @md/dates:gap-6 gap-3 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className={cn(
              'font-pretendard text-sm @md/card:text-base',
              'text-numeric tracking-korean-wide'
            )}>
              {formatKoreanDate(travel.start_date)} ~ {formatKoreanDate(travel.end_date)}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className={cn(
              'font-pretendard text-sm @md/card:text-base',
              'tracking-korean-normal'
            )}>
              {duration}
            </span>
          </div>
        </div>

        {/* 통계 정보 */}
        <div className="@container/stats flex @md/stats:flex-row flex-col @md/stats:items-center @md/stats:justify-between gap-3">
          <div className="flex @sm/stats:flex-row flex-col @sm/stats:gap-4 gap-2">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className={cn(
                'font-pretendard text-sm',
                'tracking-korean-normal'
              )}>
                {travel.travel_days.length}일 일정
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className={cn(
                'font-pretendard text-sm',
                'tracking-korean-normal'
              )}>
                {totalPlans}개 계획
              </span>
            </div>

            {travel.collaborators && travel.collaborators.length > 0 && (
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className={cn(
                  'font-pretendard text-sm',
                  'tracking-korean-normal'
                )}>
                  {travel.collaborators.length + 1}명 참여
                </span>
              </div>
            )}
          </div>
          
          {/* 공개 상태 */}
          {travel.is_public && (
            <div className="@md/stats:ml-4 flex-shrink-0">
              <Badge variant="outline" size="sm">
                공개
              </Badge>
            </div>
          )}
        </div>

        {/* 호버 시 추가 액션 */}
        <div className="@lg/card:opacity-0 @lg/card:group-hover:opacity-100 transition-opacity duration-200 mt-4 pt-4 border-t border-gray-100 @lg/card:block hidden">
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/travels/${travel.id}`}>
                자세히 보기
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/travels/${travel.id}/edit`}>
                수정하기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

TravelCard.displayName = 'TravelCard';