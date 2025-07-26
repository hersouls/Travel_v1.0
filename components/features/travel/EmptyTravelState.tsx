import React from 'react';
import Link from 'next/link';
import { MapPin, Plus, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function EmptyTravelState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        {/* 아이콘 */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-moonwave-blue-100 to-moonwave-purple-100">
          <div className="relative">
            <MapPin className="h-8 w-8 text-moonwave-primary" />
            <Compass className="absolute -right-1 -top-1 h-6 w-6 text-moonwave-secondary" />
          </div>
        </div>

        {/* 제목 */}
        <h2
          className={cn(
            'mb-3 font-pretendard text-2xl font-bold text-gray-900',
            'tracking-korean-tight break-keep-ko'
          )}
        >
          첫 번째 여행을 계획해보세요
        </h2>

        {/* 설명 */}
        <p
          className={cn(
            'mb-8 font-pretendard text-gray-600',
            'leading-relaxed tracking-korean-normal break-keep-ko'
          )}
        >
          Moonwave Travel과 함께 특별한 여행을 계획하고,
          <br />
          소중한 추억을 만들어보세요.
        </p>

        {/* 액션 버튼 */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/travels/new">
              <Plus className="mr-2 h-5 w-5" />새 여행 만들기
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/examples">
              <Compass className="mr-2 h-5 w-5" />
              예시 여행 보기
            </Link>
          </Button>
        </div>

        {/* 특징 목록 */}
        <div className="mt-12">
          <h3
            className={cn(
              'mb-4 font-pretendard text-lg font-semibold text-gray-900',
              'tracking-korean-tight break-keep-ko'
            )}
          >
            Moonwave Travel의 특징
          </h3>

          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-moonwave-blue-100">
                <div className="h-2 w-2 rounded-full bg-moonwave-primary" />
              </div>
              <div>
                <p
                  className={cn(
                    'font-pretendard font-medium text-gray-900',
                    'tracking-korean-normal break-keep-ko'
                  )}
                >
                  실시간 협업
                </p>
                <p
                  className={cn(
                    'font-pretendard text-gray-600',
                    'tracking-korean-normal break-keep-ko'
                  )}
                >
                  친구들과 함께 여행을 계획하세요
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-moonwave-purple-100">
                <div className="h-2 w-2 rounded-full bg-moonwave-secondary" />
              </div>
              <div>
                <p
                  className={cn(
                    'font-pretendard font-medium text-gray-900',
                    'tracking-korean-normal break-keep-ko'
                  )}
                >
                  지도 연동
                </p>
                <p
                  className={cn(
                    'font-pretendard text-gray-600',
                    'tracking-korean-normal break-keep-ko'
                  )}
                >
                  Google Maps로 경로를 확인하세요
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-moonwave-blue-100">
                <div className="h-2 w-2 rounded-full bg-moonwave-primary" />
              </div>
              <div>
                <p
                  className={cn(
                    'font-pretendard font-medium text-gray-900',
                    'tracking-korean-normal break-keep-ko'
                  )}
                >
                  예산 관리
                </p>
                <p
                  className={cn(
                    'font-pretendard text-gray-600',
                    'tracking-korean-normal break-keep-ko'
                  )}
                >
                  여행 예산을 체계적으로 관리하세요
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-moonwave-purple-100">
                <div className="h-2 w-2 rounded-full bg-moonwave-secondary" />
              </div>
              <div>
                <p
                  className={cn(
                    'font-pretendard font-medium text-gray-900',
                    'tracking-korean-normal break-keep-ko'
                  )}
                >
                  일정 공유
                </p>
                <p
                  className={cn(
                    'font-pretendard text-gray-600',
                    'tracking-korean-normal break-keep-ko'
                  )}
                >
                  여행 일정을 간편하게 공유하세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
