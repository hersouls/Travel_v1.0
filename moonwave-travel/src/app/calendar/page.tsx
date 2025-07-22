'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CalendarPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.back()}
                className="mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                캘린더 보기
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            캘린더 기능 준비 중
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            여행 일정을 캘린더에서 확인하고 관리할 수 있는 기능이 곧 준비됩니다.
          </p>
          <Button 
            onClick={() => router.push('/')}
            className="bg-primary-500 hover:bg-primary-600"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </main>
    </div>
  );
}