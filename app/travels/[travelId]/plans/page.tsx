import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import DayPlansList from '@/components/features/day-plan/DayPlansList'
import DayPlansListSkeleton from '@/components/features/day-plan/DayPlansListSkeleton'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface DayPlansPageProps {
  params: {
    travelId: string
  }
}

export default function DayPlansPage({ params }: DayPlansPageProps) {
  const { travelId } = params

  if (!travelId) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href={`/travels/${travelId}`}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-korean-tight">
            일정별 계획
          </h1>
          <p className="text-gray-600 mt-2 break-keep-ko">
            여행 일정을 계획하고 관리하세요
          </p>
        </div>
        <Button 
          variant="default" 
          size="lg" 
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          새 계획 추가
        </Button>
      </div>

      {/* Day별 계획 목록 */}
      <Suspense fallback={<DayPlansListSkeleton />}>
        <DayPlansList travelId={travelId} />
      </Suspense>
    </div>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params: _params }: DayPlansPageProps) {
  return {
    title: `일정별 계획 | Moonwave Travel`,
    description: '여행 일정을 계획하고 관리하세요.',
  }
}