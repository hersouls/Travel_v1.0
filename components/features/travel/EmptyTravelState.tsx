import React from 'react';
import Link from 'next/link';
import { MapPin, Plus, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function EmptyTravelState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md text-center">
        {/* 아이콘 */}
        <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-moonwave-blue-100 to-moonwave-purple-100 rounded-full flex items-center justify-center">
          <div className="relative">
            <MapPin className="w-8 h-8 text-moonwave-primary" />
            <Compass className="w-6 h-6 text-moonwave-secondary absolute -top-1 -right-1" />
          </div>
        </div>
        
        {/* 제목 */}
        <h2 className={cn(
          'font-pretendard font-bold text-2xl text-gray-900 mb-3',
          'tracking-korean-tight break-keep-ko'
        )}>
          첫 번째 여행을 계획해보세요
        </h2>
        
        {/* 설명 */}
        <p className={cn(
          'font-pretendard text-gray-600 mb-8',
          'tracking-korean-normal break-keep-ko leading-relaxed'
        )}>
          Moonwave Travel과 함께 특별한 여행을 계획하고,<br />
          소중한 추억을 만들어보세요.
        </p>
        
        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/travels/new">
              <Plus className="w-5 h-5 mr-2" />
              새 여행 만들기
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/examples">
              <Compass className="w-5 h-5 mr-2" />
              예시 여행 보기
            </Link>
          </Button>
        </div>
        
        {/* 특징 목록 */}
        <div className="mt-12">
          <h3 className={cn(
            'font-pretendard font-semibold text-lg text-gray-900 mb-4',
            'tracking-korean-tight break-keep-ko'
          )}>
            Moonwave Travel의 특징
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-moonwave-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-moonwave-primary rounded-full" />
              </div>
              <div>
                <p className={cn(
                  'font-pretendard font-medium text-gray-900',
                  'tracking-korean-normal break-keep-ko'
                )}>
                  실시간 협업
                </p>
                <p className={cn(
                  'font-pretendard text-gray-600',
                  'tracking-korean-normal break-keep-ko'
                )}>
                  친구들과 함께 여행을 계획하세요
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-moonwave-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-moonwave-secondary rounded-full" />
              </div>
              <div>
                <p className={cn(
                  'font-pretendard font-medium text-gray-900',
                  'tracking-korean-normal break-keep-ko'
                )}>
                  지도 연동
                </p>
                <p className={cn(
                  'font-pretendard text-gray-600',
                  'tracking-korean-normal break-keep-ko'
                )}>
                  Google Maps로 경로를 확인하세요
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-moonwave-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-moonwave-primary rounded-full" />
              </div>
              <div>
                <p className={cn(
                  'font-pretendard font-medium text-gray-900',
                  'tracking-korean-normal break-keep-ko'
                )}>
                  예산 관리
                </p>
                <p className={cn(
                  'font-pretendard text-gray-600',
                  'tracking-korean-normal break-keep-ko'
                )}>
                  여행 예산을 체계적으로 관리하세요
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-moonwave-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-moonwave-secondary rounded-full" />
              </div>
              <div>
                <p className={cn(
                  'font-pretendard font-medium text-gray-900',
                  'tracking-korean-normal break-keep-ko'
                )}>
                  일정 공유
                </p>
                <p className={cn(
                  'font-pretendard text-gray-600',
                  'tracking-korean-normal break-keep-ko'
                )}>
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