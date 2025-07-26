import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import DayPlanDetail from '@/components/features/day-plan/DayPlanDetail';
import DayPlanDetailSkeleton from '@/components/features/day-plan/DayPlanDetailSkeleton';

interface DayPlanDetailPageProps {
  params: {
    travelId: string;
    dayId: string;
  };
}

export default function DayPlanDetailPage({ params }: DayPlanDetailPageProps) {
  const { travelId, dayId } = params;

  if (!travelId || !dayId) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<DayPlanDetailSkeleton />}>
        <DayPlanDetail travelId={travelId} dayId={dayId} />
      </Suspense>
    </div>
  );
}

export async function generateStaticParams() {
  // Static export compatibility - provide a placeholder
  // Actual routes will be handled dynamically at runtime
  return [{ travelId: 'placeholder', dayId: 'placeholder' }];
}

export async function generateMetadata({
  params: _params,
}: DayPlanDetailPageProps) {
  return {
    title: `일별 상세 계획 | Moonwave Travel`,
    description: '일별 여행 계획을 상세히 확인하고 편집하세요.',
  };
}
