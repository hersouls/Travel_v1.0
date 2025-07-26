import { Suspense } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import TravelList from '@/components/features/travel/TravelList'
import TravelListSkeleton from '@/components/features/travel/TravelListSkeleton'
import Link from 'next/link'

export default function TravelsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 섹션 */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-korean-tight">
              내 여행 계획
            </h1>
            <p className="text-gray-600 mt-2 break-keep-ko">
              여행 계획을 만들고 관리해보세요
            </p>
          </div>
          <Link href="/travels/new">
            <Button variant="primary" size="lg" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              새 여행 만들기
            </Button>
          </Link>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="여행지나 제목으로 검색..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="md" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              필터
            </Button>
          </div>
        </div>
      </div>

      {/* 여행 목록 */}
      <Suspense fallback={<TravelListSkeleton />}>
        <TravelList />
      </Suspense>
    </div>
  )
}

export const metadata = {
  title: '내 여행 계획 | Moonwave Travel',
  description: '여행 계획을 만들고 관리하세요.',
}