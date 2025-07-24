'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Clock, Edit, Trash2, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Trip } from '@/types';
import { formatDate, calculateTripDuration } from '@/utils/helpers';
import { dataService } from '@/lib/dataService';

function TripDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get('id');
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true);
        if (!tripId) {
          console.error('No trip ID provided');
          return;
        }
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
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/trip-detail/edit?id=${tripId}`)}
              >
                <Edit className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  if (confirm('정말로 이 여행을 삭제하시겠습니까?')) {
                    // 삭제 로직
                    router.push('/');
                  }
                }}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 여행 정보 카드 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{trip.title}</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{trip.country}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{duration}일</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="text-right">
                <Badge variant="default">
                  진행중
                </Badge>
              </div>
              <div className="text-right mt-4">
                <p className="text-sm text-gray-500">여행 기간</p>
                <p className="text-2xl font-bold text-gray-900">
                  {duration}일
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 계획 목록 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              여행 계획 ({plansCount})
            </h3>
            <Button 
              onClick={() => router.push(`/plan-create?tripId=${tripId}`)}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              계획 추가
            </Button>
          </div>

          {trip.plans && trip.plans.length > 0 ? (
            <div className="space-y-4">
              {trip.plans.map((plan, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{plan.place_name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{plan.memo || plan.type}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Day {plan.day}
                        </span>
                        <span className="text-xs text-gray-500">
                          {plan.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push(`/plan-edit?tripId=${tripId}&planIndex=${index}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (confirm('이 계획을 삭제하시겠습니까?')) {
                            // 삭제 로직
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                아직 계획이 없습니다
              </h4>
              <p className="text-gray-600 mb-6">
                첫 번째 여행 계획을 추가해보세요!
              </p>
              <Button 
                onClick={() => router.push(`/plan-create?tripId=${tripId}`)}
                className="bg-primary-500 hover:bg-primary-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                계획 추가하기
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function TripDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            페이지를 불러오는 중...
          </h3>
          <p className="text-gray-600">잠시만 기다려주세요</p>
        </div>
      </div>
    }>
      <TripDetailContent />
    </Suspense>
  );
}