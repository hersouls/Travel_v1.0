import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import DayPlansList from '@/components/features/day-plan/DayPlansList';
import DayPlansListSkeleton from '@/components/features/day-plan/DayPlansListSkeleton';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

interface DayPlansPageProps {
  params: {
    travelId: string;
  };
}

export default function DayPlansPage({ params }: DayPlansPageProps) {
  const { travelId } = params;

  if (!travelId) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href={`/travels/${travelId}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-korean-tight">
            일정별 계획
          </h1>
          <p className="mt-2 text-gray-600 break-keep-ko">
            여행 일정을 계획하고 관리하세요
          </p>
        </div>
        <Button variant="default" size="lg" className="flex items-center gap-2">
          <Plus className="h-5 w-5" />새 계획 추가
        </Button>
      </div>

      {/* Day별 계획 목록 */}
      <Suspense fallback={<DayPlansListSkeleton />}>
        <DayPlansList travelId={travelId} />
      </Suspense>
    </div>
  );
}

export async function generateStaticParams() {
  // Static export compatibility - provide a placeholder
  // Actual routes will be handled dynamically at runtime
  return [{ travelId: 'placeholder' }];
}

export async function generateMetadata({ params: _params }: DayPlansPageProps) {
  return {
    title: `일정별 계획 | Moonwave Travel`,
    description: '여행 일정을 계획하고 관리하세요.',
  };
}
