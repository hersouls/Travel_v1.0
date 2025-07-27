import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useTravelPlans } from '../useTravelPlans';

// 간단한 모킹
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({ data: [], error: null }),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  })),
  channel: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn(() => ({
      unsubscribe: jest.fn(),
    })),
  })),
};

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

// SupabaseProvider 모킹
jest.mock('@/components/providers/SupabaseProvider', () => ({
  useSupabase: () => ({
    user: mockUser,
    supabase: mockSupabase,
  }),
}));

describe('useTravelPlans', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('초기 상태가 올바르게 설정되어야 함', () => {
    const { result } = renderHook(() => useTravelPlans());

    expect(result.current.loading).toBe(true);
    expect(result.current.travelPlans).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('기본 함수들이 정의되어야 함', () => {
    const { result } = renderHook(() => useTravelPlans());

    expect(typeof result.current.refetch).toBe('function');
    expect(typeof result.current.createTravelPlan).toBe('function');
    expect(typeof result.current.updateTravelPlan).toBe('function');
    expect(typeof result.current.deleteTravelPlan).toBe('function');
  });

  it('실시간 구독이 설정되어야 함', async () => {
    renderHook(() => useTravelPlans());

    await waitFor(() => {
      expect(mockSupabase.channel).toHaveBeenCalledWith(
        'travel_plans_realtime'
      );
    });
  });

  it('Supabase from이 올바른 테이블로 호출되어야 함', async () => {
    renderHook(() => useTravelPlans());

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('travel_plans');
    });
  });
});
