import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import CreateTravelForm from '@/components/features/travel/CreateTravelForm'

export default function NewTravelPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/travels"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-korean-tight">
            새 여행 만들기
          </h1>
          <p className="text-gray-600 mt-2 break-keep-ko">
            새로운 여행 계획을 시작해보세요
          </p>
        </div>
      </div>

      {/* 폼 컨테이너 */}
      <div className="max-w-2xl mx-auto">
        <CreateTravelForm />
      </div>
    </div>
  )
}

export const metadata = {
  title: '새 여행 만들기 | Moonwave Travel',
  description: '새로운 여행 계획을 만들어보세요.',
}