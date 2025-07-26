import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import EditTravelForm from '@/components/features/travel/EditTravelForm';
import TravelDetailSkeleton from '@/components/features/travel/TravelDetailSkeleton';

interface EditTravelPageProps {
  params: {
    travelId: string;
  };
}

export default function EditTravelPage({ params }: EditTravelPageProps) {
  const { travelId } = params;

  if (!travelId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<TravelDetailSkeleton />}>
          <EditTravelForm travelId={travelId} />
        </Suspense>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // 동적 라우트이므로 빈 배열 반환 (runtime에서 생성됨)
  return []
}

export async function generateMetadata({ params: _params }: EditTravelPageProps) {
  return {
    title: `여행 계획 수정 | Moonwave Travel`,
    description: '여행 계획을 수정하세요.',
  }
}