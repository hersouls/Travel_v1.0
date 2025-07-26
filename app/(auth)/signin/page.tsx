import { Metadata } from 'next';
import { Suspense } from 'react';
import { SignInForm } from '@/components/features/auth/SignInForm';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: '로그인 | Moonwave Travel',
  description:
    '여행 계획을 시작하려면 로그인하세요. 구글 계정으로 간편하게 시작할 수 있습니다.',
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 tracking-korean-normal">
            Moonwave Travel
          </h1>
          <p className="text-gray-600 break-keep-ko">
            당신의 특별한 여행을 계획해보세요
          </p>
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold text-gray-900 tracking-korean-normal">
              로그인
            </h2>
            <p className="text-sm text-gray-600 break-keep-ko">
              기존 계정으로 로그인하거나 새 계정을 만드세요
            </p>
          </div>

          <Suspense
            fallback={
              <div className="animate-pulse space-y-4">
                <div className="h-12 rounded-lg bg-gray-200"></div>
                <div className="h-px bg-gray-200"></div>
                <div className="h-12 rounded-lg bg-gray-200"></div>
              </div>
            }
          >
            <SignInForm />
          </Suspense>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="break-keep-ko">
            계속 진행하면{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              이용약관
            </a>
            과{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              개인정보처리방침
            </a>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
