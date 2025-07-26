'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Type,
  FileText,
  Image,
  Globe,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useTravelDetail } from '@/lib/hooks/useTravelDetail';
import { useUpdateTravel } from '@/lib/hooks/useUpdateTravel';
import { useDeleteTravel } from '@/lib/hooks/useDeleteTravel';
import { CreateTravelPlanForm } from '@/lib/types/database';

interface EditTravelFormProps {
  travelId: string;
}

export default function EditTravelForm({ travelId }: EditTravelFormProps) {
  const router = useRouter();
  const {
    data: travel,
    loading: fetchLoading,
    error: fetchError,
  } = useTravelDetail(travelId);
  const { updateTravel, loading: updateLoading } = useUpdateTravel();
  const { deleteTravel, loading: deleteLoading } = useDeleteTravel();

  const [formData, setFormData] = useState<CreateTravelPlanForm>({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    description: '',
    cover_image_url: '',
    is_public: false,
  });

  const [errors, setErrors] = useState<Partial<CreateTravelPlanForm>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 여행 데이터로 폼 초기화
  useEffect(() => {
    if (travel) {
      setFormData({
        title: travel.title,
        destination: travel.destination,
        start_date: travel.start_date,
        end_date: travel.end_date,
        description: travel.description || '',
        cover_image_url: travel.cover_image_url || '',
        is_public: travel.is_public,
      });
    }
  }, [travel]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateTravelPlanForm> = {};

    if (!formData.title.trim()) {
      newErrors.title = '여행 제목을 입력해주세요.';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = '목적지를 입력해주세요.';
    }

    if (!formData.start_date) {
      newErrors.start_date = '출발일을 선택해주세요.';
    }

    if (!formData.end_date) {
      newErrors.end_date = '도착일을 선택해주세요.';
    }

    if (
      formData.start_date &&
      formData.end_date &&
      new Date(formData.start_date) >= new Date(formData.end_date)
    ) {
      newErrors.end_date = '도착일은 출발일보다 늦어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateTravel(travelId, {
        title: formData.title.trim(),
        destination: formData.destination.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        description: formData.description?.trim() || null,
        cover_image_url: formData.cover_image_url?.trim() || null,
        is_public: formData.is_public,
      });
      router.push(`/travels/${travelId}`);
    } catch (error) {
      console.error('여행 수정 실패:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTravel(travelId);
      router.push('/travels');
    } catch (error) {
      console.error('여행 삭제 실패:', error);
    }
  };

  const handleInputChange = (
    field: keyof CreateTravelPlanForm,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 에러 클리어
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (fetchLoading) {
    return <div>여행 정보를 불러오는 중...</div>;
  }

  if (fetchError) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-red-600">
          여행 정보를 불러오는데 실패했습니다.
        </p>
        <p className="text-sm text-gray-500 break-keep-ko">{fetchError}</p>
      </div>
    );
  }

  if (!travel) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">여행 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      {/* 헤더 */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href={`/travels/${travelId}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-korean-tight">
            여행 계획 수정
          </h1>
          <p className="mt-2 text-gray-600 break-keep-ko">
            여행 정보를 수정하세요
          </p>
        </div>
        <Button
          variant="outline"
          size="default"
          className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="h-4 w-4" />
          삭제
        </Button>
      </div>

      {/* 폼 컨테이너 */}
      <div className="mx-auto max-w-2xl">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 여행 제목 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <Type className="mr-2 inline h-4 w-4" />
                여행 제목 *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="예: 제주도 힐링 여행"
              />
            </div>

            {/* 목적지 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <MapPin className="mr-2 inline h-4 w-4" />
                목적지 *
              </label>
              <Input
                type="text"
                value={formData.destination}
                onChange={(e) =>
                  handleInputChange('destination', e.target.value)
                }
                placeholder="예: 제주도, 서울, 부산"
                error={!!errors.destination}
              />
            </div>

            {/* 날짜 선택 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <Calendar className="mr-2 inline h-4 w-4" />
                  출발일 *
                </label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    handleInputChange('start_date', e.target.value)
                  }
                  error={!!errors.start_date}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <Calendar className="mr-2 inline h-4 w-4" />
                  도착일 *
                </label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    handleInputChange('end_date', e.target.value)
                  }
                  error={!!errors.end_date}
                />
              </div>
            </div>

            {/* 설명 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <FileText className="mr-2 inline h-4 w-4" />
                설명 (선택사항)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder="여행에 대한 간단한 설명을 입력해주세요..."
                rows={3}
                className="focus:ring-primary-500 focus:border-primary-500 w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2"
              />
            </div>

            {/* 커버 이미지 URL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="mr-2 inline h-4 w-4" aria-hidden="true" />
                커버 이미지 URL (선택사항)
              </label>
              <Input
                type="url"
                value={formData.cover_image_url}
                onChange={(e) =>
                  handleInputChange('cover_image_url', e.target.value)
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* 공개/비공개 설정 */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) =>
                  handleInputChange('is_public', e.target.checked)
                }
                className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
              />
              <label
                htmlFor="is_public"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <Globe className="mr-2 h-4 w-4" />
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
                variant="default"
                size="lg"
                loading={updateLoading}
                className="flex-1"
              >
                수정 완료
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              여행 계획 삭제
            </h3>
            <p className="mb-6 text-gray-600 break-keep-ko">
              정말로 이 여행 계획을 삭제하시겠습니까? 모든 일정과 계획이 함께
              삭제되며, 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="default"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                variant="default"
                size="default"
                loading={deleteLoading}
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
