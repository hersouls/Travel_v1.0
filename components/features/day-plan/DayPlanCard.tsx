'use client';

import { MapPin, DollarSign, FileText } from 'lucide-react';
import { DayPlan } from '@/lib/types/database';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatKoreanWon } from '@/lib/utils';

interface DayPlanCardProps {
  plan: DayPlan;
}

export default function DayPlanCard({ plan }: DayPlanCardProps) {
  // 계획 유형별 색상 및 아이콘 매핑
  const planTypeConfig = {
    sightseeing: { label: '관광', color: 'bg-travel-mountain', icon: '🏛️' },
    restaurant: { label: '식당', color: 'bg-travel-food', icon: '🍽️' },
    accommodation: { label: '숙박', color: 'bg-travel-beach', icon: '🏨' },
    transportation: { label: '교통', color: 'bg-travel-city', icon: '🚗' },
    shopping: { label: '쇼핑', color: 'bg-travel-shopping', icon: '🛍️' },
    entertainment: { label: '여가', color: 'bg-travel-adventure', icon: '🎯' },
    meeting: { label: '만남', color: 'bg-travel-culture', icon: '👥' },
    others: { label: '기타', color: 'bg-gray-500', icon: '📝' },
  };

  const config = planTypeConfig[plan.plan_type] || planTypeConfig.others;

  return (
    <Card className="p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* 시간 */}
        <div className="flex-shrink-0 text-center">
          {plan.planned_time ? (
            <div className="text-sm font-semibold text-gray-900">
              {plan.planned_time.slice(0, 5)}
            </div>
          ) : (
            <div className="text-sm text-gray-400">미정</div>
          )}
          {plan.duration_minutes && (
            <div className="mt-1 text-xs text-gray-500">
              {plan.duration_minutes}분
            </div>
          )}
        </div>

        {/* 메인 내용 */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-lg">{config.icon}</span>
                <h4 className="font-semibold text-gray-900 break-keep-ko">
                  {plan.place_name}
                </h4>
                <Badge
                  variant="secondary"
                  className={`${config.color} border-none text-xs text-white`}
                >
                  {config.label}
                </Badge>
              </div>

              {plan.place_address && (
                <div className="mb-1 flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{plan.place_address}</span>
                </div>
              )}
            </div>

            {/* 예산 */}
            {plan.budget && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <DollarSign className="h-3 w-3" />
                <span>{formatKoreanWon(plan.budget)}</span>
              </div>
            )}
          </div>

          {/* 노트 */}
          {plan.notes && (
            <div className="flex items-start gap-1 text-sm text-gray-600">
              <FileText className="mt-0.5 h-3 w-3 flex-shrink-0" />
              <p className="line-clamp-2 break-keep-ko">{plan.notes}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
