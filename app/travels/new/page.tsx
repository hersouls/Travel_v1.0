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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-moonwave-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={cn(
              'font-pretendard text-gray-600',
              'tracking-korean-normal break-keep-ko'
            )}>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
              여행 계획을 만들려면 로그인해주세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/signin">
                  로그인하기
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/travels">
                  <ArrowLeft className="w-4 h-4 mr-2" />
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 네비게이션 헤더 */}
        <div className="@container/nav mb-8">
          <div className="flex @md/nav:flex-row flex-col @md/nav:items-center @md/nav:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/travels">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  돌아가기
                </Link>
              </Button>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <Link 
                  href="/travels" 
                  className={cn(
                    'font-pretendard hover:text-moonwave-primary transition-colors',
                    'tracking-korean-normal'
                  )}
                >
                  여행 목록
                </Link>
                <span>/</span>
                <span className={cn(
                  'font-pretendard text-gray-900 font-medium',
                  'tracking-korean-normal'
                )}>
                  새 여행 만들기
                </span>
              </nav>
            </div>
            
            {/* 도움말 링크 (큰 화면에서만) */}
            <div className="@md/nav:block hidden">
              <Button variant="ghost" size="sm">
                도움말
              </Button>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="@container/main">
          <CreateTravelForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>

        {/* 추가 정보 섹션 */}
        <div className="@container/info mt-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6 @lg/info:p-8">
            <h3 className={cn(
              'font-pretendard font-semibold text-lg text-gray-900 mb-4',
              'tracking-korean-tight break-keep-ko'
            )}>
              여행 계획 만들기 팁
            </h3>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-moonwave-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className={cn(
                    'text-moonwave-primary text-xs font-bold',
                    'font-pretendard'
                  )}>
                    1
                  </span>
                </div>
                <p className={cn(
                  'font-pretendard text-sm text-gray-600',
                  'tracking-korean-normal break-keep-ko'
                )}>
                  <strong className="text-gray-900">구체적인 제목</strong>으로 여행의 성격을 명확히 표현하세요. 
                  예: "제주도 힐링 여행", "유럽 배낭여행"
                </p>
              </li>
              
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-moonwave-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className={cn(
                    'text-moonwave-primary text-xs font-bold',
                    'font-pretendard'
                  )}>
                    2
                  </span>
                </div>
                <p className={cn(
                  'font-pretendard text-sm text-gray-600',
                  'tracking-korean-normal break-keep-ko'
                )}>
                  <strong className="text-gray-900">목적지는 정확하게</strong> 입력하면 나중에 지도 연동 시 더 정확한 정보를 제공받을 수 있습니다.
                </p>
              </li>
              
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-moonwave-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className={cn(
                    'text-moonwave-primary text-xs font-bold',
                    'font-pretendard'
                  )}>
                    3
                  </span>
                </div>
                <p className={cn(
                  'font-pretendard text-sm text-gray-600',
                  'tracking-korean-normal break-keep-ko'
                )}>
                  <strong className="text-gray-900">협력자 초대</strong>로 친구, 가족과 함께 실시간으로 여행을 계획할 수 있습니다.
                </p>
              </li>
              
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-moonwave-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className={cn(
                    'text-moonwave-primary text-xs font-bold',
                    'font-pretendard'
                  )}>
                    4
                  </span>
                </div>
                <p className={cn(
                  'font-pretendard text-sm text-gray-600',
                  'tracking-korean-normal break-keep-ko'
                )}>
                  생성 후에도 언제든지 <strong className="text-gray-900">수정이 가능</strong>하니 부담 없이 시작해보세요!
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}