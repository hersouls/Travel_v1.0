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
    await new Promise(resolve => setTimeout(resolve, 500));
    reset();
    setIsRetrying(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <AlertTriangleIcon className="w-10 h-10 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-pretendard tracking-korean-tight">
          문제가 발생했습니다
        </h2>
        
        <p className="text-gray-600 mb-8 break-keep-ko tracking-korean-normal">
          일시적인 오류가 발생했습니다. <br />
          다시 시도해보거나 홈으로 돌아가세요.
        </p>
        
        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-2 min-w-[120px]"
          >
            <RefreshCwIcon className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? '재시도 중...' : '다시 시도'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 min-w-[120px]"
          >
            <HomeIcon className="w-4 h-4" />
            홈으로 가기
          </Button>
        </div>
        
        {/* 에러 세부정보 */}
        <details className="mt-8 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
            에러 세부정보
          </summary>
          <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 space-y-1">
            <p><strong>메시지:</strong> {error.message}</p>
            {error.digest && (
              <p><strong>Error ID:</strong> <code className="font-mono">{error.digest}</code></p>
            )}
            <p><strong>시간:</strong> {new Date().toLocaleString('ko-KR')}</p>
          </div>
        </details>
      </div>
    </div>
  );
}