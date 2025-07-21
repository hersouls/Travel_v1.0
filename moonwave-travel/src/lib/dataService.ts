import { User, Trip, Plan, ApiResponse } from '@/types';
import { mockDataService, mockAuthService } from './mockData';
import { isMockMode } from './supabase';

// 통합 데이터 서비스 - Mock 모드일 때는 Mock 데이터 사용, 나중에 Supabase로 전환 가능
export const dataService = {
  // 사용자 관련
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    if (isMockMode()) {
      return mockDataService.getCurrentUser();
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },

  // 여행 관련
  getTrips: async (): Promise<ApiResponse<Trip[]>> => {
    if (isMockMode()) {
      return mockDataService.getTrips();
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },

  getTripById: async (id: string): Promise<ApiResponse<Trip>> => {
    if (isMockMode()) {
      return mockDataService.getTripById(id);
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },

  createTrip: async (tripData: Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Trip>> => {
    if (isMockMode()) {
      return mockDataService.createTrip(tripData);
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },

  updateTrip: async (id: string, tripData: Partial<Trip>): Promise<ApiResponse<Trip>> => {
    if (isMockMode()) {
      return mockDataService.updateTrip(id, tripData);
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },

  deleteTrip: async (id: string): Promise<ApiResponse<void>> => {
    if (isMockMode()) {
      return mockDataService.deleteTrip(id);
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },

  // 여행 계획 관련
  getPlansByTripId: async (tripId: string): Promise<ApiResponse<Plan[]>> => {
    if (isMockMode()) {
      return mockDataService.getPlansByTripId(tripId);
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },

  createPlan: async (planData: Omit<Plan, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Plan>> => {
    if (isMockMode()) {
      return mockDataService.createPlan(planData);
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },

  updatePlan: async (id: string, planData: Partial<Plan>): Promise<ApiResponse<Plan>> => {
    if (isMockMode()) {
      return mockDataService.updatePlan(id, planData);
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },

  deletePlan: async (id: string): Promise<ApiResponse<void>> => {
    if (isMockMode()) {
      return mockDataService.deletePlan(id);
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },
};

// 통합 인증 서비스
export const authService = {
  signIn: async (email: string, password: string): Promise<ApiResponse<User>> => {
    if (isMockMode()) {
      return mockAuthService.signIn(email, password);
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },

  signUp: async (email: string, password: string, name?: string): Promise<ApiResponse<User>> => {
    if (isMockMode()) {
      return mockAuthService.signUp(email, password, name);
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },

  signOut: async (): Promise<ApiResponse<void>> => {
    if (isMockMode()) {
      return mockAuthService.signOut();
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },

  getCurrentUser: async (): Promise<ApiResponse<User | null>> => {
    if (isMockMode()) {
      return mockAuthService.getCurrentUser();
    }
    // TODO: Supabase 연동 시 여기에 실제 Supabase 코드 추가
    throw new Error('Supabase not implemented yet');
  },
};