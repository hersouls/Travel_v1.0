'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { dataService } from '@/lib/dataService';
import { Trip, Plan } from '@/types';
import { planTypeConfig } from '@/lib/mockData';
import { formatTime } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

export default function TripMapPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  // 여행 데이터 로드
  useEffect(() => {
    const loadTripData = async () => {
      try {
        const tripResult = await dataService.getTripById(tripId);
        if (tripResult.success && tripResult.data) {
          setTrip(tripResult.data);
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
        if (plansResult.success && plansResult.data) {
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

  // 지도 중심점 계산 (현재 사용하지 않음)
  // const calculateMapCenter = () => {
  //   if (plans.length === 0) return { lat: 35.6762, lng: 139.6503 }; // 도쿄 기본값
  //   
  //   const validPlans = plans.filter(plan => plan.latitude && plan.longitude);
  //   if (validPlans.length === 0) return { lat: 35.6762, lng: 139.6503 };
  //   
  //   const totalLat = validPlans.reduce((sum, plan) => sum + (plan.latitude || 0), 0);
  //   const totalLng = validPlans.reduce((sum, plan) => sum + (plan.longitude || 0), 0);
  //   
  //   return {
  //     lat: totalLat / validPlans.length,
  //     lng: totalLng / validPlans.length,
  //   };
  // };

  // Day별 계획 그룹화
  const plansByDay = plans.reduce((acc, plan) => {
    if (!acc[plan.day]) {
      acc[plan.day] = [];
    }
    acc[plan.day].push(plan);
    return acc;
  }, {} as Record<number, Plan[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-natural-xlarge flex items-center justify-center animate-natural-bounce">
            <span className="text-2xl">🗺️</span>
          </div>
          <p className="text-secondary-600 golden-text-body">지도를 불러오는 중...</p>
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

  // const mapCenter = calculateMapCenter(); // 지도 중심점 계산 (현재 사용하지 않음)

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
              전체 일정 지도
            </h1>
            <div className="w-10" /> {/* 균형을 위한 빈 공간 */}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative">
        {/* Mock 지도 영역 */}
        <div className="w-full h-[calc(100vh-4rem)] relative bg-gradient-to-br from-blue-50 to-green-50">
          {/* 지도 배경 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-30" />
          
          {/* 격자 패턴 */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} />
          </div>

          {/* 마커들 */}
          {plans.map((plan) => {
            if (!plan.latitude || !plan.longitude) return null;
            
            const config = planTypeConfig[plan.type] || planTypeConfig.other;
            const isSelected = selectedPlan?.id === plan.id;
            
            // 지도 좌표를 화면 좌표로 변환 (간단한 시뮬레이션)
            const mapWidth = 1000; // 가상 지도 너비
            const mapHeight = 600; // 가상 지도 높이
            const worldWidth = 360; // 경도 범위
            const worldHeight = 180; // 위도 범위
            
            const x = ((plan.longitude + 180) / worldWidth) * mapWidth;
            const y = ((90 - plan.latitude) / worldHeight) * mapHeight;
            
            return (
              <div
                key={plan.id}
                className={cn(
                  'absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300',
                  isSelected ? 'z-20' : 'z-10 hover:z-15'
                )}
                style={{
                  left: `${(x / mapWidth) * 100}%`,
                  top: `${(y / mapHeight) * 100}%`,
                }}
                onClick={() => setSelectedPlan(isSelected ? null : plan)}
              >
                {/* 마커 */}
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-natural-medium transition-all duration-300',
                  isSelected ? 'scale-125 shadow-natural-strong' : 'hover:scale-110',
                  config.color === 'bg-blue-500' ? 'bg-blue-500' :
                  config.color === 'bg-green-500' ? 'bg-green-500' :
                  config.color === 'bg-orange-500' ? 'bg-orange-500' :
                  config.color === 'bg-purple-500' ? 'bg-purple-500' :
                  'bg-gray-500'
                )}>
                  {config.icon}
                </div>
                
                {/* 마커 라벨 */}
                <div className={cn(
                  'absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-white rounded-natural-small shadow-natural-medium text-xs font-medium whitespace-nowrap transition-all duration-300',
                  isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                )}>
                  Day {plan.day}
                </div>
              </div>
            );
          })}

          {/* 선택된 계획 정보 */}
          {selectedPlan && (
            <div className="absolute bottom-4 left-4 right-4 z-30">
              <Card className="natural-card">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* 계획 정보 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-primary-600 golden-text-body">
                          Day {selectedPlan.day}
                        </span>
                        <span className="text-secondary-400">•</span>
                        <span className="text-sm text-secondary-600 golden-text-body">
                          {selectedPlan.start_time && formatTime(selectedPlan.start_time)} - {selectedPlan.end_time && formatTime(selectedPlan.end_time)}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-secondary-900 golden-text-title mb-2">
                        {selectedPlan.place_name}
                      </h3>
                      
                      {selectedPlan.address && (
                        <p className="text-sm text-secondary-600 golden-text-body mb-2">
                          {selectedPlan.address}
                        </p>
                      )}
                      
                      {selectedPlan.rating && selectedPlan.rating > 0 && (
                        <div className="flex items-center space-x-1 text-sm text-secondary-600 golden-text-body">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{selectedPlan.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => router.push(`/trips/${tripId}/plans/${selectedPlan.id}`)}
                        size="sm"
                        className="natural-button"
                      >
                        상세보기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 지도 컨트롤 */}
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-white rounded-natural-medium shadow-natural-medium p-2 space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPlan(null)}
                className="w-8 h-8 p-0 natural-button"
              >
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 계획 목록 사이드바 */}
        <div className="absolute top-4 left-4 z-20 max-w-sm">
          <Card className="natural-card">
            <CardContent className="p-4">
              <h3 className="font-semibold text-secondary-900 golden-text-title mb-4">
                {trip.title} - 전체 계획
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Object.entries(plansByDay).map(([day, dayPlans]) => (
                  <div key={day} className="space-y-2">
                    <h4 className="text-sm font-medium text-primary-600 golden-text-body">
                      Day {day}
                    </h4>
                    {dayPlans.map((plan) => {
                      const config = planTypeConfig[plan.type] || planTypeConfig.other;
                      return (
                        <div
                          key={plan.id}
                          className={cn(
                            'flex items-center space-x-3 p-2 rounded-natural-medium cursor-pointer transition-all duration-200',
                            selectedPlan?.id === plan.id
                              ? 'bg-primary-50 border border-primary-200'
                              : 'hover:bg-secondary-50'
                          )}
                          onClick={() => setSelectedPlan(plan)}
                        >
                          <div className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs',
                            config.color === 'bg-blue-500' ? 'bg-blue-500' :
                            config.color === 'bg-green-500' ? 'bg-green-500' :
                            config.color === 'bg-orange-500' ? 'bg-orange-500' :
                            config.color === 'bg-purple-500' ? 'bg-purple-500' :
                            'bg-gray-500'
                          )}>
                            {config.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-secondary-900 golden-text-body line-clamp-1">
                              {plan.place_name}
                            </p>
                            <p className="text-xs text-secondary-600 golden-text-body">
                              {plan.start_time && formatTime(plan.start_time)} - {plan.end_time && formatTime(plan.end_time)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}