import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MapPin, Calendar, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
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

const getStatusBadge = (status: string) => {
  const badges = {
    planning: { label: '계획 중', className: 'travel-badge-planning' },
    ongoing: { label: '진행 중', className: 'travel-badge-ongoing' },
    completed: { label: '완료', className: 'travel-badge-completed' },
    cancelled: { label: '취소', className: 'travel-badge-cancelled' },
  };
  
  return badges[status as keyof typeof badges] || badges.planning;
};

const getPlanTypeColor = (type: string) => {
  const colors = {
    sightseeing: 'bg-blue-100 text-blue-800',
    restaurant: 'bg-orange-100 text-orange-800',
    accommodation: 'bg-purple-100 text-purple-800',
    transportation: 'bg-green-100 text-green-800',
    shopping: 'bg-pink-100 text-pink-800',
    entertainment: 'bg-yellow-100 text-yellow-800',
    meeting: 'bg-indigo-100 text-indigo-800',
    others: 'bg-gray-100 text-gray-800',
  };
  
  return colors[type as keyof typeof colors] || colors.others;
};

export const TravelCard = React.forwardRef<HTMLDivElement, TravelCardProps>(
  ({ travel, onEdit, onDelete, className, ...props }, ref) => {
    const statusBadge = getStatusBadge(travel.status || 'planning');
    const totalDays = travel.travel_days?.length || 0;
    const totalPlans = travel.travel_days?.reduce((sum, day) => sum + (day.day_plans?.length || 0), 0) || 0;
    
    // 여행 시작일과 종료일
    const startDate = new Date(travel.start_date);
    const endDate = new Date(travel.end_date);
    
    return (
      <div
        ref={ref}
        className={cn(
          // Container Queries 기본 설정
          '@container travel-card',
          'group relative overflow-hidden',
          className
        )}
        {...props}
      >
        {/* 커버 이미지 */}
        <div className="@md:h-48 h-40 bg-gradient-to-br from-moonwave-blue-400 to-moonwave-purple-500 relative overflow-hidden">
          {travel.cover_image_url ? (
            <img
              src={travel.cover_image_url}
              alt={travel.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="w-12 h-12 text-white/80" />
            </div>
          )}
          
          {/* 상태 배지 */}
          <div className="absolute top-3 left-3">
            <span className={cn('travel-badge', statusBadge.className)}>
              {statusBadge.label}
            </span>
          </div>
          
          {/* 공개/비공개 표시 */}
          {travel.is_public && (
            <div className="absolute top-3 right-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                <Eye className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>
        
        {/* 카드 내용 */}
        <div className="@md:p-6 p-4">
          {/* 제목과 목적지 */}
          <div className="mb-4">
            <h3 className={cn(
              'font-pretendard font-bold @md:text-xl text-lg text-gray-900',
              'tracking-korean-tight break-keep-ko mb-2',
              'line-clamp-2'
            )}>
              {travel.title}
            </h3>
            
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className={cn(
                'font-pretendard text-sm',
                'tracking-korean-normal break-keep-ko',
                'line-clamp-1'
              )}>
                {travel.destination}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className={cn(
                'font-pretendard text-sm text-numeric',
                'tracking-korean-normal'
              )}>
                {format(startDate, 'M월 d일', { locale: ko })} - {format(endDate, 'M월 d일', { locale: ko })}
              </span>
            </div>
          </div>
          
          {/* 설명 */}
          {travel.description && (
            <p className={cn(
              'font-pretendard text-sm text-gray-600 mb-4',
              'tracking-korean-normal break-keep-ko',
              'line-clamp-2'
            )}>
              {travel.description}
            </p>
          )}
          
          {/* 통계 정보 */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="text-numeric">{totalDays}일</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-numeric">{totalPlans}개 계획</span>
            </div>
            {travel.collaborators && travel.collaborators.length > 0 && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-numeric">{travel.collaborators.length}명</span>
              </div>
            )}
          </div>
          
          {/* 최근 계획들 미리보기 */}
          {travel.travel_days && travel.travel_days.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {travel.travel_days.slice(0, 3).map((day) => 
                  day.day_plans?.slice(0, 2).map((plan) => (
                    <span
                      key={plan.id}
                      className={cn(
                        'inline-flex items-center rounded px-2 py-1 text-xs font-medium',
                        getPlanTypeColor(plan.plan_type)
                      )}
                    >
                      {plan.place_name}
                    </span>
                  ))
                )}
                {totalPlans > 6 && (
                  <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600">
                    +{totalPlans - 6}개 더
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* 액션 버튼들 */}
          <div className="flex items-center justify-between gap-2">
            <Button asChild variant="ghost" size="sm" className="flex-1">
              <Link href={`/travels/${travel.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                보기
              </Link>
            </Button>
            
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(travel)}
                  className="w-8 h-8"
                >
                  <Edit className="w-4 h-4" />
                  <span className="sr-only">여행 수정</span>
                </Button>
              )}
              
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(travel)}
                  className="w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">여행 삭제</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* 호버 효과 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 pointer-events-none" />
      </div>
    );
  }
);

TravelCard.displayName = 'TravelCard';