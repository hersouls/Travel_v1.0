'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { Button } from '@/components/ui/Button';
import { MapPin, Plus, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { reportWebVitals } from '@/lib/web-vitals';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useSupabase();

  // 로그인된 사용자는 여행 목록으로 자동 이동
  useEffect(() => {
    if (!loading && user) {
      router.push('/travels');
    }
  }, [user, loading, router]);

  // Web Vitals 성능 측정
  useEffect(() => {
    if (typeof window !== 'undefined') {
      reportWebVitals();
    }
  }, []);

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 헤더 */}
        <div className="text-center mb-16">
          {/* 로고/아이콘 */}
          <div className="mx-auto mb-8 w-20 h-20 bg-gradient-to-br from-moonwave-primary to-moonwave-secondary rounded-2xl flex items-center justify-center shadow-lg">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          
          {/* 제목 */}
          <h1 className={cn(
            'font-pretendard font-bold text-5xl sm:text-6xl text-gray-900 mb-6',
            'tracking-korean-tight break-keep-ko'
          )}>
            Moonwave Travel
          </h1>
          
          {/* 부제목 */}
          <p className={cn(
            'font-pretendard text-xl text-gray-600 mb-8',
            'tracking-korean-normal break-keep-ko leading-relaxed'
          )}>
            스마트한 여행 계획 시스템으로<br />
            특별한 여행을 설계하세요
          </p>
          
          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <Button asChild size="lg" className="text-lg px-8 py-4">
                <Link href="/travels">
                  <Calendar className="w-5 h-5 mr-2" />
                  내 여행 보기
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="text-lg px-8 py-4">
                  <Link href="/signin">
                    시작하기
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Link href="/demo">
                    데모 보기
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 특징 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-moonwave-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-moonwave-primary" />
            </div>
            <h3 className={cn(
              'font-pretendard font-semibold text-lg text-gray-900 mb-2',
              'tracking-korean-tight break-keep-ko'
            )}>
              스마트한 일정 관리
            </h3>
            <p className={cn(
              'font-pretendard text-gray-600',
              'tracking-korean-normal break-keep-ko'
            )}>
              AI 기반 여행 일정 최적화로 효율적인 여행을 계획하세요
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-moonwave-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-moonwave-secondary" />
            </div>
            <h3 className={cn(
              'font-pretendard font-semibold text-lg text-gray-900 mb-2',
              'tracking-korean-tight break-keep-ko'
            )}>
              실시간 협업
            </h3>
            <p className={cn(
              'font-pretendard text-gray-600',
              'tracking-korean-normal break-keep-ko'
            )}>
              친구, 가족과 함께 실시간으로 여행을 계획하고 공유하세요
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-moonwave-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-moonwave-primary" />
            </div>
            <h3 className={cn(
              'font-pretendard font-semibold text-lg text-gray-900 mb-2',
              'tracking-korean-tight break-keep-ko'
            )}>
              지도 연동
            </h3>
            <p className={cn(
              'font-pretendard text-gray-600',
              'tracking-korean-normal break-keep-ko'
            )}>
              Google Maps 연동으로 정확한 위치와 경로를 확인하세요
            </p>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h2 className={cn(
            'font-pretendard font-bold text-3xl text-gray-900 mb-4',
            'tracking-korean-tight break-keep-ko'
          )}>
            지금 시작해보세요
          </h2>
          
          <p className={cn(
            'font-pretendard text-gray-600 mb-8',
            'tracking-korean-normal break-keep-ko'
          )}>
            무료로 여행 계획을 세우고 친구들과 공유해보세요
          </p>
          
          <Button asChild size="lg">
            <Link href={user ? "/travels/new" : "/signin"}>
              <Plus className="w-5 h-5 mr-2" />
              {user ? "새 여행 만들기" : "지금 시작하기"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}