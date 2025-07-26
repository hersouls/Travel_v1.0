'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PlanEditorProps {
  dayId: string;
  planId?: string | null;
  onClose: () => void;
}

export default function PlanEditor({
  dayId,
  planId,
  onClose,
}: PlanEditorProps) {
  const isEditing = !!planId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? '계획 수정' : '새 계획 추가'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="py-12 text-center">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              계획 편집기
            </h3>
            <p className="mb-6 text-gray-600 break-keep-ko">
              계획 편집 기능은 다음 단계에서 구현될 예정입니다.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>dayId: {dayId}</p>
              {planId && <p>planId: {planId}</p>}
            </div>
            <Button variant="default" className="mt-6" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
