'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, checkSupabaseConnection } from '@/lib/supabase/client';
import { validateSupabaseConnection } from '@/lib/env';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database';
import { getKoreanErrorMessage, logError } from '@/lib/utils/errorHandling';

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
      setIsConnected(false);
      return;
    }

    // 환경 변수 유효성 검사
    const isValidConfig = validateSupabaseConnection();
    if (!isValidConfig) {
      setLoading(false);
      setIsConnected(false);
      const configError = { message: 'Missing environment variables' };
      logError(configError, 'config', 'validation');
      setConnectionError(getKoreanErrorMessage(configError, 'config'));
      console.warn(
        '⚠️ Supabase Provider: Configuration not valid, operating in offline mode'
      );
      return;
    }

    // 초기 연결 및 세션 확인
    const initializeSupabase = async () => {
      // 타임아웃 설정 (5초)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 5000);
      });

      try {
        // 연결 테스트 (타임아웃 적용)
        const connectionPromise = checkSupabaseConnection();
        const connectionTest = await Promise.race([connectionPromise, timeoutPromise]) as boolean;
        
        setIsConnected(connectionTest);

        if (!connectionTest) {
          const connectionError = { message: 'Failed to connect' };
          logError(connectionError, 'connection', 'test');
          setConnectionError(
            getKoreanErrorMessage(connectionError, 'connection')
          );
          setLoading(false);
          return;
        }

        // 세션 확인 (타임아웃 적용)
        const sessionPromise = supabase.auth.getSession();
        const { data: { session }, error: sessionError } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as { data: { session: any }, error: any };

        if (sessionError) {
          logError(sessionError, 'auth', 'getSession');
          console.warn('Session error:', sessionError.message);
          setConnectionError(getKoreanErrorMessage(sessionError, 'auth'));
        }

        setUser(session?.user ?? null);
        setConnectionError(null);
      } catch (error) {
        logError(error, 'connection', 'initialization');
        console.error('Failed to initialize Supabase:', error);
        setConnectionError(getKoreanErrorMessage(error, 'connection'));
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

          // 인증 상태 변경 시 연결 에러 초기화
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            setConnectionError(null);
          }
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
