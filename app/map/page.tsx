import { Suspense } from 'react'
      </div>
    }>
      <MapPageClient />
    </Suspense>
  )
}

export async function generateMetadata() {
  return {
    title: '여행 지도 | Moonwave Travel',
    description: '여행 계획을 지도에서 확인하고 관리하세요.',
  }
}