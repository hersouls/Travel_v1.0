import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  MoreHorizontal,
  Edit2,
  Trash2,
} from 'lucide-react';
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
        dotColor: 'bg-blue-500',
      };
    case 'ongoing':
      return {
        label: '진행 중',
        variant: 'default' as const,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        dotColor: 'bg-green-500',
      };
    case 'completed':
      return {
        label: '완료',
        variant: 'outline' as const,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        dotColor: 'bg-gray-400',
      };
    default:
      return {
        label: '알 수 없음',
        variant: 'outline' as const,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        dotColor: 'bg-gray-400',
      };
  }
};

export const TravelCard = React.forwardRef<HTMLDivElement, TravelCardProps>(
  ({ travel, onEdit, onDelete, className, ...props }, ref) => {
    const statusConfig = getStatusConfig(travel.status || 'planning');
    const duration = calculateTravelDuration(
      travel.start_date,
      travel.end_date
    );
    const totalPlans = travel.travel_days.reduce(
      (sum, day) => sum + day.day_plans.length,
      0
    );

    const [showActions, setShowActions] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          // 기본 스타일 - Pretendard 적용
          'font-pretendard antialiased',

          // Container Queries 설정
          'rounded-xl border border-gray-200 bg-white @container/card',
          'shadow-soft transition-all duration-300 hover:shadow-lg',
          'hover:-translate-y-1 hover:scale-[1.02]',

          // 반응형 패딩
          'p-4 @md/card:p-6',

          className
        )}
        {...props}
      >
        {/* 헤더 */}
        <div className="mb-4 flex flex-col @lg/card:flex-row @lg/card:items-start @lg/card:justify-between">
          <div className="mb-3 min-w-0 flex-1 @lg/card:mb-0">
            <div className="mb-2 flex items-start justify-between">
              <Link
                href={`/travels/${travel.id}`}
                className="group min-w-0 flex-1"
              >
                <h3
                  className={cn(
                    'font-pretendard text-lg font-semibold @md/card:text-xl',
                    'text-gray-900 tracking-korean-tight break-keep-ko',
                    'transition-colors duration-200 group-hover:text-moonwave-primary',
                    'line-clamp-2'
                  )}
                >
                  {travel.title}
                </h3>
              </Link>

              {/* 액션 버튼 */}
              <div className="relative ml-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowActions(!showActions)}
                  className="transition-opacity duration-200 @lg/card:opacity-0 @lg/card:group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>

                {showActions && (
                  <div className="absolute right-0 top-full z-10 mt-2 min-w-[120px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    <button
                      onClick={() => {
                        onEdit?.(travel);
                        setShowActions(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Edit2 className="h-4 w-4" />
                      수정
                    </button>
                    <button
                      onClick={() => {
                        onDelete?.(travel);
                        setShowActions(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 목적지 */}
            <div className="mb-2 flex items-center text-gray-600">
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
              <span
                className={cn(
                  'font-pretendard text-sm @md/card:text-base',
                  'truncate tracking-korean-normal break-keep-ko'
                )}
              >
                {travel.destination}
              </span>
            </div>

            {/* 설명 */}
            {travel.description && (
              <p
                className={cn(
                  'hidden font-pretendard text-sm text-gray-600 @lg/card:block',
                  'line-clamp-2 tracking-korean-normal break-keep-ko'
                )}
              >
                {travel.description}
              </p>
            )}
          </div>

          {/* 상태 배지 */}
          <div className="flex-shrink-0 @lg/card:ml-4">
            <div
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                statusConfig.bgColor,
                statusConfig.color
              )}
            >
              <span
                className={cn(
                  'mr-2 h-2 w-2 rounded-full',
                  statusConfig.dotColor
                )}
              />
              {statusConfig.label}
            </div>
          </div>
        </div>

        {/* 날짜 정보 */}
        <div className="mb-4 flex flex-col gap-3 @container/dates @md/dates:flex-row @md/dates:items-center @md/dates:gap-6">
          <div className="flex items-center text-gray-600">
            <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
            <span
              className={cn(
                'font-pretendard text-sm @md/card:text-base',
                'tracking-korean-wide text-numeric'
              )}
            >
              {formatKoreanDate(travel.start_date)} ~{' '}
              {formatKoreanDate(travel.end_date)}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
            <span
              className={cn(
                'font-pretendard text-sm @md/card:text-base',
                'tracking-korean-normal'
              )}
            >
              {duration}
            </span>
          </div>
        </div>

        {/* 통계 정보 */}
        <div className="flex flex-col gap-3 @container/stats @md/stats:flex-row @md/stats:items-center @md/stats:justify-between">
          <div className="flex flex-col gap-2 @sm/stats:flex-row @sm/stats:gap-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
              <span
                className={cn(
                  'font-pretendard text-sm',
                  'tracking-korean-normal'
                )}
              >
                {travel.travel_days.length}일 일정
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
              <span
                className={cn(
                  'font-pretendard text-sm',
                  'tracking-korean-normal'
                )}
              >
                {totalPlans}개 계획
              </span>
            </div>

            {travel.collaborators && travel.collaborators.length > 0 && (
              <div className="flex items-center text-gray-600">
                <Users className="mr-2 h-4 w-4 flex-shrink-0" />
                <span
                  className={cn(
                    'font-pretendard text-sm',
                    'tracking-korean-normal'
                  )}
                >
                  {travel.collaborators.length + 1}명 참여
                </span>
              </div>
            )}
          </div>

          {/* 공개 상태 */}
          {travel.is_public && (
            <div className="flex-shrink-0 @md/stats:ml-4">
              <Badge variant="outline" size="sm">
                공개
              </Badge>
            </div>
          )}
        </div>

        {/* 호버 시 추가 액션 */}
        <div className="mt-4 hidden border-t border-gray-100 pt-4 transition-opacity duration-200 @lg/card:block @lg/card:opacity-0 @lg/card:group-hover:opacity-100">
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/travels/${travel.id}`}>자세히 보기</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/travels/${travel.id}/edit`}>수정하기</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

TravelCard.displayName = 'TravelCard';
