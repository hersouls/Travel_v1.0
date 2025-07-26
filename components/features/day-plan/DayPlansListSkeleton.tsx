export default function DayPlansListSkeleton() {
  return (
    <div className="space-y-4">
      {/* 일정 개요 스켈레톤 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-12 mx-auto mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Day별 계획 스켈레톤 */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* 날짜 박스 스켈레톤 */}
                <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
                
                {/* 일정 정보 스켈레톤 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
                    <div className="h-5 bg-gray-200 rounded-full animate-pulse w-12" />
                  </div>
                  
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-2" />
                  
                  <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="h-5 bg-gray-200 rounded-full animate-pulse w-8" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 버튼 스켈레톤 */}
              <div className="flex items-center gap-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}