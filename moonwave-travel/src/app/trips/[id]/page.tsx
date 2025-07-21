'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Map, MoreVertical, Plus, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { dataService } from '@/lib/dataService';
import { Trip, Plan } from '@/types';
import { formatDate, calculateTripDuration } from '@/utils/helpers';
import PlanCard from '@/components/PlanCard';

export default function TripDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalDays, setTotalDays] = useState(1);

  // 여행 데이터 로드
  useEffect(() => {
    const loadTripData = async () => {
      try {
        const tripResult = await dataService.getTripById(tripId);
        if (tripResult.success) {
          setTrip(tripResult.data);
          const duration = calculateTripDuration(tripResult.data.startDate, tripResult.data.endDate);
          setTotalDays(duration);
          setSelectedDay(1);
        } else {
          alert('여행 정보를 불러올 수 없습니다.');
          router.push('/');
        }
      } catch (error) {
        console.error('여행 데이터 로드 오류:', error);
        router.push('/');
      }
    };

    if (tripId) {
      loadTripData();
    }
  }, [tripId, router]);

  // 계획 데이터 로드
  useEffect(() => {
    const loadPlans = async () => {
      if (!tripId) return;
      
      try {
        const plansResult = await dataService.getPlansByTripId(tripId);
        if (plansResult.success) {
          setPlans(plansResult.data);
        }
      } catch (error) {
        console.error('계획 데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [tripId]);

  // 선택된 Day의 계획들 필터링
  const dayPlans = plans.filter(plan => plan.day === selectedDay);

  // Day별 계획 개수 계산
  const getDayPlanCount = (day: number) => {
    return plans.filter(plan => plan.day === day).length;
  };

  // 새 계획 추가
  const handleAddPlan = () => {
    router.push(`/trips/${tripId}/plans/create?day=${selectedDay}`);
  };

  // 전체 지도 보기
  const handleViewMap = () => {
    router.push(`/trips/${tripId}/map`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center animate-spin">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">여행 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">여행을 찾을 수 없습니다.</p>
          <Button onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-700">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">
              {trip.country}
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewMap}
              >
                <Map className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 여행 정보 */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              {trip.coverImage && (
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {trip.title}
                </h2>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(trip.startDate)} ~ {formatDate(trip.endDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>총 {totalDays}일간의 여행</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day 탭 */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {Array.from({ length: totalDays }, (_, index) => {
              const day = index + 1;
              const planCount = getDayPlanCount(day);
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200
                    ${selectedDay === day 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }
                  `}
                >
                  <span>Day {day}</span>
                  {planCount > 0 && (
                    <Badge 
                      variant={selectedDay === day ? 'secondary' : 'default'}
                      className={
                        selectedDay === day 
                          ? 'bg-white/20 text-white border-0' 
                          : 'bg-blue-100 text-blue-700'
                      }
                    >
                      {planCount}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 여행계획카드 리스트 */}
        <div className="space-y-4">
          {dayPlans.length > 0 ? (
            dayPlans
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onClick={() => router.push(`/trips/${tripId}/plans/${plan.id}`)}
                  showDetails={false}
                />
              ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Day {selectedDay}에 등록된 계획이 없습니다
                </h3>
                <p className="text-gray-600 mb-6">
                  첫 번째 계획을 추가해보세요!
                </p>
                <Button onClick={handleAddPlan} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-5 h-5 mr-2" />
                  계획 추가하기
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Floating Action Button */}
        {dayPlans.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button
              onClick={handleAddPlan}
              size="lg"
              className="w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}