'use client';

import React, { useState } from 'react';
import { Plus, Search, Map, Calendar, User } from 'lucide-react';
import { mockTrips } from '@/utils/mockData';
import TripCard from '@/components/TripCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Trip } from '@/types';

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = trips.filter(trip =>
    trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTrip = () => {
    // TODO: 여행 생성 모달 또는 페이지로 이동
    console.log('Create new trip');
  };

  const handleTripClick = (trip: Trip) => {
    // TODO: 여행 상세 페이지로 이동
    console.log('Trip clicked:', trip.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                🌍 Moonwave Travel
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Map className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Calendar className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 및 필터 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="여행 제목이나 국가로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button onClick={handleCreateTrip} className="w-full sm:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              새 여행 만들기
            </Button>
          </div>
        </div>

        {/* 여행 카드 그리드 */}
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => handleTripClick(trip)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🌍</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? '검색 결과가 없습니다' : '아직 여행이 없습니다'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? '다른 검색어를 시도해보세요.'
                : '첫 번째 여행을 만들어보세요!'
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateTrip}>
                <Plus className="w-5 h-5 mr-2" />
                여행 시작하기
              </Button>
            )}
          </div>
        )}

        {/* 통계 정보 */}
        {trips.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 여행</p>
                  <p className="text-2xl font-bold text-gray-900">{trips.length}개</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Map className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">방문 국가</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(trips.map(trip => trip.country)).size}개
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 계획</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {trips.reduce((total, trip) => total + (trip.plans?.length || 0), 0)}개
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
