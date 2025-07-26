'use client'

import { useState } from 'react'
import { useTravelPlans } from '@/lib/hooks/useTravelPlans'
import TravelCard from './TravelCard'
import { TravelStatus } from '@/lib/types/database'

interface TravelListProps {
  status?: TravelStatus
  limit?: number
}

export default function TravelList({ status, limit }: TravelListProps) {
  const { data: travels, loading, error } = useTravelPlans({ status, limit })
  const [selectedStatus, setSelectedStatus] = useState<TravelStatus | 'all'>('all')

  if (loading) {
    return <div>여행 목록을 불러오는 중...</div>
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">여행 목록을 불러오는데 실패했습니다.</p>
        <p className="text-gray-500 text-sm break-keep-ko">{error}</p>
      </div>
    )
  }

  if (!travels || travels.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            아직 여행 계획이 없습니다
          </h3>
          <p className="text-gray-600 break-keep-ko">
            첫 번째 여행 계획을 만들어보세요!
          </p>
        </div>
      </div>
    )
  }

  // 상태별 필터링
  const filteredTravels = selectedStatus === 'all' 
    ? travels 
    : travels.filter(travel => travel.status === selectedStatus)

  // 상태별 카운트
  const statusCounts = {
    all: travels.length,
    planning: travels.filter(t => t.status === 'planning').length,
    ongoing: travels.filter(t => t.status === 'ongoing').length,
    completed: travels.filter(t => t.status === 'completed').length,
    cancelled: travels.filter(t => t.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      {/* 상태 필터 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedStatus === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체 ({statusCounts.all})
        </button>
        <button
          onClick={() => setSelectedStatus('planning')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedStatus === 'planning'
              ? 'bg-travel-city text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          계획중 ({statusCounts.planning})
        </button>
        <button
          onClick={() => setSelectedStatus('ongoing')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedStatus === 'ongoing'
              ? 'bg-travel-adventure text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          진행중 ({statusCounts.ongoing})
        </button>
        <button
          onClick={() => setSelectedStatus('completed')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedStatus === 'completed'
              ? 'bg-travel-mountain text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          완료됨 ({statusCounts.completed})
        </button>
      </div>

      {/* 여행 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTravels.map((travel) => (
          <TravelCard key={travel.id} travel={travel} />
        ))}
      </div>

      {filteredTravels.length === 0 && selectedStatus !== 'all' && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {selectedStatus === 'planning' && '계획중인 여행이 없습니다.'}
            {selectedStatus === 'ongoing' && '진행중인 여행이 없습니다.'}
            {selectedStatus === 'completed' && '완료된 여행이 없습니다.'}
            {selectedStatus === 'cancelled' && '취소된 여행이 없습니다.'}
          </p>
        </div>
      )}
    </div>
  )
}