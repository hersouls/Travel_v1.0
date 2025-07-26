'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useTravelPlans } from '@/hooks/useTravelPlans';
import { MapPin, Calendar, Users, Upload, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormData {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description: string;
  is_public: boolean;
  collaborators: string[];
}

interface FormErrors {
  title?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  collaborators?: string;
}

export interface CreateTravelFormProps {
  onSuccess?: (travelId: string) => void;
  onCancel?: () => void;
  className?: string;
}

export const CreateTravelForm = React.forwardRef<HTMLFormElement, CreateTravelFormProps>(
  ({ onSuccess, onCancel, className, ...props }, ref) => {
    const router = useRouter();
    const { createTravelPlan } = useTravelPlans();
    
    const [formData, setFormData] = useState<FormData>({
      title: '',
      destination: '',
      start_date: '',
      end_date: '',
      description: '',
      is_public: false,
      collaborators: []
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newCollaborator, setNewCollaborator] = useState('');

    // 폼 유효성 검사
    const validateForm = (): boolean => {
      const newErrors: FormErrors = {};

      if (!formData.title.trim()) {
        newErrors.title = '여행 제목을 입력해주세요';
      } else if (formData.title.length < 2) {
        newErrors.title = '여행 제목은 2글자 이상 입력해주세요';
      } else if (formData.title.length > 100) {
        newErrors.title = '여행 제목은 100글자 이하로 입력해주세요';
      }

      if (!formData.destination.trim()) {
        newErrors.destination = '목적지를 입력해주세요';
      } else if (formData.destination.length < 2) {
        newErrors.destination = '목적지는 2글자 이상 입력해주세요';
      }

      if (!formData.start_date) {
        newErrors.start_date = '출발일을 선택해주세요';
      }

      if (!formData.end_date) {
        newErrors.end_date = '도착일을 선택해주세요';
      } else if (formData.start_date && formData.end_date) {
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);
        
        if (endDate < startDate) {
          newErrors.end_date = '도착일은 출발일보다 뒤여야 합니다';
        }
        
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 365) {
          newErrors.end_date = '여행 기간은 1년을 초과할 수 없습니다';
        }
      }

      if (formData.description.length > 1000) {
        newErrors.description = '여행 설명은 1000글자 이하로 입력해주세요';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // 폼 제출 처리
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const result = await createTravelPlan({
          title: formData.title.trim(),
          destination: formData.destination.trim(),
          start_date: formData.start_date,
          end_date: formData.end_date,
          description: formData.description.trim() || null,
          is_public: formData.is_public,
          collaborators: formData.collaborators.length > 0 ? formData.collaborators : null,
          status: 'planning'
        });

        if (result) {
          onSuccess?.(result.id);
          router.push(`/travels/${result.id}`);
        }
      } catch (error) {
        console.error('여행 생성 실패:', error);
        setErrors({ title: '여행 생성에 실패했습니다. 다시 시도해주세요.' });
      } finally {
        setIsSubmitting(false);
      }
    };

    // 입력 필드 변경 처리
    const handleInputChange = (field: keyof FormData) => (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // 에러 클리어
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    };

    // 협력자 추가
    const addCollaborator = () => {
      const email = newCollaborator.trim();
      if (email && !formData.collaborators.includes(email)) {
        setFormData(prev => ({
          ...prev,
          collaborators: [...prev.collaborators, email]
        }));
        setNewCollaborator('');
      }
    };

    // 협력자 제거
    const removeCollaborator = (email: string) => {
      setFormData(prev => ({
        ...prev,
        collaborators: prev.collaborators.filter(c => c !== email)
      }));
    };

    // 오늘 날짜 (최소 날짜로 사용)
    const today = new Date().toISOString().split('T')[0];

    return (
      <div className="@container/form max-w-2xl mx-auto">
        <form
          ref={ref}
          onSubmit={handleSubmit}
          className={cn(
            'font-pretendard antialiased',
            'bg-white rounded-xl shadow-soft border border-gray-200',
            'p-6 @lg/form:p-8 space-y-6',
            className
          )}
          {...props}
        >
          {/* 헤더 */}
          <div className="text-center @lg/form:text-left mb-6">
            <h2 className={cn(
              'font-pretendard font-bold text-2xl @lg/form:text-3xl text-gray-900 mb-2',
              'tracking-korean-tight break-keep-ko'
            )}>
              새 여행 계획 만들기
            </h2>
            <p className={cn(
              'font-pretendard text-gray-600',
              'tracking-korean-normal break-keep-ko'
            )}>
              특별한 여행을 계획해보세요
            </p>
          </div>

          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className={cn(
              'font-pretendard font-semibold text-lg text-gray-900',
              'tracking-korean-tight break-keep-ko'
            )}>
              기본 정보
            </h3>

            {/* 여행 제목 */}
            <div>
              <label className={cn(
                'block font-pretendard font-medium text-sm text-gray-700 mb-2',
                'tracking-korean-normal'
              )}>
                여행 제목 <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={handleInputChange('title')}
                placeholder="예: 제주도 힐링 여행"
                error={!!errors.title}
                className="w-full"
              />
              {errors.title && (
                <p className={cn(
                  'mt-1 text-sm text-red-600',
                  'font-pretendard tracking-korean-normal'
                )}>
                  {errors.title}
                </p>
              )}
            </div>

            {/* 목적지 */}
            <div>
              <label className={cn(
                'block font-pretendard font-medium text-sm text-gray-700 mb-2',
                'tracking-korean-normal'
              )}>
                목적지 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={formData.destination}
                  onChange={handleInputChange('destination')}
                  placeholder="예: 제주도, 서울, 부산"
                  error={!!errors.destination}
                  className="w-full pl-10"
                />
              </div>
              {errors.destination && (
                <p className={cn(
                  'mt-1 text-sm text-red-600',
                  'font-pretendard tracking-korean-normal'
                )}>
                  {errors.destination}
                </p>
              )}
            </div>
          </div>

          {/* 여행 일정 */}
          <div className="space-y-4">
            <h3 className={cn(
              'font-pretendard font-semibold text-lg text-gray-900',
              'tracking-korean-tight break-keep-ko'
            )}>
              여행 일정
            </h3>

            <div className="grid @md/form:grid-cols-2 grid-cols-1 gap-4">
              {/* 출발일 */}
              <div>
                <label className={cn(
                  'block font-pretendard font-medium text-sm text-gray-700 mb-2',
                  'tracking-korean-normal'
                )}>
                  출발일 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange('start_date')}
                  min={today}
                  error={!!errors.start_date}
                  className="w-full"
                />
                {errors.start_date && (
                  <p className={cn(
                    'mt-1 text-sm text-red-600',
                    'font-pretendard tracking-korean-normal'
                  )}>
                    {errors.start_date}
                  </p>
                )}
              </div>

              {/* 도착일 */}
              <div>
                <label className={cn(
                  'block font-pretendard font-medium text-sm text-gray-700 mb-2',
                  'tracking-korean-normal'
                )}>
                  도착일 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange('end_date')}
                  min={formData.start_date || today}
                  error={!!errors.end_date}
                  className="w-full"
                />
                {errors.end_date && (
                  <p className={cn(
                    'mt-1 text-sm text-red-600',
                    'font-pretendard tracking-korean-normal'
                  )}>
                    {errors.end_date}
                  </p>
                )}
              </div>
            </div>

            {/* 기간 표시 */}
            {formData.start_date && formData.end_date && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center text-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className={cn(
                    'font-pretendard text-sm font-medium',
                    'tracking-korean-normal'
                  )}>
                    총 {Math.ceil((new Date(formData.end_date).getTime() - new Date(formData.start_date).getTime()) / (1000 * 60 * 60 * 24) + 1)}일 여행
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 여행 설명 */}
          <div>
            <label className={cn(
              'block font-pretendard font-medium text-sm text-gray-700 mb-2',
              'tracking-korean-normal'
            )}>
              여행 설명 (선택)
            </label>
            <textarea
              value={formData.description}
              onChange={handleInputChange('description')}
              placeholder="이번 여행에 대한 설명을 입력해주세요"
              rows={4}
              className={cn(
                'w-full px-3 py-2 border border-gray-300 rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-moonwave-primary focus:border-moonwave-primary',
                'font-pretendard text-sm tracking-korean-normal break-keep-ko',
                'resize-none'
              )}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{errors.description && <span className="text-red-600">{errors.description}</span>}</span>
              <span className={cn(
                'font-pretendard tracking-korean-normal',
                formData.description.length > 900 ? 'text-red-600' : ''
              )}>
                {formData.description.length}/1000
              </span>
            </div>
          </div>

          {/* 협력자 설정 */}
          <div className="space-y-4">
            <h3 className={cn(
              'font-pretendard font-semibold text-lg text-gray-900',
              'tracking-korean-tight break-keep-ko'
            )}>
              협력자 초대 (선택)
            </h3>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  value={newCollaborator}
                  onChange={(e) => setNewCollaborator(e.target.value)}
                  placeholder="이메일 주소 입력"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCollaborator())}
                />
              </div>
              <Button 
                type="button" 
                onClick={addCollaborator}
                variant="outline"
                disabled={!newCollaborator.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.collaborators.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.collaborators.map((email) => (
                  <Badge
                    key={email}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Users className="w-3 h-3" />
                    {email}
                    <button
                      type="button"
                      onClick={() => removeCollaborator(email)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 공개 설정 */}
          <div className="space-y-4">
            <h3 className={cn(
              'font-pretendard font-semibold text-lg text-gray-900',
              'tracking-korean-tight break-keep-ko'
            )}>
              공개 설정
            </h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={handleInputChange('is_public')}
                className="w-4 h-4 text-moonwave-primary border-gray-300 rounded focus:ring-moonwave-primary"
              />
              <span className={cn(
                'font-pretendard text-sm text-gray-700',
                'tracking-korean-normal break-keep-ko'
              )}>
                다른 사용자에게 이 여행 계획을 공개합니다
              </span>
            </label>
          </div>

          {/* 액션 버튼 */}
          <div className="flex @md/form:flex-row flex-col gap-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="@md/form:flex-1 w-full"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  생성 중...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  여행 계획 만들기
                </>
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="@md/form:flex-1 w-full"
              >
                취소
              </Button>
            )}
          </div>
        </form>
      </div>
    );
  }
);

CreateTravelForm.displayName = 'CreateTravelForm';