'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Camera, Clock, Search, Link, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { planTypeConfig } from '@/lib/mockData';
import { dataService } from '@/lib/dataService';
import { Plan } from '@/types';
import { formatTime } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

export default function CreatePlanPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tripId = params.tripId as string;
  const day = parseInt(searchParams.get('day') || '1');

  const [plan, setPlan] = useState<Partial<Plan>>({
    day,
    photos: [],
    youtubeLink: '',
    startTime: '',
    endTime: '',
    type: 'other',
    placeName: '',
    memo: '',
    // Google Place Data
    googlePlaceId: '',
    address: '',
    latitude: 0,
    longitude: 0,
    openingHours: '',
    website: '',
    priceLevel: 0,
    rating: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // 사진 업로드 처리
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (photoFiles.length + files.length > 5) {
      alert('사진은 최대 5장까지 업로드 가능합니다.');
      return;
    }

    const newFiles = [...photoFiles, ...files];
    setPhotoFiles(newFiles);

    // 미리보기 생성
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 사진 삭제
  const handlePhotoDelete = (index: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // 유튜브 링크에서 비디오 ID 추출
  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // 유튜브 썸네일 URL 생성
  const getYouTubeThumbnail = (url: string) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  // 장소 검색
  const handlePlaceSearch = () => {
    // TODO: 장소 검색 화면으로 이동
    router.push(`/trips/${tripId}/plans/create/search?day=${day}`);
  };

  // 저장 가능 여부 확인
  const canSave = plan.placeName?.trim() && plan.startTime && plan.endTime;

  // 계획 저장
  const handleSavePlan = async () => {
    if (!canSave) return;

    setIsLoading(true);
    try {
      const planData = {
        ...plan,
        photos: photoPreviews, // 실제로는 이미지 업로드 후 URL로 변경
        tripId,
      };

      const result = await dataService.createPlan(planData);
      
      if (result.success) {
        router.push(`/trips/${tripId}`);
      } else {
        alert('계획 저장에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('계획 저장 오류:', error);
      alert('계획 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-natural-soft border-b border-secondary-200 sticky top-0 z-50 backdrop-blur-sm rounded-natural-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="natural-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-secondary-900 golden-text-title">
              계획 추가하기
            </h1>
            <Button
              onClick={handleSavePlan}
              disabled={!canSave || isLoading}
              className="natural-button"
            >
              {isLoading ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 사진 등록 */}
          <Card className="natural-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 golden-text-title">
                사진 등록
              </h3>
              <div className="space-y-4">
                {/* 사진 미리보기 */}
                {photoPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={preview}
                          alt={`사진 ${index + 1}`}
                          className="w-full h-full object-cover rounded-natural-medium"
                        />
                        <button
                          onClick={() => handlePhotoDelete(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center text-xs hover:bg-black/70 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 사진 업로드 버튼 */}
                {photoPreviews.length < 5 && (
                  <div
                    className="w-full h-32 border-2 border-dashed border-secondary-300 rounded-natural-medium flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/20 transition-all duration-300"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <Camera className="w-8 h-8 text-secondary-400 mb-2" />
                    <p className="text-secondary-600 text-sm golden-text-body">
                      사진 추가 ({photoPreviews.length}/5)
                    </p>
                  </div>
                )}

                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* 유튜브 링크 */}
          <Card className="natural-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 golden-text-title">
                유튜브 링크
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={plan.youtubeLink}
                    onChange={(e) => setPlan(prev => ({ ...prev, youtubeLink: e.target.value }))}
                    className="pl-10 rounded-natural-medium"
                  />
                </div>

                {/* 유튜브 썸네일 미리보기 */}
                {plan.youtubeLink && getYouTubeThumbnail(plan.youtubeLink) && (
                  <div className="aspect-video rounded-natural-medium overflow-hidden">
                    <img
                      src={getYouTubeThumbnail(plan.youtubeLink)!}
                      alt="유튜브 썸네일"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 시간 */}
          <Card className="natural-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 golden-text-title">
                시간
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <Input
                    type="time"
                    value={plan.startTime}
                    onChange={(e) => setPlan(prev => ({ ...prev, startTime: e.target.value }))}
                    className="pl-10 rounded-natural-medium"
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <Input
                    type="time"
                    value={plan.endTime}
                    onChange={(e) => setPlan(prev => ({ ...prev, endTime: e.target.value }))}
                    min={plan.startTime}
                    className="pl-10 rounded-natural-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 유형 */}
          <Card className="natural-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 golden-text-title">
                유형
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(planTypeConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setPlan(prev => ({ ...prev, type: key as any }))}
                    className={cn(
                      'flex flex-col items-center p-3 rounded-natural-medium transition-all duration-200',
                      plan.type === key
                        ? 'bg-primary-500 text-white shadow-natural-medium'
                        : 'bg-white text-secondary-700 hover:bg-secondary-50'
                    )}
                  >
                    <span className="text-2xl mb-1">{config.icon}</span>
                    <span className="text-xs font-medium">{config.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 장소명 */}
          <Card className="natural-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 golden-text-title">
                장소명
              </h3>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="장소명을 입력하거나 검색하세요"
                  value={plan.placeName}
                  onChange={(e) => setPlan(prev => ({ ...prev, placeName: e.target.value }))}
                  className="pr-12 rounded-natural-medium"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlaceSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 natural-button"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Google 지도 연동 정보 */}
          {plan.googlePlaceId && (
            <Card className="natural-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 golden-text-title">
                  장소 정보
                </h3>
                <div className="space-y-3">
                  {plan.address && (
                    <div>
                      <p className="text-sm font-medium text-secondary-700 golden-text-body">주소</p>
                      <p className="text-secondary-900 golden-text-body">{plan.address}</p>
                    </div>
                  )}
                  {plan.openingHours && (
                    <div>
                      <p className="text-sm font-medium text-secondary-700 golden-text-body">영업시간</p>
                      <p className="text-secondary-900 golden-text-body">{plan.openingHours}</p>
                    </div>
                  )}
                  {plan.website && (
                    <div>
                      <p className="text-sm font-medium text-secondary-700 golden-text-body">웹사이트</p>
                      <a
                        href={plan.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 golden-text-body"
                      >
                        {plan.website}
                      </a>
                    </div>
                  )}
                  {plan.rating > 0 && (
                    <div>
                      <p className="text-sm font-medium text-secondary-700 golden-text-body">평점</p>
                      <p className="text-secondary-900 golden-text-body">
                        {'★'.repeat(Math.floor(plan.rating))}
                        {'☆'.repeat(5 - Math.floor(plan.rating))} ({plan.rating})
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 메모 */}
          <Card className="natural-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 golden-text-title">
                메모
              </h3>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-secondary-400 w-5 h-5" />
                <Textarea
                  placeholder="메모를 입력하세요..."
                  value={plan.memo}
                  onChange={(e) => setPlan(prev => ({ ...prev, memo: e.target.value }))}
                  className="pl-10 rounded-natural-medium min-h-[100px]"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}