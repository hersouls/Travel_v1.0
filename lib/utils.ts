import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 클래스명을 병합하는 유틸리티 함수
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 한국 원화 포매팅
 */
export function formatKoreanWon(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

/**
 * 한국 날짜 포매팅
 */
export function formatKoreanDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(dateObj);
}

/**
 * 한국 시간 포매팅
 */
export function formatKoreanTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
}

/**
 * 상대적 시간 표시 (한국어)
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;

  if (diff < minute) {
    return '방금 전';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}분 전`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}시간 전`;
  } else if (diff < week) {
    return `${Math.floor(diff / day)}일 전`;
  } else if (diff < month) {
    return `${Math.floor(diff / week)}주 전`;
  } else {
    return formatKoreanDate(dateObj);
  }
}

/**
 * URL slug 생성 (한글 지원)
 */
export function createSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 여행 기간 계산
 */
export function calculateTravelDuration(
  startDate: Date | string,
  endDate: Date | string
): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const diff = end.getTime() - start.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day

  if (days === 1) {
    return '당일치기';
  } else {
    return `${days - 1}박 ${days}일`;
  }
}

/**
 * 에러 메시지 포매팅
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return '알 수 없는 오류가 발생했습니다.';
}

/**
 * 디바운스 함수
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 로컬 스토리지 안전하게 사용하기
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // 무시
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // 무시
    }
  },
};
