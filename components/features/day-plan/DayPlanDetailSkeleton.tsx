export default function DayPlanDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* 헤더 스켈레톤 */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-32" />
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* 요약 카드 스켈레톤 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-12 mx-auto mb-1" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* 계획 목록 스켈레톤 */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {/* 순서 번호 스켈레톤 */}
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                
                {/* 계획 내용 스켈레톤 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-40" />
                    <div className="h-5 bg-gray-200 rounded-full animate-pulse w-16" />
                  </div>
                  
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mb-2" />
                  
                  <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  </div>
                  
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full mt-3" />
                </div>
              </div>
              
              {/* 액션 버튼 스켈레톤 */}
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}