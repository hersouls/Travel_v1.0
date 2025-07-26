import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import TravelDetailView from '@/components/features/travel/TravelDetailView';
import TravelDetailSkeleton from '@/components/features/travel/TravelDetailSkeleton';

interface TravelDetailPageProps {
  params: {
    travelId: string;
  };
}

export default function TravelDetailPage({ params }: TravelDetailPageProps) {
  const { travelId } = params;

  if (!travelId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<TravelDetailSkeleton />}>
          <TravelDetailView travelId={travelId} />
        </Suspense>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // Static export compatibility - provide a placeholder
  // Actual routes will be handled dynamically at runtime
  return [{ travelId: 'placeholder' }]
}

export async function generateMetadata({ params: _params }: TravelDetailPageProps) {
  return {
    title: `여행 상세 | Moonwave Travel`,
    description: '여행 계획 상세 정보를 확인하세요.',
  }
}