'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, checkSupabaseConnection } from '@/lib/supabase/client';
import { validateSupabaseConnection } from '@/lib/env';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database';

type SupabaseContextType = {
  supabase: SupabaseClient<Database>;
  user: User | null;
  loading: boolean;
  isConnected: boolean;
  connectionError: string | null;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Skip Supabase calls during build/server-side rendering
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // 환경 변수 유효성 검사
    const isValidConfig = validateSupabaseConnection();
    if (!isValidConfig) {
      setLoading(false);
      setIsConnected(false);
      setConnectionError('Supabase configuration is not properly set');
      console.warn(
        '⚠️ Supabase Provider: Configuration not valid, operating in offline mode'
      );
      return;
    }

    // 초기 연결 및 세션 확인
    const initializeSupabase = async () => {
      try {
        // 연결 테스트
        const connectionTest = await checkSupabaseConnection();
        setIsConnected(connectionTest);

        if (!connectionTest) {
          setConnectionError('Failed to connect to Supabase database');
          setLoading(false);
          return;
        }

        // 세션 확인
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.warn('Session error:', sessionError.message);
          setConnectionError(sessionError.message);
        }

        setUser(session?.user ?? null);
        setConnectionError(null);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        setConnectionError(
          error instanceof Error ? error.message : 'Unknown error'
        );
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    initializeSupabase();

    // 인증 상태 변경 리스너 (연결이 성공한 경우에만)
    let subscription: { subscription: { unsubscribe: () => void } } | null =
      null;

    if (isValidConfig) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );
      subscription = data;
    }

    return () => {
      if (subscription) {
        subscription.subscription.unsubscribe();
      }
    };
  }, [supabase]);

  const value = {
    supabase,
    user,
    loading,
    isConnected,
    connectionError,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}
