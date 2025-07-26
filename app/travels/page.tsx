'use client';

import React from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useTravelPlans } from '@/hooks/useTravelPlans';
import { TravelCard } from '@/components/features/travel/TravelCard';
import { TravelListSkeleton } from '@/components/features/travel/TravelListSkeleton';
import { EmptyTravelState } from '@/components/features/travel/EmptyTravelState';
import { Button } from '@/components/ui/Button';
import { Plus, Map, Filter } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function TravelsPage() {
  const { user, loading: authLoading } = useSupabase();
  const { travelPlans, loading, error } = useTravelPlans();

  if (authLoading || loading) {
    return <TravelListSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className={cn(
            'font-pretendard font-bold text-2xl text-gray-900',
            'tracking-korean-tight break-keep-ko mb-4'
          )}>
            로그인이 필요합니다
          </h1>
          <p className={cn(
            'font-pretendard text-gray-600 mb-8',
            'tracking-korean-normal break-keep-ko'
          )}>
            여행 계획을 보려면 로그인해주세요.
          </p>
          <Button asChild>
            <Link href="/signin">로그인하기</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className={cn(
            'font-pretendard font-bold text-xl text-red-600',
            'tracking-korean-tight break-keep-ko mb-4'
          )}>
            오류가 발생했습니다
          </h1>
          <p className={cn(
            'font-pretendard text-gray-600',
            'tracking-korean-normal break-keep-ko'
          )}>
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className={cn(
              'font-pretendard font-bold text-3xl text-gray-900',
              'tracking-korean-tight break-keep-ko mb-2'
            )}>
              내 여행 계획
            </h1>
            <p className={cn(
              'font-pretendard text-gray-600',
              'tracking-korean-normal break-keep-ko'
            )}>
              {travelPlans.length}개의 여행 계획이 있습니다
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              필터
            </Button>
            
            <Button variant="outline" size="sm" asChild>
              <Link href="/map">
                <Map className="w-4 h-4 mr-2" />
                지도 보기
              </Link>
            </Button>
            
            <Button asChild>
              <Link href="/travels/new">
                <Plus className="w-4 h-4 mr-2" />
                새 여행 만들기
              </Link>
            </Button>
          </div>
        </div>

        {/* 여행 목록 */}
        {travelPlans.length === 0 ? (
          <EmptyTravelState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelPlans.map((travel) => (
              <TravelCard
                key={travel.id}
                travel={travel}
                className="h-full"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}