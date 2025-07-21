'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { countries } from '@/lib/mockData';
import { dataService } from '@/lib/dataService';
import { formatDate } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

export default function CreateTripPage() {
  const router = useRouter();
  const [tripTitle, setTripTitle] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState(countries);

  // 국가 검색 필터링
  const handleCountrySearch = (value: string) => {
    setSelectedCountry(value);
    if (value.trim()) {
      const filtered = countries.filter(country => 
        country.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCountries(filtered);
      setShowCountryDropdown(true);
    } else {
      setFilteredCountries(countries);
      setShowCountryDropdown(false);
    }
  };

  // 국가 선택
  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  // 이미지 업로드 처리
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 여행 기간 계산
  const calculateDuration = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  // 저장 가능 여부 확인
  const canSave = tripTitle.trim() && selectedCountry && startDate && endDate;

  // 여행 생성
  const handleCreateTrip = async () => {
    if (!canSave) return;

    setIsLoading(true);
    try {
      const duration = calculateDuration();
      if (duration > 30) {
        alert('여행 기간은 최대 30일까지 설정 가능합니다.');
        return;
      }

      const tripData = {
        tripTitle,
        country: selectedCountry,
        startDate,
        endDate,
        coverImage: coverImagePreview || '',
      };

      const result = await dataService.createTrip(tripData);
      
      if (result.success) {
        router.push(`/trips/${result.data.id}`);
      } else {
        alert('여행 생성에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('여행 생성 오류:', error);
      alert('여행 생성 중 오류가 발생했습니다.');
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
              새로운 여행 만들기
            </h1>
            <div className="w-10" /> {/* 균형을 위한 빈 공간 */}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 여행 대표 이미지 등록 */}
          <Card className="natural-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 golden-text-title">
                여행 대표 이미지
              </h3>
              <div className="relative">
                <div
                  className={cn(
                    'w-full h-48 rounded-natural-large border-2 border-dashed border-secondary-300 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-primary-400 hover:bg-primary-50/20',
                    coverImagePreview ? 'border-solid' : ''
                  )}
                  onClick={() => document.getElementById('cover-image')?.click()}
                >
                  {coverImagePreview ? (
                    <img
                      src={coverImagePreview}
                      alt="여행 대표 이미지"
                      className="w-full h-full object-cover rounded-natural-large"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                      <p className="text-secondary-600 golden-text-body">
                        이미지를 선택하거나 촬영하세요
                      </p>
                    </div>
                  )}
                </div>
                <input
                  id="cover-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* 여행 정보 입력 */}
          <Card className="natural-card">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-secondary-900 golden-text-title">
                여행 정보
              </h3>

              {/* 여행 제목 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700 golden-text-body">
                  여행 제목
                </label>
                <Input
                  type="text"
                  placeholder="여행 제목을 입력하세요"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="rounded-natural-medium"
                />
              </div>

              {/* 여행 국가 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700 golden-text-body">
                  여행 국가
                </label>
                <div className="relative">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="어디로 떠나시나요?"
                      value={selectedCountry}
                      onChange={(e) => handleCountrySearch(e.target.value)}
                      onFocus={() => setShowCountryDropdown(true)}
                      className="pl-10 rounded-natural-medium"
                    />
                  </div>
                  
                  {/* 국가 드롭다운 */}
                  {showCountryDropdown && filteredCountries.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-secondary-200 rounded-natural-medium shadow-natural-medium z-10 max-h-60 overflow-y-auto">
                      {filteredCountries.map((country) => (
                        <button
                          key={country}
                          onClick={() => handleCountrySelect(country)}
                          className="w-full px-4 py-3 text-left hover:bg-secondary-50 transition-colors duration-200 golden-text-body"
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 여행 일정 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700 golden-text-body">
                  여행 일정
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-10 rounded-natural-medium"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="pl-10 rounded-natural-medium"
                    />
                  </div>
                </div>
                
                {/* 여행 기간 표시 */}
                {calculateDuration() > 0 && (
                  <p className="text-sm text-secondary-600 golden-text-body">
                    여행 기간: {calculateDuration()}일
                    {calculateDuration() > 30 && (
                      <span className="text-error-600 ml-2">
                        (최대 30일까지 가능)
                      </span>
                    )}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 저장 버튼 */}
          <div className="flex justify-center">
            <Button
              onClick={handleCreateTrip}
              disabled={!canSave || isLoading || calculateDuration() > 30}
              className="w-full max-w-md natural-button"
              size="lg"
            >
              {isLoading ? '여행 생성 중...' : '여행 만들기'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}