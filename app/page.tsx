'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { user, loading } = useSupabase();
  
  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 로그인된 사용자는 여행 목록으로 자동 이동
  useEffect(() => {
    if (user && !loading && isClient) {
      router.push('/travels');
    }
  }, [user, loading, router, isClient]);

  // 서버 사이드 렌더링 중에는 기본 UI만 표시
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 relative">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <MapPin className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-6 font-pretendard text-5xl font-bold text-white sm:text-6xl tracking-korean-tight break-keep-ko">
              Moonwave Travel
            </h1>
            <p className="mb-8 font-pretendard text-xl text-white/90 leading-relaxed tracking-korean-normal break-keep-ko">
              스마트한 여행 계획 시스템으로<br />
              특별한 여행을 설계하세요
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="font-pretendard text-gray-600 tracking-korean-normal break-keep-ko">
            로딩 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 relative">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-16 text-center">
          {/* 로고/아이콘 */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <MapPin className="h-10 w-10 text-white" />
          </div>

          {/* 제목 */}
          <h1 className="mb-6 font-pretendard text-5xl font-bold text-white sm:text-6xl tracking-korean-tight break-keep-ko">
            Moonwave Travel
          </h1>

          {/* 부제목 */}
          <p className="mb-8 font-pretendard text-xl text-white/90 leading-relaxed tracking-korean-normal break-keep-ko">
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* 특징 1 */}
          <div className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center transition-all duration-200 hover:bg-white/40 hover:shadow-lg hover:scale-105">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold tracking-korean-tight text-white">
              스마트 일정 관리
            </h3>
            <p className="text-white/90 tracking-korean-normal break-keep-ko">
              AI 기반 추천으로 최적의 여행 일정을 계획하고 관리하세요
            </p>
          </div>

          {/* 특징 2 */}
          <div className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center transition-all duration-200 hover:bg-white/40 hover:shadow-lg hover:scale-105">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
              <MapPin className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold tracking-korean-tight text-white">
              실시간 지도 연동
            </h3>
            <p className="text-white/90 tracking-korean-normal break-keep-ko">
              Google Maps와 연동하여 실제 위치 기반으로 계획을 확인하세요
            </p>
          </div>

          {/* 특징 3 */}
          <div className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center transition-all duration-200 hover:bg-white/40 hover:shadow-lg hover:scale-105">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold tracking-korean-tight text-white">
              협업 기능
            </h3>
            <p className="text-white/90 tracking-korean-normal break-keep-ko">
              친구들과 함께 여행 계획을 세우고 실시간으로 공유하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
