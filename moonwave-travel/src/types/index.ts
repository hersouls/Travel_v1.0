// User 타입
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Trip (여행일정) 타입
export interface Trip {
  id: string;
  user_id: string;
  title: string;
  country: string;
  start_date: string;
  end_date: string;
  cover_image?: string;
  created_at: string;
  updated_at: string;
  plans?: Plan[];
}

// Plan (여행계획) 타입
export interface Plan {
  id: string;
  trip_id: string;
  day: number;
  place_name: string;
  start_time?: string;
  end_time?: string;
  type: 'accommodation' | 'attraction' | 'restaurant' | 'transport' | 'other';
  photos: string[];
  youtube_url?: string;
  youtube_link?: string; // 호환성을 위한 별칭
  memo?: string;
  google_place_id?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  rating?: number;
  website?: string;
  phone?: string;
  opening_hours?: string;
  price_level?: number;
  created_at: string;
  updated_at: string;
}

// Google Place API 응답 타입
export interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  website?: string;
  formatted_phone_number?: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text?: string[];
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  types: string[];
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 폼 데이터 타입
export interface CreateTripForm {
  title: string;
  country: string;
  start_date: string;
  end_date: string;
  cover_image?: File;
}

export interface CreatePlanForm {
  day: number;
  place_name: string;
  start_time?: string;
  end_time?: string;
  type: Plan['type'];
  photos: File[];
  youtube_url?: string;
  memo?: string;
  google_place_id?: string;
}

// 필터 및 정렬 타입
export interface TripFilters {
  country?: string;
  start_date?: string;
  end_date?: string;
}

export interface PlanFilters {
  day?: number;
  type?: Plan['type'];
}

// 지도 관련 타입
export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  type: Plan['type'];
  plan?: Plan;
}

// 인증 관련 타입
export interface AuthState {
  user: User | null;
  loading: boolean;
  error?: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  name?: string;
}