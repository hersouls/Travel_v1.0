'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useTravelPlans } from '@/hooks/useTravelPlans';
import { CreateTravelForm } from '@/components/features/travel/CreateTravelForm';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function NewTravelPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useSupabase();
  const { createTravelPlan } = useTravelPlans();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTravel = async (data: any) => {
    if (!user) return;

    try {
      setIsCreating(true);
      const newTravel = await createTravelPlan(data);
      
      if (newTravel) {
        router.push(`/travels/${newTravel.id}`);
      }
    } catch (error) {
      console.error('여행 생성 실패:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-moonwave-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={cn(
            'font-pretendard text-gray-600',
            'tracking-korean-normal break-keep-ko'
          )}>
            로딩 중...
          </p>
        </div>
      </div>
    );
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
            여행을 생성하려면 로그인해주세요.
          </p>
          <Button asChild>
            <Link href="/signin">로그인하기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/travels">
                <ArrowLeft className="w-4 h-4 mr-2" />
                뒤로가기
              </Link>
            </Button>
          </div>
          
          <h1 className={cn(
            'font-pretendard font-bold text-3xl text-gray-900',
            'tracking-korean-tight break-keep-ko mb-2'
          )}>
            새 여행 만들기
          </h1>
          
          <p className={cn(
            'font-pretendard text-gray-600',
            'tracking-korean-normal break-keep-ko'
          )}>
            새로운 여행을 계획하고 특별한 추억을 만들어보세요.
          </p>
        </div>

        {/* 여행 생성 폼 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <CreateTravelForm
            onSubmit={handleCreateTravel}
            loading={isCreating}
          />
        </div>
      </div>
    </div>
  );
}