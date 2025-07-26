import { Suspense } from 'react'
import MapPageClient from '@/components/features/map/MapPageClient'

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-travel-city"></div>
      </div>
    }>
      <MapPageClient />
    </Suspense>
  )
}

export async function generateMetadata() {
  return {
    title: '여행 지도 | Moonwave Travel',
    description: '여행 계획을 지도에서 확인하고 관리하세요.',
  }
}