'use client';

import React, { useState } from 'react';
import { Plus, Search, Map, Calendar, User, Filter, Grid, List } from 'lucide-react';
import { mockTrips } from '@/utils/mockData';
import TripCard from '@/components/TripCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Trip } from '@/types';
import { cn } from '@/utils/helpers';

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || trip.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const countries = Array.from(new Set(trips.map(trip => trip.country)));

  const handleCreateTrip = () => {
    // TODO: 여행 생성 모달 또는 페이지로 이동
    console.log('Create new trip');
  };

  const handleTripClick = (trip: Trip) => {
    // TODO: 여행 상세 페이지로 이동
    console.log('Trip clicked:', trip.id);
  };

  const totalPlans = trips.reduce((total, trip) => total + (trip.plans?.length || 0), 0);
  const uniqueCountries = new Set(trips.map(trip => trip.country)).size;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* 헤더 */}
      <header className="bg-white shadow-soft border-b border-secondary-200 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">🌍</span>
              </div>
              <h1 className="text-xl font-bold text-secondary-900">
                Moonwave Travel
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Map className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
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
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="여행 제목이나 국가로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="hidden sm:flex"
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
              
              <Button onClick={handleCreateTrip} className="w-full sm:w-auto">
                <Plus className="w-5 h-5 mr-2" />
                새 여행 만들기
              </Button>
            </div>
          </div>

          {/* 국가 필터 */}
          {countries.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={selectedCountry === '' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCountry('')}
                className="whitespace-nowrap"
              >
                전체
              </Button>
              {countries.map((country) => (
                <Button
                  key={country}
                  variant={selectedCountry === country ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCountry(country)}
                  className="whitespace-nowrap"
                >
                  {country}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* 여행 카드 그리드 */}
        {filteredTrips.length > 0 ? (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {/* 생성 카드 */}
            <TripCard
              trip={{} as Trip}
              onClick={handleCreateTrip}
              isCreateCard={true}
            />
            
            {/* 여행 카드들 */}
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => handleTripClick(trip)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">🌍</span>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-3">
              {searchTerm || selectedCountry ? '검색 결과가 없습니다' : '아직 여행이 없습니다'}
            </h3>
            <p className="text-secondary-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedCountry 
                ? '다른 검색어를 시도해보거나 필터를 초기화해보세요.'
                : '첫 번째 여행을 만들어보세요! 여행의 모든 순간을 특별하게 만들어드릴게요.'
              }
            </p>
            {!searchTerm && !selectedCountry && (
              <Button onClick={handleCreateTrip} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                여행 시작하기
              </Button>
            )}
          </div>
        )}

        {/* 통계 정보 */}
        {trips.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">총 여행</p>
                  <p className="text-2xl font-bold text-secondary-900">{trips.length}개</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                  <Map className="w-6 h-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">방문 국가</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {uniqueCountries}개
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-accent-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">총 계획</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {totalPlans}개
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 하단 여백 */}
        <div className="h-8" />
      </main>
    </div>
  );
}
