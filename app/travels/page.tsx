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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* 헤더 스켈레톤 */}
          <div className="mb-8">
            <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-5 w-72 animate-pulse rounded bg-gray-200" />
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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <MapPin className="h-8 w-8 text-red-500" />
            </div>
            <h2
              className={cn(
                'mb-2 font-pretendard text-xl font-semibold text-gray-900',
                'tracking-korean-tight break-keep-ko'
              )}
            >
              데이터를 불러올 수 없습니다
            </h2>
            <p
              className={cn(
                'mb-6 font-pretendard text-gray-600',
                'tracking-korean-normal break-keep-ko'
              )}
            >
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
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-moonwave-blue-100">
              <MapPin className="h-8 w-8 text-moonwave-primary" />
            </div>
            <h1
              className={cn(
                'mb-4 font-pretendard text-3xl font-bold text-gray-900',
                'tracking-korean-tight break-keep-ko'
              )}
            >
              로그인이 필요합니다
            </h1>
            <p
              className={cn(
                'mb-8 font-pretendard text-gray-600',
                'tracking-korean-normal break-keep-ko'
              )}
            >
              여행 계획을 관리하려면 로그인해주세요
            </p>
            <Button asChild size="lg">
              <Link href="/signin">로그인하기</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8 @container/header">
          <div className="flex flex-col gap-4 @lg/header:flex-row @lg/header:items-center @lg/header:justify-between">
            <div className="min-w-0 flex-1">
              <h1
                className={cn(
                  'mb-2 font-pretendard text-3xl font-bold text-gray-900 @lg/header:text-4xl',
                  'tracking-korean-tight break-keep-ko'
                )}
              >
                내 여행 계획
              </h1>
              <p
                className={cn(
                  'font-pretendard text-gray-600',
                  'tracking-korean-normal break-keep-ko'
                )}
              >
                {travelPlans.length > 0
                  ? `총 ${travelPlans.length}개의 여행 계획이 있습니다`
                  : '새로운 여행을 계획해보세요'}
              </p>
            </div>

            <div className="flex-shrink-0 @lg/header:ml-6">
              <Button asChild size="lg" className="w-full @lg/header:w-auto">
                <Link href="/travels/new" className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  <span>새 여행 만들기</span>
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
              <div className="mb-8 grid grid-cols-1 gap-6 @md/main:grid-cols-2 @lg/main:grid-cols-3 @2xl/main:grid-cols-4">
                <div className="shadow-soft rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-moonwave-blue-100">
                      <MapPin className="h-6 w-6 text-moonwave-primary" />
                    </div>
                    <div className="ml-4">
                      <p
                        className={cn(
                          'font-pretendard text-sm text-gray-600',
                          'tracking-korean-normal'
                        )}
                      >
                        전체 여행
                      </p>
                      <p
                        className={cn(
                          'font-pretendard text-2xl font-bold text-gray-900',
                          'tracking-korean-wide text-numeric'
                        )}
                      >
                        {travelPlans.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="shadow-soft rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p
                        className={cn(
                          'font-pretendard text-sm text-gray-600',
                          'tracking-korean-normal'
                        )}
                      >
                        활성 여행
                      </p>
                      <p
                        className={cn(
                          'font-pretendard text-2xl font-bold text-gray-900',
                          'tracking-korean-wide text-numeric'
                        )}
                      >
                        {
                          travelPlans.filter(
                            (plan) =>
                              plan.status === 'planning' ||
                              plan.status === 'ongoing'
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="shadow-soft rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p
                        className={cn(
                          'font-pretendard text-sm text-gray-600',
                          'tracking-korean-normal'
                        )}
                      >
                        완료된 여행
                      </p>
                      <p
                        className={cn(
                          'font-pretendard text-2xl font-bold text-gray-900',
                          'tracking-korean-wide text-numeric'
                        )}
                      >
                        {
                          travelPlans.filter(
                            (plan) => plan.status === 'completed'
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="shadow-soft rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p
                        className={cn(
                          'font-pretendard text-sm text-gray-600',
                          'tracking-korean-normal'
                        )}
                      >
                        총 일정
                      </p>
                      <p
                        className={cn(
                          'font-pretendard text-2xl font-bold text-gray-900',
                          'tracking-korean-wide text-numeric'
                        )}
                      >
                        {travelPlans.reduce(
                          (total, plan) => total + plan.travel_days.length,
                          0
                        )}
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
