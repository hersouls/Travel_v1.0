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
  {
    id: 'trip-4',
    user_id: 'mock-user-id-123',
    title: '방콕 태국 여행',
    country: '태국',
    start_date: '2024-06-10',
    end_date: '2024-06-17',
    cover_image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=400&fit=crop',
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-04-01T00:00:00Z',
  },
  {
    id: 'trip-5',
    user_id: 'mock-user-id-123',
    title: '로마 이탈리아 여행',
    country: '이탈리아',
    start_date: '2024-07-01',
    end_date: '2024-07-08',
    cover_image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=400&fit=crop',
    created_at: '2024-05-01T00:00:00Z',
    updated_at: '2024-05-01T00:00:00Z',
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
  // 태국 여행 계획
  {
    id: 'plan-7',
    trip_id: 'trip-4',
    day: 1,
    place_name: '왓 프라 케오',
    start_time: '08:00',
    end_time: '10:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=300&fit=crop',
    ],
    memo: '에메랄드 부처가 있는 사원',
    latitude: 13.7500,
    longitude: 100.4913,
    address: 'Na Phra Lan Rd, Phra Nakhon, Bangkok 10200, Thailand',
    rating: 4.6,
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-04-01T00:00:00Z',
  },
  {
    id: 'plan-8',
    trip_id: 'trip-4',
    day: 1,
    place_name: '차오프라야 강 크루즈',
    start_time: '18:00',
    end_time: '20:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=300&fit=crop',
    ],
    memo: '강변의 아름다운 전경을 감상',
    latitude: 13.7563,
    longitude: 100.5018,
    address: 'Chao Phraya River, Bangkok, Thailand',
    rating: 4.5,
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-04-01T00:00:00Z',
  },
  // 이탈리아 여행 계획
  {
    id: 'plan-9',
    trip_id: 'trip-5',
    day: 1,
    place_name: '콜로세움',
    start_time: '09:00',
    end_time: '11:30',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop',
    ],
    memo: '고대 로마의 원형 경기장',
    latitude: 41.8902,
    longitude: 12.4922,
    address: 'Piazza del Colosseo, 1, 00184 Roma RM, Italy',
    rating: 4.8,
    created_at: '2024-05-01T00:00:00Z',
    updated_at: '2024-05-01T00:00:00Z',
  },
  {
    id: 'plan-10',
    trip_id: 'trip-5',
    day: 1,
    place_name: '바티칸 박물관',
    start_time: '14:00',
    end_time: '17:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop',
    ],
    memo: '시스티나 성당과 바티칸 예술품',
    latitude: 41.9029,
    longitude: 12.4534,
    address: '00120 Vatican City',
    rating: 4.9,
    created_at: '2024-05-01T00:00:00Z',
    updated_at: '2024-05-01T00:00:00Z',
  },
  // 추가 계획들 (Day 2, 3 등)
  {
    id: 'plan-11',
    trip_id: 'trip-1',
    day: 2,
    place_name: '도쿄 스카이트리',
    start_time: '10:00',
    end_time: '12:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    ],
    memo: '도쿄의 전망대',
    latitude: 35.7100,
    longitude: 139.8107,
    address: '1 Chome-1-2 Oshiage, Sumida City, Tokyo 131-0045, Japan',
    rating: 4.6,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'plan-12',
    trip_id: 'trip-1',
    day: 2,
    place_name: '아사쿠사 센소지',
    start_time: '14:00',
    end_time: '16:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=300&fit=crop',
    ],
    memo: '도쿄에서 가장 오래된 사원',
    latitude: 35.7148,
    longitude: 139.7967,
    address: '2-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan',
    rating: 4.4,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'plan-13',
    trip_id: 'trip-2',
    day: 2,
    place_name: '노트르담 대성당',
    start_time: '09:00',
    end_time: '11:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1502602898534-47d3c0c8705b?w=400&h=300&fit=crop',
    ],
    memo: '고딕 건축의 걸작',
    latitude: 48.8530,
    longitude: 2.3499,
    address: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris, France',
    rating: 4.7,
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
  },
  {
    id: 'plan-14',
    trip_id: 'trip-3',
    day: 2,
    place_name: '센트럴 파크',
    start_time: '10:00',
    end_time: '12:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    ],
    memo: '뉴욕의 녹지 공간',
    latitude: 40.7829,
    longitude: -73.9654,
    address: 'Central Park, New York, NY, USA',
    rating: 4.8,
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

  createTrip: async (tripData: Partial<Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at'>> & {
    tripTitle?: string;
    startDate?: string;
    endDate?: string;
    coverImage?: string;
  }): Promise<ApiResponse<Trip>> => {
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      user_id: 'mock-user-id-123',
      title: tripData.tripTitle || tripData.title || '새로운 여행',
      country: tripData.country || '미정',
      start_date: tripData.startDate || tripData.start_date || new Date().toISOString().split('T')[0],
      end_date: tripData.endDate || tripData.end_date || new Date().toISOString().split('T')[0],
      cover_image: tripData.coverImage || tripData.cover_image || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop',
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

  createPlan: async (planData: Partial<Omit<Plan, 'id' | 'created_at' | 'updated_at'>> & {
    tripId?: string;
    placeName?: string;
    startTime?: string;
    endTime?: string;
    youtubeLink?: string;
  }): Promise<ApiResponse<Plan>> => {
    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      trip_id: planData.tripId || planData.trip_id || 'unknown-trip',
      day: planData.day || 1,
      place_name: planData.placeName || planData.place_name || '',
      start_time: planData.startTime || planData.start_time || '',
      end_time: planData.endTime || planData.end_time || '',
      type: planData.type || 'other',
      photos: planData.photos || [],
      youtube_link: planData.youtubeLink || planData.youtube_link || '',
      memo: planData.memo || '',
      latitude: planData.latitude || 0,
      longitude: planData.longitude || 0,
      address: planData.address || '',
      rating: planData.rating || 0,
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
    color: 'bg-primary-500',
    icon: '🏨',
  },
  attraction: {
    label: '관광',
    color: 'bg-success-500',
    icon: '🏛️',
  },
  restaurant: {
    label: '식당',
    color: 'bg-accent-500',
    icon: '🍽️',
  },
  transport: {
    label: '교통',
    color: 'bg-secondary-500',
    icon: '🚇',
  },
  other: {
    label: '기타',
    color: 'bg-secondary-400',
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

// Mock Google Places API 응답 데이터
export const mockGooglePlaces = [
  {
    place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    name: '시부야 스크램블 교차로',
    address: 'Shibuya, Tokyo, Japan',
    latitude: 35.6595,
    longitude: 139.7004,
    rating: 4.5,
    opening_hours: '24시간',
    website: 'https://www.shibuya-scramble-square.com',
    price_level: 2,
    photos: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    ],
  },
  {
    place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY5',
    name: '하라주쿠',
    address: 'Harajuku, Tokyo, Japan',
    latitude: 35.6702,
    longitude: 139.7016,
    rating: 4.3,
    opening_hours: '10:00-20:00',
    website: 'https://www.harajuku.com',
    price_level: 1,
    photos: [
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=300&fit=crop',
    ],
  },
  {
    place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY6',
    name: '에펠탑',
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
    latitude: 48.8584,
    longitude: 2.2945,
    rating: 4.7,
    opening_hours: '09:00-23:45',
    website: 'https://www.toureiffel.paris',
    price_level: 3,
    photos: [
      'https://images.unsplash.com/photo-1502602898534-47d3c0c8705b?w=400&h=300&fit=crop',
    ],
  },
  {
    place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY7',
    name: '루브르 박물관',
    address: 'Rue de Rivoli, 75001 Paris, France',
    latitude: 48.8606,
    longitude: 2.3376,
    rating: 4.9,
    opening_hours: '09:00-18:00',
    website: 'https://www.louvre.fr',
    price_level: 3,
    photos: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    ],
  },
  {
    place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY8',
    name: '타임스퀘어',
    address: 'Manhattan, NY 10036, USA',
    latitude: 40.7580,
    longitude: -73.9855,
    rating: 4.4,
    opening_hours: '24시간',
    website: 'https://www.timessquarenyc.org',
    price_level: 2,
    photos: [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    ],
  },
];

// Mock 장소 검색 함수
export const mockSearchPlaces = async (query: string) => {
  // 실제 Google Places API 호출을 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 500)); // 500ms 지연
  
  const filteredPlaces = mockGooglePlaces.filter(place =>
    place.name.toLowerCase().includes(query.toLowerCase()) ||
    place.address.toLowerCase().includes(query.toLowerCase())
  );
  
  return {
    success: true,
    data: filteredPlaces,
  };
};