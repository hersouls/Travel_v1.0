import { User, Trip, Plan, ApiResponse } from '@/types';

// Mock 사용자 데이터
export const mockUser: User = {
  id: 'mock-user-id-123',
  email: 'user@example.com',
  name: '테스트 사용자',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Mock 여행 데이터
export const mockTrips: Trip[] = [
  {
    id: 'trip-1',
    user_id: 'mock-user-id-123',
    title: '도쿄 여행',
    country: '일본',
    start_date: '2024-03-15',
    end_date: '2024-03-22',
    cover_image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'trip-2',
    user_id: 'mock-user-id-123',
    title: '파리 로맨틱 여행',
    country: '프랑스',
    start_date: '2024-04-10',
    end_date: '2024-04-17',
    cover_image: 'https://images.unsplash.com/photo-1502602898534-47d3c0c8705b?w=800&h=400&fit=crop',
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
  },
  {
    id: 'trip-3',
    user_id: 'mock-user-id-123',
    title: '뉴욕 도시 탐험',
    country: '미국',
    start_date: '2024-05-20',
    end_date: '2024-05-27',
    cover_image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
];

// Mock 여행 계획 데이터
export const mockPlans: Plan[] = [
  // 도쿄 여행 계획
  {
    id: 'plan-1',
    trip_id: 'trip-1',
    day: 1,
    place_name: '시부야 스크램블 교차로',
    start_time: '09:00',
    end_time: '11:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=300&fit=crop',
    ],
    memo: '세계에서 가장 붐비는 교차로 중 하나',
    latitude: 35.6595,
    longitude: 139.7004,
    address: 'Shibuya, Tokyo, Japan',
    rating: 4.5,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'plan-2',
    trip_id: 'trip-1',
    day: 1,
    place_name: '하라주쿠',
    start_time: '11:30',
    end_time: '14:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=300&fit=crop',
    ],
    memo: '젊은이들의 패션 거리',
    latitude: 35.6702,
    longitude: 139.7016,
    address: 'Harajuku, Tokyo, Japan',
    rating: 4.3,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'plan-3',
    trip_id: 'trip-1',
    day: 1,
    place_name: '스시로',
    start_time: '19:00',
    end_time: '21:00',
    type: 'restaurant',
    photos: [
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    ],
    memo: '전통 스시 맛집',
    latitude: 35.6762,
    longitude: 139.6503,
    address: 'Ginza, Tokyo, Japan',
    rating: 4.8,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  // 파리 여행 계획
  {
    id: 'plan-4',
    trip_id: 'trip-2',
    day: 1,
    place_name: '에펠탑',
    start_time: '10:00',
    end_time: '12:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1502602898534-47d3c0c8705b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop',
    ],
    memo: '파리의 상징적인 랜드마크',
    latitude: 48.8584,
    longitude: 2.2945,
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
    rating: 4.7,
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
  },
  {
    id: 'plan-5',
    trip_id: 'trip-2',
    day: 1,
    place_name: '루브르 박물관',
    start_time: '14:00',
    end_time: '17:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    ],
    memo: '세계 최대의 예술 박물관',
    latitude: 48.8606,
    longitude: 2.3376,
    address: 'Rue de Rivoli, 75001 Paris, France',
    rating: 4.9,
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
  },
  // 뉴욕 여행 계획
  {
    id: 'plan-6',
    trip_id: 'trip-3',
    day: 1,
    place_name: '타임스퀘어',
    start_time: '09:00',
    end_time: '11:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
    ],
    memo: '세계의 교차로',
    latitude: 40.7580,
    longitude: -73.9855,
    address: 'Manhattan, NY 10036, USA',
    rating: 4.4,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
];

// Mock 데이터 서비스 함수들
export const mockDataService = {
  // 사용자 관련
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return {
      success: true,
      data: mockUser,
    };
  },

  // 여행 관련
  getTrips: async (): Promise<ApiResponse<Trip[]>> => {
    return {
      success: true,
      data: mockTrips,
    };
  },

  getTripById: async (id: string): Promise<ApiResponse<Trip>> => {
    const trip = mockTrips.find(t => t.id === id);
    if (!trip) {
      return {
        success: false,
        error: 'Trip not found',
      };
    }
    
    // 해당 여행의 계획들도 포함
    const tripWithPlans = {
      ...trip,
      plans: mockPlans.filter(p => p.trip_id === id),
    };
    
    return {
      success: true,
      data: tripWithPlans,
    };
  },

  createTrip: async (tripData: Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Trip>> => {
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      user_id: 'mock-user-id-123',
      ...tripData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockTrips.push(newTrip);
    
    return {
      success: true,
      data: newTrip,
    };
  },

  updateTrip: async (id: string, tripData: Partial<Trip>): Promise<ApiResponse<Trip>> => {
    const tripIndex = mockTrips.findIndex(t => t.id === id);
    if (tripIndex === -1) {
      return {
        success: false,
        error: 'Trip not found',
      };
    }
    
    mockTrips[tripIndex] = {
      ...mockTrips[tripIndex],
      ...tripData,
      updated_at: new Date().toISOString(),
    };
    
    return {
      success: true,
      data: mockTrips[tripIndex],
    };
  },

  deleteTrip: async (id: string): Promise<ApiResponse<void>> => {
    const tripIndex = mockTrips.findIndex(t => t.id === id);
    if (tripIndex === -1) {
      return {
        success: false,
        error: 'Trip not found',
      };
    }
    
    mockTrips.splice(tripIndex, 1);
    
    return {
      success: true,
    };
  },

  // 여행 계획 관련
  getPlansByTripId: async (tripId: string): Promise<ApiResponse<Plan[]>> => {
    const plans = mockPlans.filter(p => p.trip_id === tripId);
    return {
      success: true,
      data: plans,
    };
  },

  createPlan: async (planData: Omit<Plan, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Plan>> => {
    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      ...planData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockPlans.push(newPlan);
    
    return {
      success: true,
      data: newPlan,
    };
  },

  updatePlan: async (id: string, planData: Partial<Plan>): Promise<ApiResponse<Plan>> => {
    const planIndex = mockPlans.findIndex(p => p.id === id);
    if (planIndex === -1) {
      return {
        success: false,
        error: 'Plan not found',
      };
    }
    
    mockPlans[planIndex] = {
      ...mockPlans[planIndex],
      ...planData,
      updated_at: new Date().toISOString(),
    };
    
    return {
      success: true,
      data: mockPlans[planIndex],
    };
  },

  deletePlan: async (id: string): Promise<ApiResponse<void>> => {
    const planIndex = mockPlans.findIndex(p => p.id === id);
    if (planIndex === -1) {
      return {
        success: false,
        error: 'Plan not found',
      };
    }
    
    mockPlans.splice(planIndex, 1);
    
    return {
      success: true,
    };
  },
};

// 인증 관련 Mock 함수들
export const mockAuthService = {
  signIn: async (email: string, password: string): Promise<ApiResponse<User>> => {
    // 간단한 Mock 인증
    if (email === 'user@example.com' && password === 'password') {
      return {
        success: true,
        data: mockUser,
      };
    }
    
    return {
      success: false,
      error: 'Invalid credentials',
    };
  },

  signUp: async (email: string, password: string, name?: string): Promise<ApiResponse<User>> => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: name || 'New User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return {
      success: true,
      data: newUser,
    };
  },

  signOut: async (): Promise<ApiResponse<void>> => {
    return {
      success: true,
    };
  },

  getCurrentUser: async (): Promise<ApiResponse<User | null>> => {
    return {
      success: true,
      data: mockUser,
    };
  },
};

// 계획 타입별 아이콘 및 색상
export const planTypeConfig = {
  accommodation: {
    label: '숙박',
    color: 'bg-blue-500',
    icon: '🏨',
  },
  attraction: {
    label: '관광',
    color: 'bg-green-500',
    icon: '🏛️',
  },
  restaurant: {
    label: '식당',
    color: 'bg-orange-500',
    icon: '🍽️',
  },
  transport: {
    label: '교통',
    color: 'bg-purple-500',
    icon: '🚇',
  },
  other: {
    label: '기타',
    color: 'bg-gray-500',
    icon: '📍',
  },
} as const;

// 국가 목록
export const countries = [
  '일본', '한국', '중국', '태국', '베트남', '싱가포르', '말레이시아',
  '프랑스', '이탈리아', '스페인', '독일', '영국', '네덜란드', '스위스',
  '미국', '캐나다', '멕시코', '브라질', '아르헨티나',
  '호주', '뉴질랜드', '피지',
  '터키', '이집트', '모로코', '남아프리카공화국',
];