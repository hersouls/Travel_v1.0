'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Clock, Edit, Trash2, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Trip } from '@/types';
import { formatDate, calculateTripDuration } from '@/utils/helpers';
import { dataService } from '@/lib/dataService';



export default function TripDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true);
        const response = await dataService.getTripById(tripId);
        if (response.success && response.data) {
          setTrip(response.data);
        } else {
          // 여행을 찾을 수 없는 경우
          console.error('Trip not found');
        }
      } catch (error) {
        console.error('Failed to load trip:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      loadTrip();
    }
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            여행 정보를 불러오는 중...
          </h3>
          <p className="text-gray-600">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-error-100 to-error-200 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-error-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            여행을 찾을 수 없습니다
          </h3>
          <p className="text-gray-600 mb-8">요청하신 여행 정보가 존재하지 않습니다.</p>
          <Button 
            onClick={() => router.push('/')}
            className="bg-primary-500 hover:bg-primary-600"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const duration = calculateTripDuration(trip.start_date, trip.end_date);
  const plansCount = trip.plans?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.back()}
                className="mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                {trip.title}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // 즐겨찾기 토글 기능
                  console.log('즐겨찾기 토글:', trip.id);
                }}
              >
                <Star className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // 편집 페이지로 이동
                  router.push(`/trips/${trip.id}/edit`);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // 삭제 확인 다이얼로그
                  if (confirm('정말로 이 여행을 삭제하시겠습니까?')) {
                    console.log('여행 삭제:', trip.id);
                    router.push('/');
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 여행 정보 카드 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 왼쪽: 여행 정보 */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary" className="bg-black/70 text-white border-0">
                  {trip.country}
                </Badge>
                <Badge variant="outline">
                  {duration}일
                </Badge>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {trip.title}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 flex-shrink-0 text-primary-500" />
                  <span className="font-medium">{trip.country}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3 flex-shrink-0 text-primary-500" />
                  <span>
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3 flex-shrink-0 text-primary-500" />
                  <span className="font-medium">{duration}일 여행</span>
                </div>
              </div>
              

            </div>
            
            {/* 오른쪽: 커버 이미지 */}
            <div className="relative">
              {trip.cover_image ? (
                <div className="aspect-[4/3] relative overflow-hidden rounded-xl">
                  <img
                    src={trip.cover_image}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 계획 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              여행 계획 ({plansCount}개)
            </h3>
            <Button 
              onClick={() => {
                // 새 계획 추가 페이지로 이동
                router.push(`/trips/${trip.id}/plans/create`);
              }}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              새 계획 추가
            </Button>
          </div>
          
          {plansCount > 0 ? (
            <div className="space-y-4">
              {trip.plans?.map((plan, index) => (
                <div key={plan.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Day {plan.day}: {plan.place_name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {plan.address || plan.place_name} • {plan.type}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        // 계획 상세 페이지로 이동
                        router.push(`/trips/${trip.id}/plans/${plan.id}`);
                      }}
                    >
                      자세히 보기
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                아직 계획이 없습니다
              </h4>
              <p className="text-gray-600 mb-6">
                첫 번째 여행 계획을 만들어보세요!
              </p>
              <Button 
                onClick={() => {
                  // 새 계획 추가 페이지로 이동
                  router.push(`/trips/${trip.id}/plans/create`);
                }}
                className="bg-primary-500 hover:bg-primary-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                첫 계획 만들기
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}