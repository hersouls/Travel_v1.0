import { Suspense } from 'react'
import MapPageClient from '@/components/features/map/MapPageClient'

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">지도 로딩 중...</p>
        </div>
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