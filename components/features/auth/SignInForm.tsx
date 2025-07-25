'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Mail, Chrome } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getOAuthRedirectUrl } from '@/lib/oauth';

interface AuthError {
  message: string;
  type: 'error' | 'success' | 'info';
}

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<AuthError | null>(null);
  const supabase = createClient();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setAuthMessage({
        message: '이메일 주소를 입력해주세요.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    setAuthMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: getOAuthRedirectUrl('/travels'),
        },
      });

      if (error) {
        setAuthMessage({
          message:
            error.message === 'Invalid login credentials'
              ? '유효하지 않은 이메일 주소입니다.'
              : '로그인 중 문제가 발생했습니다. 다시 시도해주세요.',
          type: 'error',
        });
      } else {
        setAuthMessage({
          message: `${email}로 로그인 링크를 보냈습니다. 이메일을 확인해주세요.`,
          type: 'success',
        });
      }
    } catch {
      setAuthMessage({
        message: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getOAuthRedirectUrl('/travels'),
        },
      });

      if (error) {
        setAuthMessage({
          message: '구글 로그인 중 문제가 발생했습니다. 다시 시도해주세요.',
          type: 'error',
        });
        setIsGoogleLoading(false);
      }
      // If successful, user will be redirected, so we don't need to set loading to false
    } catch {
      setAuthMessage({
        message: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
        type: 'error',
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Google OAuth Button */}
      <Button
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
        className="flex w-full items-center justify-center gap-3 border border-gray-300 bg-white text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
        variant="outline"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Chrome className="h-5 w-5 text-blue-600" />
        )}
        <span className="tracking-korean-normal">
          {isGoogleLoading ? '로그인 중...' : '구글 계정으로 계속하기'}
        </span>
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">또는</span>
        </div>
      </div>

      {/* Magic Link Form */}
      <form onSubmit={handleMagicLink} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            이메일 주소
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            disabled={isLoading || isGoogleLoading}
            required
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || isGoogleLoading || !email.trim()}
          className="flex w-full items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          <span className="tracking-korean-normal">
            {isLoading ? '전송 중...' : '이메일로 로그인 링크 받기'}
          </span>
        </Button>
      </form>

      {/* Auth Message */}
      {authMessage && (
        <div
          className={`rounded-lg p-4 text-sm break-keep-ko ${
            authMessage.type === 'error'
              ? 'border border-red-200 bg-red-50 text-red-800'
              : authMessage.type === 'success'
                ? 'border border-green-200 bg-green-50 text-green-800'
                : 'border border-blue-200 bg-blue-50 text-blue-800'
          }`}
        >
          {authMessage.message}
        </div>
      )}

      {/* Additional Info */}
      <div className="text-center">
        <p className="text-xs text-gray-500 break-keep-ko">
          계정이 없으시면 자동으로 새 계정이 생성됩니다.
        </p>
      </div>
    </div>
  );
}
