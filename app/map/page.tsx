import { Suspense } from 'react';
import MapPageClient from '@/components/features/map/MapPageClient';

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="border-travel-city h-32 w-32 animate-spin rounded-full border-b-2"></div>
        </div>
      }
    >
      <MapPageClient />
    </Suspense>
  );
}

export async function generateMetadata() {
  return {
    title: '여행 지도 | Moonwave Travel',
    description: '여행 계획을 지도에서 확인하고 관리하세요.',
  };
}
