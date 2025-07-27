/**
 * Supabase 에러 메시지 한글화 유틸리티
 * 모든 Supabase 관련 훅에서 일관된 에러 메시지를 제공합니다.
 */

export type ErrorContext =
  | 'auth'
  | 'connection'
  | 'config'
  | 'database'
  | 'fetch'
  | 'create'
  | 'update'
  | 'delete';

// Supabase Auth 에러 메시지 매핑
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': '유효하지 않은 이메일 주소입니다.',
  'Email not confirmed': '이메일 인증이 완료되지 않았습니다.',
  'User not found': '등록되지 않은 사용자입니다.',
  'Too many requests':
    '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
  'Email rate limit exceeded':
    '이메일 전송 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
  'Invalid email': '올바르지 않은 이메일 형식입니다.',
  'Password should be at least 6 characters':
    '비밀번호는 최소 6자 이상이어야 합니다.',
  'Unable to validate email address': '이메일 주소를 확인할 수 없습니다.',
  'Signup disabled': '회원가입이 일시적으로 비활성화되었습니다.',
  'User already registered': '이미 등록된 사용자입니다.',
  'Token expired': '인증 토큰이 만료되었습니다. 다시 로그인해주세요.',
  'Invalid token': '유효하지 않은 인증 토큰입니다.',
  'JWT expired': '인증이 만료되었습니다. 다시 로그인해주세요.',
  'Invalid JWT': '유효하지 않은 인증 정보입니다.',
  'Not authenticated': '로그인이 필요합니다.',
  Unauthorized: '접근 권한이 없습니다.',
};

// Supabase 연결 및 설정 에러 메시지 매핑
const CONNECTION_ERROR_MESSAGES: Record<string, string> = {
  'Failed to connect': '데이터베이스 연결에 실패했습니다.',
  'Connection timeout': '연결 시간이 초과되었습니다.',
  'Network error': '네트워크 연결을 확인해주세요.',
  'Invalid URL': '잘못된 서버 URL입니다.',
  Forbidden: '접근이 금지되었습니다.',
  'Not found': '요청한 리소스를 찾을 수 없습니다.',
  'Internal server error': '서버 내부 오류가 발생했습니다.',
  'Service unavailable': '서비스가 일시적으로 사용할 수 없습니다.',
  'Missing environment variables': '환경 변수가 설정되지 않았습니다.',
  'Invalid configuration': '잘못된 설정입니다.',
  'API key not found': 'API 키를 찾을 수 없습니다.',
  'Invalid API key': '유효하지 않은 API 키입니다.',
  'Request timeout': '요청 시간이 초과되었습니다.',
  'Connection failed': '데이터베이스 연결에 실패했습니다.',
};

// Supabase 데이터베이스 에러 메시지 매핑
const DATABASE_ERROR_MESSAGES: Record<string, string> = {
  'Row Level Security (RLS) policy violation': '접근 권한이 없습니다.',
  'Policy violation': '정책 위반으로 접근이 거부되었습니다.',
  'Duplicate key value violates unique constraint':
    '중복된 데이터가 존재합니다.',
  'Foreign key violation': '관련 데이터가 존재하지 않습니다.',
  'Check constraint violation': '데이터 형식이 올바르지 않습니다.',
  'Not null violation': '필수 입력 항목이 누락되었습니다.',
  'Table does not exist': '테이블을 찾을 수 없습니다.',
  'Column does not exist': '컬럼을 찾을 수 없습니다.',
  'Invalid input syntax': '잘못된 입력 형식입니다.',
  'Value too long': '입력 값이 너무 깁니다.',
  'Database error': '데이터베이스 오류가 발생했습니다.',
};

// 일반적인 에러 메시지 매핑
const GENERAL_ERROR_MESSAGES: Record<string, string> = {
  'Request failed': '요청 처리 중 오류가 발생했습니다.',
  Timeout: '요청 시간이 초과되었습니다.',
  'Unknown error': '알 수 없는 오류가 발생했습니다.',
};

/**
 * 에러 메시지를 한글로 변환하는 함수
 * @param error - 에러 객체 또는 메시지
 * @param context - 에러 컨텍스트 (기본값: 'database')
 * @returns 한글 에러 메시지
 */
export const getKoreanErrorMessage = (
  error: unknown,
  context: ErrorContext = 'database'
): string => {
  const message = error?.message || error?.toString() || '';

  // 모든 에러 메시지 매핑을 하나로 합치기
  const allErrorMessages = {
    ...AUTH_ERROR_MESSAGES,
    ...CONNECTION_ERROR_MESSAGES,
    ...DATABASE_ERROR_MESSAGES,
    ...GENERAL_ERROR_MESSAGES,
  };

  // 정확한 매칭 시도
  if (allErrorMessages[message]) {
    return allErrorMessages[message];
  }

  // 부분 매칭 시도
  for (const [key, value] of Object.entries(allErrorMessages)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // 컨텍스트별 기본 메시지
  switch (context) {
    case 'auth':
      if (message.includes('network') || message.includes('fetch')) {
        return '네트워크 연결을 확인해주세요.';
      }
      return '인증 중 문제가 발생했습니다.';

    case 'connection':
      if (message.includes('network') || message.includes('fetch')) {
        return '네트워크 연결을 확인해주세요.';
      }
      return '데이터베이스 연결 중 문제가 발생했습니다.';

    case 'config':
      return '설정을 확인해주세요.';

    case 'fetch':
      return '데이터를 불러오는 중 문제가 발생했습니다.';

    case 'create':
      return '데이터 생성 중 문제가 발생했습니다.';

    case 'update':
      return '데이터 수정 중 문제가 발생했습니다.';

    case 'delete':
      return '데이터 삭제 중 문제가 발생했습니다.';

    case 'database':
    default:
      if (message.includes('network') || message.includes('fetch')) {
        return '네트워크 연결을 확인해주세요.';
      }
      if (message.includes('timeout')) {
        return '요청 시간이 초과되었습니다. 다시 시도해주세요.';
      }
      return '데이터베이스 작업 중 문제가 발생했습니다.';
  }
};

/**
 * 에러 로깅 함수
 * @param error - 에러 객체
 * @param context - 에러 컨텍스트
 * @param operation - 수행 중이던 작업
 */
export const logError = (
  error: unknown,
  context: string,
  operation?: string
): void => {
  const errorMessage = getKoreanErrorMessage(error, context as ErrorContext);
  console.error(`[${context}] ${operation ? `(${operation}) ` : ''}Error:`, {
    originalError: error,
    koreanMessage: errorMessage,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 에러 타입 분류 함수
 * @param error - 에러 객체
 * @returns 에러 타입
 */
export const classifyError = (
  error: unknown
): 'network' | 'auth' | 'database' | 'validation' | 'unknown' => {
  const message = error?.message || error?.toString() || '';

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('timeout')
  ) {
    return 'network';
  }

  if (
    message.includes('auth') ||
    message.includes('token') ||
    message.includes('jwt') ||
    message.includes('login')
  ) {
    return 'auth';
  }

  if (
    message.includes('constraint') ||
    message.includes('violation') ||
    message.includes('table') ||
    message.includes('column')
  ) {
    return 'database';
  }

  if (
    message.includes('invalid') ||
    message.includes('validation') ||
    message.includes('format')
  ) {
    return 'validation';
  }

  return 'unknown';
};
