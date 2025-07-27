'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTravelPlans } from '@/hooks/useTravelPlans';
import { useSupabase } from '@/components/providers/SupabaseProvider';

/**
 * 에러 처리 개선 예제 컴포넌트
 * 
 * 이 컴포넌트는 개선된 에러 처리 기능을 보여줍니다:
 * - 한글 에러 메시지
 * - 에러 로깅
 * - 에러 타입 분류
 * - 사용자 친화적인 에러 표시
 */
export function ErrorHandlingExample() {
  const { user, loading: authLoading, error: authError, signInWithEmail } = useAuth();
  const { travelPlans, loading: plansLoading, error: plansError, createTravelPlan } = useTravelPlans();
  const { isConnected, connectionError } = useSupabase();
  
  const [email, setEmail] = useState('');
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const handleSignIn = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    
    await signInWithEmail(email);
  };

  const handleCreatePlan = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await createTravelPlan({
        title: '새 여행 계획',
        destination: '서울',
        start_date: '2024-01-01',
        end_date: '2024-01-03',
        status: 'planning',
        is_public: false,
        collaborators: [],
      });
    } catch (error) {
      // 에러는 이미 훅에서 처리됨
      console.log('여행 계획 생성 실패:', error);
    }
  };

  // 에러 메시지 렌더링 함수
  const renderError = (error: string | Error | null, context: string) => {
    if (!error) return null;

    const errorMessage = typeof error === 'string' ? error : error.message;
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {context} 오류
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{errorMessage}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="text-sm text-red-600 hover:text-red-500"
                onClick={() => setShowErrorDetails(!showErrorDetails)}
              >
                {showErrorDetails ? '상세 정보 숨기기' : '상세 정보 보기'}
              </button>
            </div>
            {showErrorDetails && (
              <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
                <pre>{JSON.stringify(error, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">에러 처리 개선 예제</h2>
        
        {/* 연결 상태 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">연결 상태</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              {isConnected ? '데이터베이스 연결됨' : '데이터베이스 연결 안됨'}
            </span>
          </div>
          {connectionError && renderError(connectionError, '연결')}
        </div>

        {/* 인증 상태 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">인증 상태</h3>
          {authLoading ? (
            <p className="text-gray-600">인증 상태 확인 중...</p>
          ) : user ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                로그인됨: {user.email}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="이메일 주소"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  로그인
                </button>
              </div>
              {authError && renderError(authError, '인증')}
            </div>
          )}
        </div>

        {/* 여행 계획 */}
        {user && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">여행 계획</h3>
            <div className="space-y-4">
              <button
                onClick={handleCreatePlan}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                새 여행 계획 생성
              </button>
              
              {plansLoading ? (
                <p className="text-gray-600">여행 계획 로딩 중...</p>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    총 {travelPlans.length}개의 여행 계획
                  </p>
                  {travelPlans.length > 0 && (
                    <div className="space-y-2">
                      {travelPlans.slice(0, 3).map((plan) => (
                        <div key={plan.id} className="bg-gray-50 p-3 rounded">
                          <h4 className="font-medium">{plan.title}</h4>
                          <p className="text-sm text-gray-600">{plan.destination}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {plansError && renderError(plansError, '여행 계획')}
            </div>
          </div>
        )}

        {/* 에러 처리 개선 사항 설명 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            에러 처리 개선 사항
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 모든 Supabase 에러 메시지가 한글로 표시됩니다</li>
            <li>• 에러가 발생하면 자동으로 로그에 기록됩니다</li>
            <li>• 에러 타입별로 적절한 메시지가 표시됩니다</li>
            <li>• 네트워크, 인증, 데이터베이스 에러를 구분하여 처리합니다</li>
            <li>• 사용자 친화적인 에러 메시지를 제공합니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}