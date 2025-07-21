'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Map, Calendar, User, Grid, List, Globe, TrendingUp, Users, Settings } from 'lucide-react';
import TripCard from '@/components/TripCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/DropdownMenu';
import { Trip } from '@/types';
import { cn } from '@/utils/helpers';
import { dataService } from '@/lib/dataService';

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  // 여행 데이터 로드
  useEffect(() => {
    const loadTrips = async () => {
      try {
        setLoading(true);
        const response = await dataService.getTrips();
        if (response.success && response.data) {
          setTrips(response.data);
        }
      } catch (error) {
        console.error('Failed to load trips:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || trip.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const countries = Array.from(new Set(trips.map(trip => trip.country)));

  const handleCreateTrip = () => {
    router.push('/trips/create');
  };

  const handleTripClick = (trip: Trip) => {
    router.push(`/trips/${trip.id}`);
  };

  const totalPlans = trips.reduce((total, trip) => total + (trip.plans?.length || 0), 0);
  const uniqueCountries = new Set(trips.map(trip => trip.country)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
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
              
              <DropdownMenu
                trigger={
                  <Button variant="ghost" size="sm">
                    <Avatar size="sm" fallback="U" />
                  </Button>
                }
                align="right"
              >
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  프로필
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  설정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 히어로 섹션 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            여행의 모든 순간을 특별하게
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Moonwave Travel과 함께 여행을 계획하고, 기록하고, 공유하세요. 
            모든 여행이 특별한 추억이 됩니다.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-4">
            <Badge variant="default">
              <Globe className="w-3 h-3 mr-1" />
              {uniqueCountries}개 국가
            </Badge>
            <Badge variant="secondary">
              <TrendingUp className="w-3 h-3 mr-1" />
              {totalPlans}개 계획
            </Badge>
            <Badge variant="outline">
              <Users className="w-3 h-3 mr-1" />
              {trips.length}개 여행
            </Badge>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="여행 제목이나 국가로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-md"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-md"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              <Button onClick={handleCreateTrip} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" />
                새 여행 만들기
              </Button>
            </div>
          </div>

          {/* 국가 필터 */}
          {countries.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <Button
                variant={selectedCountry === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCountry('')}
                className="whitespace-nowrap"
              >
                전체
              </Button>
              {countries.map((country) => (
                <Button
                  key={country}
                  variant={selectedCountry === country ? 'default' : 'outline'}
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
        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              여행 데이터를 불러오는 중...
            </h3>
            <p className="text-gray-600">잠시만 기다려주세요</p>
          </div>
        ) : filteredTrips.length > 0 ? (
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
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || selectedCountry ? '검색 결과가 없습니다' : '아직 여행이 없습니다'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedCountry 
                ? '다른 검색어를 시도해보거나 필터를 초기화해보세요.'
                : '첫 번째 여행을 만들어보세요! 여행의 모든 순간을 특별하게 만들어드릴게요.'
              }
            </p>
            {!searchTerm && !selectedCountry && (
              <Button onClick={handleCreateTrip} size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" />
                여행 시작하기
              </Button>
            )}
          </div>
        )}

        {/* 통계 정보 */}
        {trips.length > 0 && (
          <div className="mt-16">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">여행 통계</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
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
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Map className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">방문 국가</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {uniqueCountries}개
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">총 계획</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalPlans}개
                    </p>
                  </div>
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
