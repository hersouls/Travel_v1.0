'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { getKoreanErrorMessage, logError } from '@/lib/utils/errorHandling';

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
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          logError(error, 'auth', 'getSession');
          setAuthState((prev) => ({
            ...prev,
            error: getKoreanErrorMessage(error, 'auth'),
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
        logError(error, 'auth', 'getSession');
        setAuthState((prev) => ({
          ...prev,
          error: getKoreanErrorMessage(error, 'auth'),
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
        logError(error, 'auth', 'signOut');
        setAuthState((prev) => ({
          ...prev,
          error: getKoreanErrorMessage(error, 'auth'),
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
      logError(error, 'auth', 'signOut');
      setAuthState((prev) => ({
        ...prev,
        error: getKoreanErrorMessage(error, 'auth'),
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
        logError(error, 'auth', 'signInWithEmail');
        setAuthState((prev) => ({
          ...prev,
          error: getKoreanErrorMessage(error, 'auth'),
          loading: false,
        }));
        return false;
      }

      setAuthState((prev) => ({ ...prev, loading: false, error: null }));
      return true;
    } catch (error) {
      logError(error, 'auth', 'signInWithEmail');
      setAuthState((prev) => ({
        ...prev,
        error: getKoreanErrorMessage(error, 'auth'),
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
          redirectTo: `${window.location.origin}/auth/callback?next=/travels`,
        },
      });

      if (error) {
        logError(error, 'auth', 'signInWithGoogle');
        setAuthState((prev) => ({
          ...prev,
          error: getKoreanErrorMessage(error, 'auth'),
          loading: false,
        }));
        return false;
      }

      // Don't set loading to false here as user will be redirected
      return true;
    } catch (error) {
      logError(error, 'auth', 'signInWithGoogle');
      setAuthState((prev) => ({
        ...prev,
        error: getKoreanErrorMessage(error, 'auth'),
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
