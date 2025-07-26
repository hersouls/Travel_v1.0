'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, FileText, Image, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface CreateTravelFormProps {
  onSubmit: (data: CreateTravelFormData) => Promise<void>;
  loading?: boolean;
}

export interface CreateTravelFormData {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description?: string;
  cover_image_url?: string;
  is_public: boolean;
}

export function CreateTravelForm({ onSubmit, loading = false }: CreateTravelFormProps) {
  const [formData, setFormData] = useState<CreateTravelFormData>({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    description: '',
    cover_image_url: '',
    is_public: false,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTravelFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTravelFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = '여행 제목을 입력해주세요.';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = '목적지를 입력해주세요.';
    }

    if (!formData.start_date) {
      newErrors.start_date = '시작일을 선택해주세요.';
    }

    if (!formData.end_date) {
      newErrors.end_date = '종료일을 선택해주세요.';
    }

    if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
      newErrors.end_date = '종료일은 시작일보다 늦어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('폼 제출 실패:', error);
    }
  };

  const handleInputChange = (field: keyof CreateTravelFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* 기본 정보 섹션 */}
      <div>
        <h2 className={cn(
          'font-pretendard font-semibold text-lg text-gray-900 mb-4',
          'tracking-korean-tight break-keep-ko'
        )}>
          기본 정보
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 여행 제목 */}
          <div className="md:col-span-2">
            <label className={cn(
              'block font-pretendard font-medium text-sm text-gray-700 mb-2',
              'tracking-korean-normal'
            )}>
              여행 제목 *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="예: 제주도 힐링 여행"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={cn(
                  'pl-10',
                  errors.title && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* 목적지 */}
          <div className="md:col-span-2">
            <label className={cn(
              'block font-pretendard font-medium text-sm text-gray-700 mb-2',
              'tracking-korean-normal'
            )}>
              목적지 *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="예: 제주도, 서울, 부산"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className={cn(
                  'pl-10',
                  errors.destination && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
              />
            </div>
            {errors.destination && (
              <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
            )}
          </div>

          {/* 시작일 */}
          <div>
            <label className={cn(
              'block font-pretendard font-medium text-sm text-gray-700 mb-2',
              'tracking-korean-normal'
            )}>
              시작일 *
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className={cn(
                  'pl-10',
                  errors.start_date && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
              />
            </div>
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
            )}
          </div>

          {/* 종료일 */}
          <div>
            <label className={cn(
              'block font-pretendard font-medium text-sm text-gray-700 mb-2',
              'tracking-korean-normal'
            )}>
              종료일 *
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className={cn(
                  'pl-10',
                  errors.end_date && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
              />
            </div>
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
            )}
          </div>
        </div>
      </div>

      {/* 상세 정보 섹션 */}
      <div>
        <h2 className={cn(
          'font-pretendard font-semibold text-lg text-gray-900 mb-4',
          'tracking-korean-tight break-keep-ko'
        )}>
          상세 정보
        </h2>
        
        <div className="space-y-4">
          {/* 여행 설명 */}
          <div>
            <label className={cn(
              'block font-pretendard font-medium text-sm text-gray-700 mb-2',
              'tracking-korean-normal'
            )}>
              여행 설명
            </label>
            <Textarea
              placeholder="이번 여행에 대한 간단한 설명을 적어보세요..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          {/* 커버 이미지 URL */}
          <div>
            <label className={cn(
              'block font-pretendard font-medium text-sm text-gray-700 mb-2',
              'tracking-korean-normal'
            )}>
              커버 이미지 URL
            </label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.cover_image_url}
                onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              여행을 대표하는 이미지 URL을 입력하세요. (선택사항)
            </p>
          </div>
        </div>
      </div>

      {/* 공개 설정 섹션 */}
      <div>
        <h2 className={cn(
          'font-pretendard font-semibold text-lg text-gray-900 mb-4',
          'tracking-korean-tight break-keep-ko'
        )}>
          공개 설정
        </h2>
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('is_public', false)}
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg border transition-all',
              !formData.is_public
                ? 'border-moonwave-primary bg-moonwave-blue-50 text-moonwave-primary'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            )}
          >
            <Lock className="w-5 h-5" />
            <div>
              <p className={cn(
                'font-pretendard font-medium text-sm',
                'tracking-korean-normal break-keep-ko'
              )}>
                비공개
              </p>
              <p className={cn(
                'font-pretendard text-xs text-gray-500',
                'tracking-korean-normal break-keep-ko'
              )}>
                나만 볼 수 있습니다
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleInputChange('is_public', true)}
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg border transition-all',
              formData.is_public
                ? 'border-moonwave-primary bg-moonwave-blue-50 text-moonwave-primary'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            )}
          >
            <Globe className="w-5 h-5" />
            <div>
              <p className={cn(
                'font-pretendard font-medium text-sm',
                'tracking-korean-normal break-keep-ko'
              )}>
                공개
              </p>
              <p className={cn(
                'font-pretendard text-xs text-gray-500',
                'tracking-korean-normal break-keep-ko'
              )}>
                다른 사람들도 볼 수 있습니다
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          취소
        </Button>
        
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          여행 만들기
        </Button>
      </div>
    </form>
  );
}