export default function TravelDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* 헤더 스켈레톤 */}
      <div className="mb-8 flex items-center gap-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
          </div>
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-20 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* 커버 이미지 스켈레톤 */}
      <div className="aspect-[16/6] animate-pulse rounded-lg bg-gray-200" />

      {/* 여행 정보 카드 스켈레톤 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="mb-2 h-5 w-24 animate-pulse rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* 일정별 계획 스켈레톤 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
