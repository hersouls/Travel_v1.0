import { Trip, Plan, User } from '@/types';

// Mock 사용자 데이터
export const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: '여행자',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Mock 여행일정 데이터
export const mockTrips: Trip[] = [
  {
    id: '1',
    user_id: '1',
    title: '도쿄 3박 4일 여행',
    country: '일본',
    start_date: '2024-03-15',
    end_date: '2024-03-18',
    cover_image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    user_id: '1',
    title: '파리 로맨틱 여행',
    country: '프랑스',
    start_date: '2024-04-20',
    end_date: '2024-04-25',
    cover_image: 'https://images.unsplash.com/photo-1502602898534-47d22c0d8064?w=400&h=300&fit=crop',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    user_id: '1',
    title: '뉴욕 도시 탐험',
    country: '미국',
    start_date: '2024-05-10',
    end_date: '2024-05-15',
    cover_image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
  },
];

// Mock 여행계획 데이터
export const mockPlans: Plan[] = [
  // 도쿄 여행 계획
  {
    id: '1',
    trip_id: '1',
    day: 1,
    place_name: '도쿄 타워',
    start_time: '09:00',
    end_time: '11:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=300&h=200&fit=crop',
    ],
    youtube_url: 'https://www.youtube.com/watch?v=example1',
    memo: '도쿄의 상징적인 랜드마크! 야경이 특히 아름다워요.',
    google_place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    latitude: 35.6586,
    longitude: 139.7454,
    address: '4 Chome-2-8 Shibakoen, Minato City, Tokyo 105-0011, Japan',
    rating: 4.3,
    website: 'https://www.tokyotower.co.jp/',
    phone: '+81 3-3433-5111',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00Z',
  },
  {
    id: '2',
    trip_id: '1',
    day: 1,
    place_name: '스시로',
    start_time: '12:00',
    end_time: '13:30',
    type: 'restaurant',
    photos: [
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
    ],
    memo: '미쉐린 스타 레스토랑. 예약 필수!',
    google_place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY5',
    latitude: 35.6587,
    longitude: 139.7455,
    address: 'Ginza, Chuo City, Tokyo, Japan',
    rating: 4.8,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    trip_id: '1',
    day: 1,
    place_name: '도쿄 호텔',
    start_time: '15:00',
    end_time: '16:00',
    type: 'accommodation',
    photos: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop',
    ],
    memo: '체크인 후 짐 풀고 휴식',
    google_place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY6',
    latitude: 35.6588,
    longitude: 139.7456,
    address: 'Shinjuku City, Tokyo, Japan',
    rating: 4.5,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  // 파리 여행 계획
  {
    id: '4',
    trip_id: '2',
    day: 1,
    place_name: '에펠탑',
    start_time: '10:00',
    end_time: '12:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1502602898534-47d22c0d8064?w=300&h=200&fit=crop',
    ],
    memo: '파리의 상징! 아침에 가면 사람이 적어서 좋아요.',
    google_place_id: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
    latitude: 48.8584,
    longitude: 2.2945,
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
    rating: 4.6,
    website: 'https://www.toureiffel.paris/',
    phone: '+33 892 70 12 39',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: '5',
    trip_id: '2',
    day: 1,
    place_name: '르 루브르',
    start_time: '14:00',
    end_time: '17:00',
    type: 'attraction',
    photos: [
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=300&h=200&fit=crop',
    ],
    memo: '모나리자를 보기 위해 일찍 가야 해요.',
    google_place_id: 'ChIJD7fiBh9u5kcRYJSMaMOCCwR',
    latitude: 48.8606,
    longitude: 2.3376,
    address: 'Rue de Rivoli, 75001 Paris, France',
    rating: 4.7,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
];

// Mock 데이터 생성 함수
export const generateMockTrip = (overrides: Partial<Trip> = {}): Trip => {
  const defaultTrip: Trip = {
    id: Math.random().toString(36).substr(2, 9),
    user_id: '1',
    title: '새로운 여행',
    country: '일본',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    cover_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  return { ...defaultTrip, ...overrides };
};

export const generateMockPlan = (tripId: string, overrides: Partial<Plan> = {}): Plan => {
  const defaultPlan: Plan = {
    id: Math.random().toString(36).substr(2, 9),
    trip_id: tripId,
    day: 1,
    place_name: '새로운 장소',
    start_time: '10:00',
    end_time: '12:00',
    type: 'attraction',
    photos: [],
    memo: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  return { ...defaultPlan, ...overrides };
};

// 국가 목록
export const countries = [
  '일본', '한국', '중국', '태국', '베트남', '싱가포르', '말레이시아',
  '프랑스', '이탈리아', '스페인', '독일', '영국', '네덜란드', '스위스',
  '미국', '캐나다', '멕시코', '브라질', '아르헨티나',
  '호주', '뉴질랜드', '피지',
  '터키', '이집트', '모로코', '남아프리카공화국',
];

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