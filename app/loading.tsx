export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
      <div className="text-center space-y-4">
        {/* 개선된 로딩 애니메이션 */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-secondary-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        
        {/* 로딩 텍스트 */}
        <div className="space-y-2">
          <p className="text-gray-900 font-semibold font-pretendard tracking-korean-normal">
            여행 계획 불러오는 중
          </p>
          <p className="text-gray-500 text-sm font-pretendard tracking-korean-normal break-keep-ko">
            잠시만 기다려주세요...
          </p>
        </div>
        
        {/* 진행률 표시 (선택적) */}
        <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}