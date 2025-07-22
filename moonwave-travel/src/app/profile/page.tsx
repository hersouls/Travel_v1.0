'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Settings, Globe, Calendar, Map } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

export default function ProfilePage() {
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
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                프로필
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 프로필 정보 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-6">
            <Avatar size="lg" fallback="U" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">사용자</h2>
              <p className="text-gray-600 mb-4">user@example.com</p>
              <div className="flex space-x-2">
                <Badge variant="default">
                  <Globe className="w-3 h-3 mr-1" />
                  5개 국가 방문
                </Badge>
                <Badge variant="secondary">
                  <Calendar className="w-3 h-3 mr-1" />
                  12개 여행
                </Badge>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => router.push('/settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              설정
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">방문 국가</p>
                <p className="text-2xl font-bold text-gray-900">5개</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-success-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 여행</p>
                <p className="text-2xl font-bold text-gray-900">12개</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <Map className="w-6 h-6 text-accent-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 계획</p>
                <p className="text-2xl font-bold text-gray-900">48개</p>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">최근 활동</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">일본 여행 계획 완료</p>
                <p className="text-sm text-gray-600">2일 전</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-success-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">프랑스 여행 시작</p>
                <p className="text-sm text-gray-600">1주일 전</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                <Map className="w-5 h-5 text-accent-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">이탈리아 여행 계획 생성</p>
                <p className="text-sm text-gray-600">2주일 전</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}