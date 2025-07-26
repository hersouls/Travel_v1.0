'use client';

import { Clock, MapPin, Edit } from 'lucide-react';
import { DayPlan } from '@/lib/types/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatKoreanWon } from '@/lib/utils';

interface PlanTimelineProps {
  plans: DayPlan[];
  onEditPlan: (planId: string) => void;
}

export default function PlanTimeline({ plans, onEditPlan }: PlanTimelineProps) {
  // 시간이 설정된 계획과 설정되지 않은 계획 분리
  const timedPlans = plans
    .filter((plan) => plan.planned_time)
    .sort((a, b) => a.planned_time!.localeCompare(b.planned_time!));
  const untimedPlans = plans.filter((plan) => !plan.planned_time);

  const getPlanTypeInfo = (type: string) => {
    const configs = {
      restaurant: { label: '식당', color: 'bg-travel-food', icon: '🍽️' },
      sightseeing: { label: '관광', color: 'bg-travel-mountain', icon: '🏛️' },
      accommodation: { label: '숙박', color: 'bg-travel-beach', icon: '🏨' },
      transportation: { label: '교통', color: 'bg-travel-city', icon: '🚗' },
      shopping: { label: '쇼핑', color: 'bg-travel-shopping', icon: '🛍️' },
      entertainment: {
        label: '여가',
        color: 'bg-travel-adventure',
        icon: '🎯',
      },
      meeting: { label: '만남', color: 'bg-travel-culture', icon: '👥' },
      others: { label: '기타', color: 'bg-gray-500', icon: '📝' },
    };
    return configs[type as keyof typeof configs] || configs.others;
  };

  if (plans.length === 0) {
    return (
      <div className="py-12 text-center">
        <Clock className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          타임라인이 비어있습니다
        </h3>
        <p className="text-gray-600 break-keep-ko">
          계획을 추가하고 시간을 설정해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 시간별 계획 타임라인 */}
      {timedPlans.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Clock className="h-5 w-5" />
            시간별 계획
          </h3>

          <div className="relative">
            {/* 타임라인 라인 */}
            <div className="absolute bottom-0 left-6 top-0 w-0.5 bg-gray-200" />

            <div className="space-y-6">
              {timedPlans.map((plan, _index) => {
                const typeInfo = getPlanTypeInfo(plan.plan_type);

                return (
                  <div
                    key={plan.id}
                    className="relative flex items-start gap-4"
                  >
                    {/* 타임라인 점 */}
                    <div
                      className={`relative z-10 h-12 w-12 ${typeInfo.color} flex flex-shrink-0 items-center justify-center rounded-full text-xl text-white`}
                    >
                      {typeInfo.icon}
                    </div>

                    {/* 시간 표시 */}
                    <div className="w-16 flex-shrink-0 pt-2">
                      <div className="text-sm font-semibold text-gray-900">
                        {plan.planned_time?.slice(0, 5)}
                      </div>
                      {plan.duration_minutes && (
                        <div className="text-xs text-gray-500">
                          {plan.duration_minutes}분
                        </div>
                      )}
                    </div>

                    {/* 계획 내용 */}
                    <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 break-keep-ko">
                              {plan.place_name}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              {typeInfo.label}
                            </Badge>
                          </div>

                          {plan.place_address && (
                            <div className="mb-2 flex items-center gap-1 text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span className="text-sm">
                                {plan.place_address}
                              </span>
                            </div>
                          )}

                          {plan.budget && (
                            <div className="text-travel-food mb-2 text-sm font-medium">
                              {formatKoreanWon(plan.budget)}
                            </div>
                          )}

                          {plan.notes && (
                            <p className="text-sm text-gray-700 break-keep-ko">
                              {plan.notes}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditPlan(plan.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 시간 미설정 계획들 */}
      {untimedPlans.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            시간 미설정 계획
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {untimedPlans.map((plan) => {
              const typeInfo = getPlanTypeInfo(plan.plan_type);

              return (
                <div
                  key={plan.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-1 items-start gap-3">
                      <div
                        className={`h-8 w-8 ${typeInfo.color} flex flex-shrink-0 items-center justify-center rounded-full text-sm text-white`}
                      >
                        {typeInfo.icon}
                      </div>

                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 break-keep-ko">
                            {plan.place_name}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {typeInfo.label}
                          </Badge>
                        </div>

                        {plan.place_address && (
                          <div className="mb-1 flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs">
                              {plan.place_address}
                            </span>
                          </div>
                        )}

                        {plan.budget && (
                          <div className="text-travel-food text-xs font-medium">
                            {formatKoreanWon(plan.budget)}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditPlan(plan.id)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800 break-keep-ko">
              💡 계획을 편집해서 시간을 설정하면 타임라인에 표시됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
