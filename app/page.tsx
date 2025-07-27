'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { Button } from '@/components/ui/Button';
import { MapPin, Plus, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { GradientBackground, GlassCard, GLASS_CLASSES, WaveEffect } from '@/components/ui/backgrounds';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useSupabase();

  // 로그인된 사용자는 여행 목록으로 자동 이동
  useEffect(() => {
    if (!loading && user) {
      router.push('/travels');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-moonwave-primary border-t-transparent" />
          <p
            className={cn(
              'font-pretendard text-gray-600',
              'tracking-korean-normal break-keep-ko'
            )}
          >
            로딩 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <GradientBackground variant="moonwave" className="min-h-screen relative">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-16 text-center">
          {/* 로고/아이콘 */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-moonwave-primary to-moonwave-secondary shadow-lg">
            <MapPin className="h-10 w-10 text-white" />
          </div>

          {/* 제목 */}
          <h1
            className={cn(
              'mb-6 font-pretendard text-5xl font-bold text-white sm:text-6xl',
              'tracking-korean-tight break-keep-ko'
            )}
          >
            Moonwave Travel
          </h1>

          {/* 부제목 */}
          <p
            className={cn(
              'mb-8 font-pretendard text-xl text-white/90',
              'leading-relaxed tracking-korean-normal break-keep-ko'
            )}
          >
            스마트한 여행 계획 시스템으로
            <br />
            특별한 여행을 설계하세요
          </p>

          {/* 액션 버튼 */}
          <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
            {user ? (
              <Button asChild size="lg" className="px-8 py-4 text-lg">
                <Link href="/travels">
                  <Calendar className="mr-2 h-5 w-5" />내 여행 보기
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="px-8 py-4 text-lg">
                  <Link href="/signin">시작하기</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg"
                >
                  <Link href="/demo">데모 보기</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 특징 섹션 */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <GlassCard variant="medium" className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3
              className={cn(
                'mb-2 font-pretendard text-lg font-semibold text-white',
                'tracking-korean-tight break-keep-ko'
              )}
            >
              스마트한 일정 관리
            </h3>
            <p
              className={cn(
                'font-pretendard text-white/90',
                'tracking-korean-normal break-keep-ko'
              )}
            >
              AI 기반 여행 일정 최적화로 효율적인 여행을 계획하세요
            </p>
          </GlassCard>

          <GlassCard variant="medium" className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3
              className={cn(
                'mb-2 font-pretendard text-lg font-semibold text-white',
                'tracking-korean-tight break-keep-ko'
              )}
            >
              실시간 협업
            </h3>
            <p
              className={cn(
                'font-pretendard text-white/90',
                'tracking-korean-normal break-keep-ko'
              )}
            >
              친구, 가족과 함께 실시간으로 여행을 계획하고 공유하세요
            </p>
          </GlassCard>

          <GlassCard variant="medium" className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3
              className={cn(
                'mb-2 font-pretendard text-lg font-semibold text-white',
                'tracking-korean-tight break-keep-ko'
              )}
            >
              지도 연동
            </h3>
            <p
              className={cn(
                'font-pretendard text-white/90',
                'tracking-korean-normal break-keep-ko'
              )}
            >
              Google Maps 연동으로 정확한 위치와 경로를 확인하세요
            </p>
          </GlassCard>
        </div>

        {/* CTA 섹션 */}
        <GlassCard variant="dark" className="rounded-2xl p-8 text-center">
          <h2
            className={cn(
              'mb-4 font-pretendard text-3xl font-bold text-white',
              'tracking-korean-tight break-keep-ko'
            )}
          >
            지금 시작해보세요
          </h2>

          <p
            className={cn(
              'mb-8 font-pretendard text-white/90',
              'tracking-korean-normal break-keep-ko'
            )}
          >
            무료로 여행 계획을 세우고 친구들과 공유해보세요
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link
                href={user ? '/travels/new' : '/signin'}
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                <span>{user ? '새 여행 만들기' : '지금 시작하기'}</span>
              </Link>
            </Button>

            {user && (
              <Button asChild variant="outline" size="lg">
                <Link href="/map" className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>지도에서 보기</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* 웨이브 효과 */}
      <WaveEffect 
        variant="double" 
        color="white" 
        opacity={[0.1, 0.15]}
        height={80}
        className="absolute bottom-0"
      />
    </div>
  );
}
