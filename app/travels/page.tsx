'use client';

import React from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useTravelPlans } from '@/hooks/useTravelPlans';
import { TravelList } from '@/components/features/travel/TravelList';
import { EmptyTravelState } from '@/components/features/travel/EmptyTravelState';
import { TravelListSkeleton } from '@/components/features/travel/TravelListSkeleton';
import { Button } from '@/components/ui/Button';
import { Plus, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function TravelsPage() {
  const { user, loading: authLoading } = useSupabase();
  const { travelPlans, loading, error, refetch } = useTravelPlans();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 헤더 스켈레톤 */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded-lg w-48 mb-4 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-72 animate-pulse" />
          </div>
          
          {/* 여행 목록 스켈레톤 */}
          <TravelListSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-red-500" />
            </div>
            <h2 className={cn(
              'font-pretendard font-semibold text-xl text-gray-900 mb-2',
              'tracking-korean-tight break-keep-ko'
            )}>
              데이터를 불러올 수 없습니다
            </h2>
            <p className={cn(
              'font-pretendard text-gray-600 mb-6',
              'tracking-korean-normal break-keep-ko'
            )}>
              {error.message}
            </p>
            <Button onClick={refetch} variant="outline">
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-moonwave-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-moonwave-primary" />
            </div>
            <h1 className={cn(
              'font-pretendard font-bold text-3xl text-gray-900 mb-4',
              'tracking-korean-tight break-keep-ko'
            )}>
              로그인이 필요합니다
            </h1>
            <p className={cn(
              'font-pretendard text-gray-600 mb-8',
              'tracking-korean-normal break-keep-ko'
            )}>
              여행 계획을 관리하려면 로그인해주세요
            </p>
            <Button asChild size="lg">
              <Link href="/signin">
                로그인하기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="@container/header mb-8">
          <div className="flex @lg/header:flex-row flex-col @lg/header:items-center @lg/header:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className={cn(
                'font-pretendard font-bold text-3xl @lg/header:text-4xl text-gray-900 mb-2',
                'tracking-korean-tight break-keep-ko'
              )}>
                내 여행 계획
              </h1>
              <p className={cn(
                'font-pretendard text-gray-600',
                'tracking-korean-normal break-keep-ko'
              )}>
                {travelPlans.length > 0 
                  ? `총 ${travelPlans.length}개의 여행 계획이 있습니다`
                  : '새로운 여행을 계획해보세요'
                }
              </p>
            </div>
            
            <div className="@lg/header:ml-6 flex-shrink-0">
              <Button asChild size="lg" className="w-full @lg/header:w-auto">
                <Link href="/travels/new">
                  <Plus className="w-5 h-5 mr-2" />
                  새 여행 만들기
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="@container/main">
          {travelPlans.length === 0 ? (
            <EmptyTravelState />
          ) : (
            <>
              {/* 통계 카드 */}
              <div className="grid @2xl/main:grid-cols-4 @lg/main:grid-cols-3 @md/main:grid-cols-2 grid-cols-1 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-moonwave-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-moonwave-primary" />
                    </div>
                    <div className="ml-4">
                      <p className={cn(
                        'font-pretendard text-sm text-gray-600',
                        'tracking-korean-normal'
                      )}>
                        전체 여행
                      </p>
                      <p className={cn(
                        'font-pretendard font-bold text-2xl text-gray-900',
                        'text-numeric tracking-korean-wide'
                      )}>
                        {travelPlans.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className={cn(
                        'font-pretendard text-sm text-gray-600',
                        'tracking-korean-normal'
                      )}>
                        활성 여행
                      </p>
                      <p className={cn(
                        'font-pretendard font-bold text-2xl text-gray-900',
                        'text-numeric tracking-korean-wide'
                      )}>
                        {travelPlans.filter(plan => plan.status === 'planning' || plan.status === 'ongoing').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className={cn(
                        'font-pretendard text-sm text-gray-600',
                        'tracking-korean-normal'
                      )}>
                        완료된 여행
                      </p>
                      <p className={cn(
                        'font-pretendard font-bold text-2xl text-gray-900',
                        'text-numeric tracking-korean-wide'
                      )}>
                        {travelPlans.filter(plan => plan.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className={cn(
                        'font-pretendard text-sm text-gray-600',
                        'tracking-korean-normal'
                      )}>
                        총 일정
                      </p>
                      <p className={cn(
                        'font-pretendard font-bold text-2xl text-gray-900',
                        'text-numeric tracking-korean-wide'
                      )}>
                        {travelPlans.reduce((total, plan) => total + plan.travel_days.length, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 여행 목록 */}
              <TravelList travelPlans={travelPlans} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}