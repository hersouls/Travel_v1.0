export default function DayPlanDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* 헤더 스켈레톤 */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
          </div>
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* 요약 카드 스켈레톤 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-1 h-8 w-12 animate-pulse rounded bg-gray-200" />
              <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* 계획 목록 스켈레톤 */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-1 items-start gap-4">
                {/* 순서 번호 스켈레톤 */}
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />

                {/* 계획 내용 스켈레톤 */}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
                    <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
                  </div>

                  <div className="mb-2 h-4 w-64 animate-pulse rounded bg-gray-200" />

                  <div className="flex items-center gap-4">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  </div>

                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-200" />
                </div>
              </div>

              {/* 액션 버튼 스켈레톤 */}
              <div className="flex gap-2">
                <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
                <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
