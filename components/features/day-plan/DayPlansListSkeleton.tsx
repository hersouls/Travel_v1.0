export default function DayPlansListSkeleton() {
  return (
    <div className="space-y-4">
      {/* 일정 개요 스켈레톤 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-2 h-8 w-12 animate-pulse rounded bg-gray-200" />
              <div className="mx-auto h-4 w-16 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Day별 계획 스켈레톤 */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* 날짜 박스 스켈레톤 */}
                <div className="h-16 w-16 animate-pulse rounded-lg bg-gray-200" />

                {/* 일정 정보 스켈레톤 */}
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
                  </div>

                  <div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-200" />

                  <div className="flex items-center gap-4">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div
                          key={j}
                          className="h-5 w-8 animate-pulse rounded-full bg-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 버튼 스켈레톤 */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
