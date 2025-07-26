'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Type, FileText, Image, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useCreateTravel } from '@/lib/hooks/useCreateTravel'
import { CreateTravelPlanForm } from '@/lib/types/database'

export default function CreateTravelForm() {
  const router = useRouter()
  const { createTravel, loading } = useCreateTravel()
  
  const [formData, setFormData] = useState<CreateTravelPlanForm>({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    description: '',
    cover_image_url: '',
    is_public: false
  })

  const [errors, setErrors] = useState<Partial<CreateTravelPlanForm>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateTravelPlanForm> = {}

    if (!formData.title.trim()) {
      newErrors.title = '여행 제목을 입력해주세요.'
    }

    if (!formData.destination.trim()) {
      newErrors.destination = '목적지를 입력해주세요.'
    }

    if (!formData.start_date) {
      newErrors.start_date = '출발일을 선택해주세요.'
    }

    if (!formData.end_date) {
      newErrors.end_date = '도착일을 선택해주세요.'
    }

    if (formData.start_date && formData.end_date && 
        new Date(formData.start_date) >= new Date(formData.end_date)) {
      newErrors.end_date = '도착일은 출발일보다 늦어야 합니다.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const travel = await createTravel(formData)
      router.push(`/travels/${travel.id}`)
    } catch (error) {
      console.error('여행 생성 실패:', error)
      // 에러 처리는 useCreateTravel 훅에서 담당
    }
  }

  const handleInputChange = (field: keyof CreateTravelPlanForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // 에러 클리어
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 여행 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Type className="w-4 h-4 inline mr-2" />
            여행 제목 *
          </label>
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="예: 제주도 힐링 여행"
            error={!!errors.title}
            helperText={errors.title}
          />
        </div>

        {/* 목적지 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            목적지 *
          </label>
          <Input
            type="text"
            value={formData.destination}
            onChange={(e) => handleInputChange('destination', e.target.value)}
            placeholder="예: 제주도, 서울, 부산"
            error={!!errors.destination}
            helperText={errors.destination}
          />
        </div>

        {/* 날짜 선택 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              출발일 *
            </label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              error={!!errors.start_date}
              helperText={errors.start_date}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              도착일 *
            </label>
            <Input
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
              error={!!errors.end_date}
              helperText={errors.end_date}
            />
          </div>
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            설명 (선택사항)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="여행에 대한 간단한 설명을 입력해주세요..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          />
        </div>

        {/* 커버 이미지 URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Image className="w-4 h-4 inline mr-2" />
            커버 이미지 URL (선택사항)
          </label>
          <Input
            type="url"
            value={formData.cover_image_url}
            onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* 공개/비공개 설정 */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_public"
            checked={formData.is_public}
            onChange={(e) => handleInputChange('is_public', e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
                      <label htmlFor="is_public" className="flex items-center text-sm font-medium text-gray-700">
              <Globe className="w-4 h-4 mr-2" />
              다른 사람들에게 공개하기
            </label>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="flex-1"
          >
            여행 만들기
          </Button>
        </div>
      </form>
    </Card>
  )
}