'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, MapPin, Star, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { mockSearchPlaces, mockGooglePlaces } from '@/lib/mockData';
import { cn } from '@/utils/helpers';

interface Place {
  place_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  opening_hours: string;
  website: string;
  price_level: number;
  photos: string[];
}

export default function PlaceSearchPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tripId = params.tripId as string;
  const day = searchParams.get('day') || '1';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // 검색 실행
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockSearchPlaces(query);
      if (result.success) {
        setSearchResults(result.data);
      }
    } catch (error) {
      console.error('장소 검색 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색어 변경 시 디바운스 적용
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // 장소 선택
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    
    // 선택된 장소 정보를 이전 화면으로 전달
    const placeData = {
      googlePlaceId: place.place_id,
      placeName: place.name,
      address: place.address,
      latitude: place.latitude,
      longitude: place.longitude,
      rating: place.rating,
      openingHours: place.opening_hours,
      website: place.website,
      priceLevel: place.price_level,
    };

    // URL 파라미터로 전달
    const params = new URLSearchParams({
      ...placeData,
      day,
    });

    router.push(`/trips/${tripId}/plans/create?${params.toString()}`);
  };

  // 가격 수준 표시
  const getPriceLevelText = (level: number) => {
    return '$'.repeat(level);
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
              장소 검색
            </h1>
            <div className="w-10" /> {/* 균형을 위한 빈 공간 */}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 입력 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="장소명을 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 rounded-natural-medium"
              autoFocus
            />
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-natural-xlarge flex items-center justify-center animate-natural-bounce">
                <Search className="w-8 h-8 text-primary-500" />
              </div>
              <p className="text-secondary-600 golden-text-body">장소를 검색하는 중...</p>
            </div>
          ) : searchQuery.trim() && searchResults.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-natural-xlarge flex items-center justify-center">
                <MapPin className="w-8 h-8 text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2 golden-text-title">
                검색 결과가 없습니다
              </h3>
              <p className="text-secondary-600 golden-text-body">
                다른 키워드로 검색해보세요
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((place) => (
              <Card
                key={place.place_id}
                className="natural-card cursor-pointer hover:shadow-natural-strong hover:scale-[1.02] transition-all duration-300"
                onClick={() => handlePlaceSelect(place)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* 장소 이미지 */}
                    {place.photos && place.photos.length > 0 && (
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-natural-medium overflow-hidden">
                          <img
                            src={place.photos[0]}
                            alt={place.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* 장소 정보 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary-900 golden-text-title line-clamp-2 mb-2">
                        {place.name}
                      </h3>
                      
                      <div className="space-y-2">
                        {/* 주소 */}
                        <div className="flex items-center space-x-2 text-sm text-secondary-600 golden-text-body">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="line-clamp-1">{place.address}</span>
                        </div>

                        {/* 평점 */}
                        <div className="flex items-center space-x-2 text-sm text-secondary-600 golden-text-body">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{place.rating}</span>
                          {place.price_level > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-green-600 font-medium">
                                {getPriceLevelText(place.price_level)}
                              </span>
                            </>
                          )}
                        </div>

                        {/* 영업시간 */}
                        {place.opening_hours && (
                          <div className="flex items-center space-x-2 text-sm text-secondary-600 golden-text-body">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>{place.opening_hours}</span>
                          </div>
                        )}

                        {/* 웹사이트 */}
                        {place.website && (
                          <div className="flex items-center space-x-2 text-sm text-primary-600 golden-text-body">
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            <span className="line-clamp-1">웹사이트</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 선택 표시 */}
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full border-2 border-secondary-300 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-natural-xlarge flex items-center justify-center">
                <Search className="w-8 h-8 text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2 golden-text-title">
                장소를 검색해보세요
              </h3>
              <p className="text-secondary-600 golden-text-body">
                관광지, 맛집, 숙소 등을 검색할 수 있습니다
              </p>
            </div>
          )}
        </div>

        {/* 추천 장소 (검색어가 없을 때) */}
        {!searchQuery.trim() && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 golden-text-title">
              추천 장소
            </h3>
            <div className="space-y-4">
              {mockGooglePlaces.slice(0, 3).map((place) => (
                <Card
                  key={place.place_id}
                  className="natural-card cursor-pointer hover:shadow-natural-strong hover:scale-[1.02] transition-all duration-300"
                  onClick={() => handlePlaceSelect(place)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {place.photos && place.photos.length > 0 && (
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-natural-medium overflow-hidden">
                            <img
                              src={place.photos[0]}
                              alt={place.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-secondary-900 golden-text-title line-clamp-2 mb-2">
                          {place.name}
                        </h3>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-secondary-600 golden-text-body">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="line-clamp-1">{place.address}</span>
                          </div>

                          <div className="flex items-center space-x-2 text-sm text-secondary-600 golden-text-body">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{place.rating}</span>
                            {place.price_level > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-green-600 font-medium">
                                  {getPriceLevelText(place.price_level)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}