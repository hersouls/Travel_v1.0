'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Map, MoreVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-natural-xlarge flex items-center justify-center animate-natural-bounce">
            <span className="text-2xl">🌍</span>
          </div>
          <p className="text-secondary-600 golden-text-body">여행 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary-600 golden-text-body">여행을 찾을 수 없습니다.</p>
          <Button onClick={() => router.push('/')} className="mt-4 natural-button">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-natural-soft border-b border-secondary-200 sticky top-0 z-50 backdrop-blur-sm rounded-natural-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="natural-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-secondary-900 golden-text-title">
              {trip.country}
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewMap}
                className="natural-button"
              >
                <Map className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="natural-button"
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
        <Card className="natural-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              {trip.coverImage && (
                <div className="w-20 h-20 rounded-natural-medium overflow-hidden flex-shrink-0">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-secondary-900 golden-text-title mb-2">
                  {trip.title}
                </h2>
                <p className="text-secondary-600 golden-text-body">
                  {formatDate(trip.startDate)} ~ {formatDate(trip.endDate)}
                </p>
                <p className="text-sm text-secondary-500 golden-text-body">
                  총 {totalDays}일간의 여행
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day 탭 */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: totalDays }, (_, index) => {
              const day = index + 1;
              const planCount = getDayPlanCount(day);
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-natural-medium font-medium whitespace-nowrap transition-all duration-200 natural-button
                    ${selectedDay === day 
                      ? 'bg-primary-500 text-white shadow-natural-medium' 
                      : 'bg-white text-secondary-700 hover:bg-secondary-50'
                    }
                  `}
                >
                  <span>Day {day}</span>
                  {planCount > 0 && (
                    <span className={`
                      text-xs px-2 py-1 rounded-natural-small
                      ${selectedDay === day 
                        ? 'bg-white/20 text-white' 
                        : 'bg-primary-100 text-primary-700'
                      }
                    `}>
                      {planCount}
                    </span>
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
            <Card className="natural-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-natural-medium flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2 golden-text-title">
                  Day {selectedDay}에 등록된 계획이 없습니다
                </h3>
                <p className="text-secondary-600 mb-6 golden-text-body">
                  첫 번째 계획을 추가해보세요!
                </p>
                <Button onClick={handleAddPlan} className="natural-button">
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
              className="w-14 h-14 rounded-full shadow-natural-floating natural-button"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}