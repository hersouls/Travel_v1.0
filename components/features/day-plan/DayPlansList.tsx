'use client';

import { useState } from 'react';
import { useTravelDays } from '@/lib/hooks/useTravelDays';
import DayPlanAccordion from './DayPlanAccordion';
import { formatKoreanDate } from '@/lib/utils';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface DayPlansListProps {
  travelId: string;
}

export default function DayPlansList({ travelId }: DayPlansListProps) {
  const { data: travelDays, loading, error } = useTravelDays(travelId);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  if (loading) {
    return <div>일정을 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-red-600">일정을 불러오는데 실패했습니다.</p>
        <p className="text-sm text-gray-500 break-keep-ko">{error}</p>
      </div>
    );
  }

  if (!travelDays || travelDays.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            아직 일정이 없습니다
          </h3>
          <p className="text-gray-600 break-keep-ko">
            여행 일정을 추가해서 계획을 세워보세요!
          </p>
        </div>
        <Button variant="default" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />첫 일정 추가하기
        </Button>
      </div>
    );
  }

  const toggleExpand = (dayId: string) => {
    setExpandedDay(expandedDay === dayId ? null : dayId);
  };

  return (
    <div className="space-y-4">
      {/* 일정 개요 */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            전체 일정 ({travelDays.length}일)
          </h2>
          <div className="text-sm text-gray-600">
            {formatKoreanDate(travelDays[0]?.date)} -{' '}
            {formatKoreanDate(travelDays[travelDays.length - 1]?.date)}
          </div>
        </div>

        {/* 일정별 요약 */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-travel-city text-2xl font-bold">
              {travelDays.reduce(
                (total, day) => total + (day.day_plans?.length || 0),
                0
              )}
            </div>
            <div className="text-sm text-gray-600">총 계획</div>
          </div>
          <div className="text-center">
            <div className="text-travel-mountain text-2xl font-bold">
              {
                travelDays.filter(
                  (day) => day.day_plans && day.day_plans.length > 0
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">계획 있는 날</div>
          </div>
          <div className="text-center">
            <div className="text-travel-food text-2xl font-bold">
              {travelDays.reduce(
                (total, day) =>
                  total +
                  (day.day_plans?.filter(
                    (plan) => plan.plan_type === 'restaurant'
                  ).length || 0),
                0
              )}
            </div>
            <div className="text-sm text-gray-600">식당</div>
          </div>
          <div className="text-center">
            <div className="text-travel-beach text-2xl font-bold">
              {travelDays.reduce(
                (total, day) =>
                  total +
                  (day.day_plans?.filter(
                    (plan) => plan.plan_type === 'sightseeing'
                  ).length || 0),
                0
              )}
            </div>
            <div className="text-sm text-gray-600">관광지</div>
          </div>
        </div>
      </Card>

      {/* Day별 계획 아코디언 */}
      <div className="space-y-3">
        {travelDays.map((day) => (
          <DayPlanAccordion
            key={day.id}
            day={day}
            isExpanded={expandedDay === day.id}
            onToggle={() => toggleExpand(day.id)}
            travelId={travelId}
          />
        ))}
      </div>
    </div>
  );
}
