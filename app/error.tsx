'use client';

import { useEffect, useState } from 'react';
import { AlertTriangleIcon, RefreshCwIcon, HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // 향상된 에러 로깅
    console.error('Application Error:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  const handleRetry = async () => {
    setIsRetrying(true);
    // 약간의 지연 후 재시도 (UX 개선)
    await new Promise((resolve) => setTimeout(resolve, 500));
    reset();
    setIsRetrying(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 shadow-lg">
          <AlertTriangleIcon className="h-10 w-10 text-red-500" />
        </div>

        <h2 className="mb-2 font-pretendard text-2xl font-bold text-gray-900 tracking-korean-tight">
          문제가 발생했습니다
        </h2>

        <p className="mb-8 text-gray-600 tracking-korean-normal break-keep-ko">
          일시적인 오류가 발생했습니다. <br />
          다시 시도해보거나 홈으로 돌아가세요.
        </p>

        {/* 액션 버튼들 */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex min-w-[120px] items-center gap-2"
          >
            <RefreshCwIcon
              className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`}
            />
            {isRetrying ? '재시도 중...' : '다시 시도'}
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
            className="flex min-w-[120px] items-center gap-2"
          >
            <HomeIcon className="h-4 w-4" />
            홈으로 가기
          </Button>
        </div>

        {/* 에러 세부정보 */}
        <details className="mt-8 text-left">
          <summary className="mb-2 cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            에러 세부정보
          </summary>
          <div className="space-y-1 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
            <p>
              <strong>메시지:</strong> {error.message}
            </p>
            {error.digest && (
              <p>
                <strong>Error ID:</strong>{' '}
                <code className="font-mono">{error.digest}</code>
              </p>
            )}
            <p>
              <strong>시간:</strong> {new Date().toLocaleString('ko-KR')}
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
