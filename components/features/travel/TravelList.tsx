'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TravelCard } from './TravelCard';
import { useTravelPlans } from '@/hooks/useTravelPlans';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Filter, Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
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

export interface TravelListProps {
  travelPlans: TravelPlanWithDays[];
  className?: string;
}

type FilterStatus = 'all' | 'planning' | 'ongoing' | 'completed';
type ViewMode = 'grid' | 'list';

export const TravelList = React.forwardRef<HTMLDivElement, TravelListProps>(
  ({ travelPlans, className, ...props }, ref) => {
    const router = useRouter();
    const { deleteTravelPlan } = useTravelPlans();

    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    // 상태에 따른 여행 필터링
    const filteredTravels = travelPlans.filter((travel) => {
      if (filterStatus === 'all') return true;
      return travel.status === filterStatus;
    });

    // 여행 편집 처리
    const handleEdit = (travel: TravelPlanWithDays) => {
      router.push(`/travels/${travel.id}/edit`);
    };

    // 여행 삭제 처리
    const handleDelete = async (travel: TravelPlanWithDays) => {
      if (window.confirm(`'${travel.title}' 여행을 정말 삭제하시겠습니까?`)) {
        const success = await deleteTravelPlan(travel.id);
        if (success) {
          // useTravelPlans 훅에서 자동으로 목록 업데이트
        }
      }
    };

    // 상태별 개수 계산
    const statusCounts = {
      all: travelPlans.length,
      planning: travelPlans.filter((t) => t.status === 'planning').length,
      ongoing: travelPlans.filter((t) => t.status === 'ongoing').length,
      completed: travelPlans.filter((t) => t.status === 'completed').length,
    };

    const filterButtons: { key: FilterStatus; label: string; count: number }[] =
      [
        { key: 'all', label: '전체', count: statusCounts.all },
        { key: 'planning', label: '계획 중', count: statusCounts.planning },
        { key: 'ongoing', label: '진행 중', count: statusCounts.ongoing },
        { key: 'completed', label: '완료', count: statusCounts.completed },
      ];

    if (travelPlans.length === 0) {
      return null; // EmptyTravelState는 상위 컴포넌트에서 처리
    }

    return (
      <div
        ref={ref}
        className={cn('@container/travel-list', className)}
        {...props}
      >
        {/* 필터 및 뷰 옵션 */}
        <div className="mb-6 @container/controls">
          <div className="flex flex-col gap-4 @lg/controls:flex-row @lg/controls:items-center @lg/controls:justify-between">
            {/* 상태 필터 */}
            <div className="flex flex-col gap-3 @md/controls:flex-row @md/controls:items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <span
                  className={cn(
                    'font-pretendard text-sm font-medium text-gray-700',
                    'tracking-korean-normal'
                  )}
                >
                  상태별 보기:
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {filterButtons.map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilterStatus(key)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                      'font-pretendard tracking-korean-normal',
                      filterStatus === key
                        ? 'bg-moonwave-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {label}
                    <Badge variant="secondary" size="sm" className="ml-1">
                      {count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* 뷰 모드 선택 */}
            <div className="flex items-center gap-2 @lg/controls:ml-4">
              <span
                className={cn(
                  'hidden font-pretendard text-sm font-medium text-gray-700 @lg/controls:block',
                  'tracking-korean-normal'
                )}
              >
                보기:
              </span>

              <div className="flex overflow-hidden rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center transition-colors',
                    viewMode === 'grid'
                      ? 'bg-moonwave-primary text-white'
                      : 'bg-white text-gray-500 hover:text-gray-700'
                  )}
                  title="그리드 보기"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center transition-colors',
                    viewMode === 'list'
                      ? 'bg-moonwave-primary text-white'
                      : 'bg-white text-gray-500 hover:text-gray-700'
                  )}
                  title="리스트 보기"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 결과 표시 */}
        <div className="mb-4">
          <p
            className={cn(
              'font-pretendard text-sm text-gray-600',
              'tracking-korean-normal'
            )}
          >
            {filterStatus === 'all'
              ? `총 ${filteredTravels.length}개의 여행 계획`
              : `${filterButtons.find((f) => f.key === filterStatus)?.label} ${filteredTravels.length}개`}
          </p>
        </div>

        {/* 여행 목록 */}
        {filteredTravels.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3
              className={cn(
                'mb-2 font-pretendard text-lg font-semibold text-gray-900',
                'tracking-korean-tight break-keep-ko'
              )}
            >
              해당하는 여행이 없습니다
            </h3>
            <p
              className={cn(
                'font-pretendard text-gray-600',
                'tracking-korean-normal break-keep-ko'
              )}
            >
              다른 상태의 여행을 확인해보세요
            </p>
          </div>
        ) : (
          <div
            className={cn(
              '@container/grid',
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-6 @3xl/grid:grid-cols-2 @6xl/grid:grid-cols-3'
                : 'space-y-4'
            )}
          >
            {filteredTravels.map((travel) => (
              <div
                key={travel.id}
                className={cn(
                  'group',
                  viewMode === 'list' && '@container/list-item'
                )}
              >
                <TravelCard
                  travel={travel}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  className={cn(
                    viewMode === 'list' && [
                      'flex flex-col @lg/list-item:flex-row',
                      'p-3 @lg/list-item:items-center @lg/list-item:p-4',
                      'h-auto @lg/list-item:h-auto',
                    ]
                  )}
                />
              </div>
            ))}
          </div>
        )}

        {/* 추가 액션 (페이지네이션 등) */}
        {filteredTravels.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" size="sm">
              더 보기
            </Button>
          </div>
        )}
      </div>
    );
  }
);

TravelList.displayName = 'TravelList';
