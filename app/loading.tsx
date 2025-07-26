export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-moonwave-blue-50 via-white to-moonwave-purple-50">
      <div className="space-y-4 text-center">
        {/* 개선된 로딩 애니메이션 */}
        <div className="relative">
          <div className="border-t-primary-600 mx-auto h-16 w-16 animate-spin rounded-full border-4 border-gray-200"></div>
          <div
            className="border-r-secondary-400 absolute inset-0 mx-auto h-16 w-16 animate-spin rounded-full border-4 border-transparent"
            style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
          ></div>
        </div>

        {/* 로딩 텍스트 */}
        <div className="space-y-2">
          <p className="font-pretendard font-semibold text-gray-900 tracking-korean-normal">
            여행 계획 불러오는 중
          </p>
          <p className="font-pretendard text-sm text-gray-500 tracking-korean-normal break-keep-ko">
            잠시만 기다려주세요...
          </p>
        </div>

        {/* 진행률 표시 (선택적) */}
        <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-gray-200">
          <div className="from-primary-500 to-secondary-500 h-full animate-pulse rounded-full bg-gradient-to-r"></div>
        </div>
      </div>
    </div>
  );
}
