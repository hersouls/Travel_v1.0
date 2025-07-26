import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import TravelDetailView from '@/components/features/travel/TravelDetailView'
import TravelDetailSkeleton from '@/components/features/travel/TravelDetailSkeleton'

interface TravelDetailPageProps {
  params: {
    travelId: string
  }
}

export default function TravelDetailPage({ params }: TravelDetailPageProps) {
  const { travelId } = params

  if (!travelId) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<TravelDetailSkeleton />}>
        <TravelDetailView travelId={travelId} />
      </Suspense>
    </div>
  )
}

export async function generateStaticParams() {
  // 동적 라우트이므로 빈 배열 반환 (runtime에서 생성됨)
  return []
}

export async function generateMetadata({ params: _params }: TravelDetailPageProps) {
  return {
    title: `여행 상세 | Moonwave Travel`,
    description: '여행 계획 상세 정보를 확인하세요.',
  }
}