# Supabase 에러 처리 개선 사항

## 개요

이 문서는 Supabase 훅들의 에러 처리 기능을 개선한 내용을 설명합니다. 주요 개선 사항은 한글 에러 메시지 제공, 일관된 에러 처리, 그리고 사용자 친화적인 에러 표시입니다.

## 주요 개선 사항

### 1. 한글 에러 메시지

모든 Supabase 관련 에러가 한글로 표시됩니다:

```typescript
// 기존
error.message === 'Invalid login credentials'
  ? '유효하지 않은 이메일 주소입니다.'
  : '로그인 중 문제가 발생했습니다.';

// 개선 후
getKoreanErrorMessage(error, 'auth');
// 자동으로 적절한 한글 메시지 반환
```

### 2. 통합된 에러 처리 유틸리티

`lib/utils/errorHandling.ts`에 모든 에러 처리 로직을 통합했습니다:

```typescript
import {
  getKoreanErrorMessage,
  logError,
  classifyError,
} from '@/lib/utils/errorHandling';

// 에러 메시지 한글화
const errorMessage = getKoreanErrorMessage(error, 'auth');

// 에러 로깅
logError(error, 'auth', 'signInWithEmail');

// 에러 타입 분류
const errorType = classifyError(error);
```

### 3. 에러 컨텍스트별 처리

다양한 에러 컨텍스트에 맞는 메시지를 제공합니다:

- `auth`: 인증 관련 에러
- `connection`: 연결 관련 에러
- `config`: 설정 관련 에러
- `database`: 데이터베이스 관련 에러
- `fetch`: 데이터 조회 에러
- `create`: 데이터 생성 에러
- `update`: 데이터 수정 에러
- `delete`: 데이터 삭제 에러

## 지원하는 에러 메시지

### 인증 에러

- `Invalid login credentials` → "유효하지 않은 이메일 주소입니다."
- `Email not confirmed` → "이메일 인증이 완료되지 않았습니다."
- `Token expired` → "인증 토큰이 만료되었습니다. 다시 로그인해주세요."
- `Not authenticated` → "로그인이 필요합니다."

### 연결 에러

- `Failed to connect` → "데이터베이스 연결에 실패했습니다."
- `Network error` → "네트워크 연결을 확인해주세요."
- `Connection timeout` → "연결 시간이 초과되었습니다."

### 데이터베이스 에러

- `Row Level Security (RLS) policy violation` → "접근 권한이 없습니다."
- `Duplicate key value violates unique constraint` → "중복된 데이터가 존재합니다."
- `Foreign key violation` → "관련 데이터가 존재하지 않습니다."

### 설정 에러

- `Missing environment variables` → "환경 변수가 설정되지 않았습니다."
- `Invalid configuration` → "잘못된 설정입니다."
- `API key not found` → "API 키를 찾을 수 없습니다."

## 사용법

### 1. useAuth 훅

```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginComponent() {
  const { user, loading, error, signInWithEmail } = useAuth();

  const handleLogin = async (email: string) => {
    const success = await signInWithEmail(email);
    if (!success) {
      // error는 자동으로 한글 메시지로 설정됨
      console.log('로그인 실패:', error);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {/* 나머지 UI */}
    </div>
  );
}
```

### 2. useTravelPlans 훅

```typescript
import { useTravelPlans } from '@/hooks/useTravelPlans';

function TravelPlansComponent() {
  const { travelPlans, loading, error, createTravelPlan } = useTravelPlans();

  const handleCreate = async () => {
    try {
      await createTravelPlan({
        title: '새 여행',
        destination: '서울',
        // ... 기타 필드
      });
    } catch (error) {
      // 에러는 이미 훅에서 처리됨
      console.log('생성 실패:', error);
    }
  };

  return (
    <div>
      {error && <div className="error">{error.message}</div>}
      {/* 나머지 UI */}
    </div>
  );
}
```

### 3. SupabaseProvider

```typescript
import { useSupabase } from '@/components/providers/SupabaseProvider';

function AppComponent() {
  const { isConnected, connectionError, user } = useSupabase();

  if (!isConnected) {
    return (
      <div className="error">
        <p>데이터베이스 연결 실패</p>
        {connectionError && <p>{connectionError}</p>}
      </div>
    );
  }

  return <div>정상 연결됨</div>;
}
```

## 에러 로깅

모든 에러는 자동으로 로그에 기록됩니다:

```typescript
// 콘솔에 다음과 같이 기록됨
[2024-01-01T12:00:00.000Z] [auth] (signInWithEmail) Error: {
  originalError: { message: "Invalid login credentials" },
  koreanMessage: "유효하지 않은 이메일 주소입니다.",
  timestamp: "2024-01-01T12:00:00.000Z"
}
```

## 에러 타입 분류

에러를 자동으로 분류하여 적절한 처리를 할 수 있습니다:

```typescript
import { classifyError } from '@/lib/utils/errorHandling';

const errorType = classifyError(error);
// 'network' | 'auth' | 'database' | 'validation' | 'unknown'

switch (errorType) {
  case 'network':
    // 네트워크 에러 처리
    break;
  case 'auth':
    // 인증 에러 처리
    break;
  case 'database':
    // 데이터베이스 에러 처리
    break;
}
```

## 테스트

에러 처리 기능을 테스트하려면 `ErrorHandlingExample` 컴포넌트를 사용하세요:

```typescript
import { ErrorHandlingExample } from '@/components/examples/ErrorHandlingExample';

// 페이지에서 사용
<ErrorHandlingExample />
```

## 마이그레이션 가이드

기존 코드를 새로운 에러 처리 방식으로 마이그레이션하려면:

1. 기존 에러 처리 로직 제거
2. `getKoreanErrorMessage` 함수 사용
3. `logError` 함수로 에러 로깅 추가
4. 에러 컨텍스트 지정

```typescript
// 기존
if (error) {
  setError(
    error.message === 'Invalid login credentials'
      ? '유효하지 않은 이메일 주소입니다.'
      : '로그인 중 문제가 발생했습니다.'
  );
}

// 개선 후
if (error) {
  logError(error, 'auth', 'signInWithEmail');
  setError(getKoreanErrorMessage(error, 'auth'));
}
```

## 추가 개선 사항

향후 추가할 수 있는 개선 사항:

1. 에러 재시도 메커니즘
2. 에러 통계 수집
3. 사용자별 에러 히스토리
4. 에러 알림 시스템
5. 다국어 지원 확장

## 결론

이번 개선을 통해 사용자 경험이 크게 향상되었습니다:

- ✅ 모든 에러 메시지가 한글로 표시
- ✅ 일관된 에러 처리 방식
- ✅ 자동 에러 로깅
- ✅ 에러 타입별 적절한 처리
- ✅ 사용자 친화적인 메시지
- ✅ 개발자 친화적인 디버깅 정보
