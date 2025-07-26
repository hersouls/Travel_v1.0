'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PlanEditorProps {
  dayId: string
  planId?: string | null
  onClose: () => void
}

export default function PlanEditor({ dayId, planId, onClose }: PlanEditorProps) {
  const isEditing = !!planId

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? '계획 수정' : '새 계획 추가'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              계획 편집기
            </h3>
            <p className="text-gray-600 mb-6 break-keep-ko">
              계획 편집 기능은 다음 단계에서 구현될 예정입니다.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>dayId: {dayId}</p>
              {planId && <p>planId: {planId}</p>}
            </div>
            <Button 
              variant="default" 
              className="mt-6"
              onClick={onClose}
            >
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}