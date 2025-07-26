import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import TravelDetailView from '@/components/features/travel/TravelDetailView';
import TravelDetailSkeleton from '@/components/features/travel/TravelDetailSkeleton';

interface TravelDetailPageProps {
  params: {
    travelId: string;
  };
}

// Generate static params for build optimization
export async function generateStaticParams() {
  // Return placeholder params for static generation
  return [
    { travelId: 'placeholder' }
  ];
}

// Generate dynamic metadata
export async function generateMetadata({ params: _params }: TravelDetailPageProps) {
  return {
    title: '여행 상세 | Moonwave Travel',
    description: '여행 계획 상세 정보를 확인하고 관리하세요.',
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