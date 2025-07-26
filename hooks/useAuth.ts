'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setAuthState((prev) => ({
            ...prev,
            error: error.message,
            loading: false,
          }));
          return;
        }

        setAuthState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          loading: false,
          error: null,
        }));
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          error: '인증 상태를 확인할 수 없습니다.',
          loading: false,
        }));
      }
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthState((prev) => ({
        ...prev,
        user: session?.user ?? null,
        loading: false,
        error: null,
      }));

      if (event === 'SIGNED_IN') {
        router.push('/travels');
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        router.push('/');
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, router]);

  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signOut();

      if (error) {
        setAuthState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      } else {
        setAuthState((prev) => ({
          ...prev,
          user: null,
          loading: false,
          error: null,
        }));
        router.push('/');
      }
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: '로그아웃 중 문제가 발생했습니다.',
        loading: false,
      }));
    }
  };

  const signInWithEmail = async (email: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/travels`,
        },
      });

      if (error) {
        setAuthState((prev) => ({
          ...prev,
          error:
            error.message === 'Invalid login credentials'
              ? '유효하지 않은 이메일 주소입니다.'
              : '로그인 중 문제가 발생했습니다.',
          loading: false,
        }));
        return false;
      }

      setAuthState((prev) => ({ ...prev, loading: false, error: null }));
      return true;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: '네트워크 오류가 발생했습니다.',
        loading: false,
      }));
      return false;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/travels`,
        },
      });

      if (error) {
        setAuthState((prev) => ({
          ...prev,
          error: '구글 로그인 중 문제가 발생했습니다.',
          loading: false,
        }));
        return false;
      }

      // Don't set loading to false here as user will be redirected
      return true;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: '네트워크 오류가 발생했습니다.',
        loading: false,
      }));
      return false;
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: !!authState.user,
    signOut,
    signInWithEmail,
    signInWithGoogle,
  };
}
