# Mock 데이터 사용 가이드

## 📋 개요

Moonwave Travel 프로젝트는 현재 Supabase 기능을 블록처리하고 Mock 데이터를 사용하여 프론트엔드 개발을 진행할 수 있도록 설정되어 있습니다.

## 🗂 파일 구조

```
src/
├── lib/
│   ├── supabase.ts          # Supabase 설정 (주석 처리됨)
│   ├── mockData.ts          # Mock 데이터 및 서비스
│   └── dataService.ts       # 통합 데이터 서비스
└── components/
    ├── TripCard.tsx         # 여행 카드 컴포넌트
    └── PlanCard.tsx         # 계획 카드 컴포넌트
```

## 🔧 Mock 데이터 구성

### 1. 사용자 데이터
```typescript
export const mockUser: User = {
  id: 'mock-user-id-123',
  email: 'user@example.com',
  name: '테스트 사용자',
  avatar_url: 'https://images.unsplash.com/...',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};
```

### 2. 여행 데이터
- **도쿄 여행** (3박 4일)
- **파리 로맨틱 여행** (7박 8일)
- **뉴욕 도시 탐험** (7박 8일)

### 3. 여행 계획 데이터
각 여행별로 상세한 계획이 포함되어 있습니다:
- 관광지 (attraction)
- 식당 (restaurant)
- 숙박 (accommodation)
- 교통 (transport)
- 기타 (other)

## 🚀 사용 방법

### 1. 데이터 서비스 사용
```typescript
import { dataService } from '@/lib/dataService';

// 여행 목록 조회
const response = await dataService.getTrips();
if (response.success) {
  console.log(response.data); // 여행 목록
}

// 특정 여행 조회
const tripResponse = await dataService.getTripById('trip-1');
if (tripResponse.success) {
  console.log(tripResponse.data); // 여행 상세 정보 + 계획들
}
```

### 2. 인증 서비스 사용
```typescript
import { authService } from '@/lib/dataService';

// 로그인 (Mock 인증)
const loginResponse = await authService.signIn('user@example.com', 'password');
if (loginResponse.success) {
  console.log(loginResponse.data); // 사용자 정보
}
```

### 3. 컴포넌트에서 사용
```typescript
import { useEffect, useState } from 'react';
import { dataService } from '@/lib/dataService';
import { Trip } from '@/types';

export default function MyComponent() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const response = await dataService.getTrips();
        if (response.success && response.data) {
          setTrips(response.data);
        }
      } catch (error) {
        console.error('Failed to load trips:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  // 컴포넌트 렌더링...
}
```

## 🔄 Supabase 전환 방법

### 1. 환경 변수 설정
```bash
# .env.local 파일 생성
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase 설정 활성화
`src/lib/supabase.ts` 파일에서 주석을 해제:
```typescript
// 주석 해제
import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
```

### 3. Mock 모드 비활성화
`src/lib/supabase.ts`에서:
```typescript
export const isMockMode = () => {
  return false; // Mock 모드 비활성화
};
```

### 4. 데이터 서비스 업데이트
`src/lib/dataService.ts`에서 TODO 주석 부분을 실제 Supabase 코드로 교체:
```typescript
// 예시: 여행 목록 조회
getTrips: async (): Promise<ApiResponse<Trip[]>> => {
  if (isMockMode()) {
    return mockDataService.getTrips();
  }
  
  // 실제 Supabase 코드
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
},
```

## 📊 Mock 데이터 수정

### 1. 여행 데이터 추가/수정
`src/lib/mockData.ts`의 `mockTrips` 배열을 수정:
```typescript
export const mockTrips: Trip[] = [
  {
    id: 'trip-new',
    user_id: 'mock-user-id-123',
    title: '새로운 여행',
    country: '한국',
    start_date: '2024-06-01',
    end_date: '2024-06-05',
    cover_image: 'https://images.unsplash.com/...',
    created_at: '2024-05-01T00:00:00Z',
    updated_at: '2024-05-01T00:00:00Z',
  },
  // 기존 데이터...
];
```

### 2. 계획 데이터 추가/수정
`src/lib/mockData.ts`의 `mockPlans` 배열을 수정:
```typescript
export const mockPlans: Plan[] = [
  {
    id: 'plan-new',
    trip_id: 'trip-new',
    day: 1,
    place_name: '새로운 장소',
    start_time: '10:00',
    end_time: '12:00',
    type: 'attraction',
    photos: ['https://images.unsplash.com/...'],
    memo: '새로운 장소에 대한 메모',
    latitude: 37.5665,
    longitude: 126.9780,
    address: '서울특별시 강남구',
    rating: 4.5,
    created_at: '2024-05-01T00:00:00Z',
    updated_at: '2024-05-01T00:00:00Z',
  },
  // 기존 데이터...
];
```

## 🎯 개발 팁

### 1. 로딩 상태 처리
Mock 데이터를 사용할 때도 실제 API 호출과 동일하게 로딩 상태를 처리하는 것이 좋습니다.

### 2. 에러 처리
Mock 데이터에서는 에러가 발생하지 않지만, 실제 API 연동을 고려하여 에러 처리를 포함하는 것이 좋습니다.

### 3. 타입 안정성
TypeScript 타입을 활용하여 Mock 데이터의 타입 안정성을 보장합니다.

### 4. 테스트 데이터
개발 중 다양한 시나리오를 테스트할 수 있도록 충분한 Mock 데이터를 준비합니다.

## 🔍 디버깅

### 1. Mock 모드 확인
```typescript
import { isMockMode } from '@/lib/supabase';
console.log('Mock mode:', isMockMode()); // true
```

### 2. 데이터 확인
브라우저 개발자 도구에서:
```javascript
// 콘솔에서 직접 데이터 확인
import { mockTrips, mockPlans } from '@/lib/mockData';
console.log('Mock trips:', mockTrips);
console.log('Mock plans:', mockPlans);
```

## 📝 주의사항

1. **데이터 지속성**: Mock 데이터는 페이지 새로고침 시 초기화됩니다.
2. **실제 API와의 차이**: Mock 데이터는 실제 API 응답과 약간 다를 수 있습니다.
3. **성능**: Mock 데이터는 메모리에서 처리되므로 실제 API보다 빠를 수 있습니다.
4. **보안**: Mock 데이터에는 실제 보안 검증이 없습니다.

---

이 가이드를 통해 Mock 데이터를 활용하여 효율적으로 프론트엔드 개발을 진행할 수 있습니다! 🚀