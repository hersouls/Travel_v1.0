export const mockTravel = {
  id: 'test-travel-id',
  user_id: 'test-user-id',
  title: '제주도 여행',
  destination: '제주도',
  start_date: '2025-08-15',
  end_date: '2025-08-20',
  status: 'planning' as const,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  description: '제주도 가족 여행',
  budget: 500000,
  currency: 'KRW' as const,
  is_public: false,
  cover_image_url: null,
};

export const mockTravelList = [
  mockTravel,
  {
    ...mockTravel,
    id: 'test-travel-id-2',
    title: '부산 여행',
    destination: '부산',
    start_date: '2025-09-01',
    end_date: '2025-09-03',
  },
  {
    ...mockTravel,
    id: 'test-travel-id-3',
    title: '서울 여행',
    destination: '서울',
    start_date: '2025-10-01',
    end_date: '2025-10-05',
  },
];

export const mockTravelDay = {
  id: 'test-day-id',
  travel_plan_id: 'test-travel-id',
  day_number: 1,
  date: '2025-08-15',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

export const mockTravelPlan = {
  id: 'test-plan-id',
  travel_day_id: 'test-day-id',
  place_name: '성산일출봉',
  place_id: 'ChIJ...',
  planned_time: '09:00',
  duration: 120,
  plan_type: 'sightseeing' as const,
  notes: '일출 보기',
  latitude: 33.4581,
  longitude: 126.9425,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};