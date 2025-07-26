'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { CreateTravelForm } from '@/components/features/travel/CreateTravelForm';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NewTravelPage() {
  const router = useRouter();
  const { user, loading } = useSupabase();

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
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
      </div>
    );
  }

  // 로그인 필요
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
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
              여행 계획을 만들려면 로그인해주세요
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signin">로그인하기</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/travels">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  여행 목록으로
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSuccess = (travelId: string) => {
    // CreateTravelForm에서 이미 라우팅 처리하므로 추가 작업 없음
    console.log('여행 생성 성공:', travelId);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 네비게이션 헤더 */}
        <div className="mb-8 @container/nav">
          <div className="flex flex-col gap-4 @md/nav:flex-row @md/nav:items-center @md/nav:justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/travels">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  돌아가기
                </Link>
              </Button>

              <div className="h-6 w-px bg-gray-300" />

              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <Link
                  href="/travels"
                  className={cn(
                    'font-pretendard transition-colors hover:text-moonwave-primary',
                    'tracking-korean-normal'
                  )}
                >
                  여행 목록
                </Link>
                <span>/</span>
                <span
                  className={cn(
                    'font-pretendard font-medium text-gray-900',
                    'tracking-korean-normal'
                  )}
                >
                  새 여행 만들기
                </span>
              </nav>
            </div>

            {/* 도움말 링크 (큰 화면에서만) */}
            <div className="hidden @md/nav:block">
              <Button variant="ghost" size="sm">
                도움말
              </Button>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="@container/main">
          <CreateTravelForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>

        {/* 추가 정보 섹션 */}
        <div className="mx-auto mt-12 max-w-2xl @container/info">
          <div className="shadow-soft rounded-xl border border-gray-200 bg-white p-6 @lg/info:p-8">
            <h3
              className={cn(
                'mb-4 font-pretendard text-lg font-semibold text-gray-900',
                'tracking-korean-tight break-keep-ko'
              )}
            >
              여행 계획 만들기 팁
            </h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-moonwave-blue-100">
                  <span
                    className={cn(
                      'text-xs font-bold text-moonwave-primary',
                      'font-pretendard'
                    )}
                  >
                    1
                  </span>
                </div>
                <p
                  className={cn(
                    'font-pretendard text-sm text-gray-600',
                    'tracking-korean-normal break-keep-ko'
                  )}
                >
                  <strong className="text-gray-900">구체적인 제목</strong>으로
                  여행의 성격을 명확히 표현하세요. 예: &quot;제주도 힐링
                  여행&quot;, &quot;유럽 배낭여행&quot;
                </p>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-moonwave-blue-100">
                  <span
                    className={cn(
                      'text-xs font-bold text-moonwave-primary',
                      'font-pretendard'
                    )}
                  >
                    2
                  </span>
                </div>
                <p
                  className={cn(
                    'font-pretendard text-sm text-gray-600',
                    'tracking-korean-normal break-keep-ko'
                  )}
                >
                  <strong className="text-gray-900">목적지는 정확하게</strong>{' '}
                  입력하면 나중에 지도 연동 시 더 정확한 정보를 제공받을 수
                  있습니다.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-moonwave-blue-100">
                  <span
                    className={cn(
                      'text-xs font-bold text-moonwave-primary',
                      'font-pretendard'
                    )}
                  >
                    3
                  </span>
                </div>
                <p
                  className={cn(
                    'font-pretendard text-sm text-gray-600',
                    'tracking-korean-normal break-keep-ko'
                  )}
                >
                  <strong className="text-gray-900">협력자 초대</strong>로 친구,
                  가족과 함께 실시간으로 여행을 계획할 수 있습니다.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-moonwave-blue-100">
                  <span
                    className={cn(
                      'text-xs font-bold text-moonwave-primary',
                      'font-pretendard'
                    )}
                  >
                    4
                  </span>
                </div>
                <p
                  className={cn(
                    'font-pretendard text-sm text-gray-600',
                    'tracking-korean-normal break-keep-ko'
                  )}
                >
                  생성 후에도 언제든지{' '}
                  <strong className="text-gray-900">수정이 가능</strong>하니
                  부담 없이 시작해보세요!
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
