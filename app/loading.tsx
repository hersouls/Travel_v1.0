export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-pretendard tracking-korean-normal">
          로딩 중...
        </p>
      </div>
    </div>
  );
}