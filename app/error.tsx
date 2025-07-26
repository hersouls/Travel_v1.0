'use client';

import { useEffect } from 'react';
import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangleIcon className="w-8 h-8 text-error-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-pretendard tracking-korean-tight">
          문제가 발생했습니다
        </h2>
        
        <p className="text-gray-600 mb-6 break-keep-ko tracking-korean-normal">
          일시적인 오류가 발생했습니다. <br />
          잠시 후 다시 시도해주세요.
        </p>
        
        <button
          onClick={reset}
          className="btn btn-primary px-6 py-3 gap-2"
        >
          <RefreshCwIcon className="w-4 h-4" />
          다시 시도
        </button>
        
        {error.digest && (
          <p className="text-xs text-gray-400 mt-4 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}