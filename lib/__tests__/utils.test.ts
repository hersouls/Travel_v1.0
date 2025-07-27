import {
  cn,
  formatKoreanWon,
  formatKoreanDate,
  formatKoreanTime,
  formatRelativeTime,
  createSlug,
  calculateTravelDuration,
  formatErrorMessage,
  debounce,
  safeLocalStorage,
} from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('클래스명을 올바르게 병합해야 함', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('px-2 py-1', 'px-3')).toBe('py-1 px-3');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('조건부 클래스명을 올바르게 처리해야 함', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional');
      expect(cn('base', false && 'conditional')).toBe('base');
    });
  });

  describe('formatKoreanWon', () => {
    it('한국 원화 형식으로 올바르게 포매팅해야 함', () => {
      expect(formatKoreanWon(1000)).toBe('₩1,000');
      expect(formatKoreanWon(50000)).toBe('₩50,000');
      expect(formatKoreanWon(1234567)).toBe('₩1,234,567');
      expect(formatKoreanWon(0)).toBe('₩0');
    });

    it('소수점이 있는 금액을 올바르게 처리해야 함', () => {
      expect(formatKoreanWon(1000.5)).toBe('₩1,001');
    });
  });

  describe('formatKoreanDate', () => {
    it('한국어 날짜 형식으로 올바르게 포매팅해야 함', () => {
      const date = new Date('2025-08-15');
      const result = formatKoreanDate(date);
      
      expect(result).toContain('2025년');
      expect(result).toContain('8월');
      expect(result).toContain('15일');
    });

    it('문자열 날짜를 올바르게 처리해야 함', () => {
      const result = formatKoreanDate('2025-08-15');
      
      expect(result).toContain('2025년');
      expect(result).toContain('8월');
      expect(result).toContain('15일');
    });
  });

  describe('formatKoreanTime', () => {
    it('한국어 시간 형식으로 올바르게 포매팅해야 함', () => {
      const date = new Date('2025-08-15T14:30:00');
      const result = formatKoreanTime(date);
      
      expect(result).toMatch(/오후 02:30/);
    });

    it('문자열 시간을 올바르게 처리해야 함', () => {
      const result = formatKoreanTime('2025-08-15T09:15:00');
      
      expect(result).toMatch(/오전 09:15/);
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('방금 전을 올바르게 표시해야 함', () => {
      const date = new Date('2025-01-01T11:59:30Z');
      expect(formatRelativeTime(date)).toBe('방금 전');
    });

    it('분 단위를 올바르게 표시해야 함', () => {
      const date = new Date('2025-01-01T11:58:00Z');
      expect(formatRelativeTime(date)).toBe('2분 전');
    });

    it('시간 단위를 올바르게 표시해야 함', () => {
      const date = new Date('2025-01-01T10:00:00Z');
      expect(formatRelativeTime(date)).toBe('2시간 전');
    });

    it('일 단위를 올바르게 표시해야 함', () => {
      const date = new Date('2024-12-30T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('2일 전');
    });

    it('주 단위를 올바르게 표시해야 함', () => {
      const date = new Date('2024-12-25T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('1주 전');
    });

    it('한 달 이상은 날짜 형식으로 표시해야 함', () => {
      const date = new Date('2024-11-01T12:00:00Z');
      const result = formatRelativeTime(date);
      expect(result).toContain('2024년');
    });
  });

  describe('createSlug', () => {
    it('한글 텍스트를 올바르게 변환해야 함', () => {
      expect(createSlug('제주도 여행')).toBe('제주도-여행');
      expect(createSlug('부산 해운대')).toBe('부산-해운대');
    });

    it('영문 텍스트를 올바르게 변환해야 함', () => {
      expect(createSlug('Jeju Island Trip')).toBe('jeju-island-trip');
      expect(createSlug('Busan Haeundae')).toBe('busan-haeundae');
    });

    it('특수문자를 올바르게 제거해야 함', () => {
      expect(createSlug('제주도!@#$%^&*()')).toBe('제주도');
      expect(createSlug('Busan & Seoul')).toBe('busan-seoul');
    });

    it('공백과 하이픈을 올바르게 처리해야 함', () => {
      expect(createSlug('  제주도  여행  ')).toBe('제주도-여행');
      expect(createSlug('Busan--Seoul')).toBe('busanseoul');
    });

    it('앞뒤 하이픈을 제거해야 함', () => {
      expect(createSlug('-제주도-')).toBe('제주도');
      expect(createSlug('--Busan--')).toBe('busan');
    });
  });

  describe('calculateTravelDuration', () => {
    it('당일치기를 올바르게 계산해야 함', () => {
      expect(calculateTravelDuration('2025-08-15', '2025-08-15')).toBe('당일치기');
    });

    it('1박 2일을 올바르게 계산해야 함', () => {
      expect(calculateTravelDuration('2025-08-15', '2025-08-16')).toBe('1박 2일');
    });

    it('여러 일을 올바르게 계산해야 함', () => {
      expect(calculateTravelDuration('2025-08-15', '2025-08-20')).toBe('5박 6일');
    });

    it('Date 객체를 올바르게 처리해야 함', () => {
      const start = new Date('2025-08-15');
      const end = new Date('2025-08-17');
      expect(calculateTravelDuration(start, end)).toBe('2박 3일');
    });
  });

  describe('formatErrorMessage', () => {
    it('Error 객체를 올바르게 처리해야 함', () => {
      const error = new Error('테스트 에러');
      expect(formatErrorMessage(error)).toBe('테스트 에러');
    });

    it('문자열 에러를 올바르게 처리해야 함', () => {
      expect(formatErrorMessage('문자열 에러')).toBe('문자열 에러');
    });

    it('알 수 없는 에러 타입을 올바르게 처리해야 함', () => {
      expect(formatErrorMessage(123)).toBe('알 수 없는 오류가 발생했습니다.');
      expect(formatErrorMessage(null)).toBe('알 수 없는 오류가 발생했습니다.');
      expect(formatErrorMessage(undefined)).toBe('알 수 없는 오류가 발생했습니다.');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('함수를 디바운스해야 함', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      // 여러 번 호출
      debouncedFn('test1');
      debouncedFn('test2');
      debouncedFn('test3');

      // 아직 실행되지 않아야 함
      expect(mockFn).not.toHaveBeenCalled();

      // 시간 경과
      jest.advanceTimersByTime(1000);

      // 마지막 호출만 실행되어야 함
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test3');
    });

    it('타이머를 리셋해야 함', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn('test1');
      jest.advanceTimersByTime(500); // 아직 실행되지 않음

      debouncedFn('test2'); // 타이머 리셋
      jest.advanceTimersByTime(500); // 아직 실행되지 않음

      jest.advanceTimersByTime(500); // 이제 실행됨

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test2');
    });
  });

  describe('safeLocalStorage', () => {
    const originalLocalStorage = global.localStorage;

    beforeEach(() => {
      // localStorage 모킹
      const mockLocalStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
      });
    });

    it('getItem이 올바르게 작동해야 함', () => {
      const mockValue = 'test-value';
      (localStorage.getItem as jest.Mock).mockReturnValue(mockValue);

      expect(safeLocalStorage.getItem('test-key')).toBe(mockValue);
      expect(localStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    it('setItem이 올바르게 작동해야 함', () => {
      safeLocalStorage.setItem('test-key', 'test-value');

      expect(localStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
    });

    it('removeItem이 올바르게 작동해야 함', () => {
      safeLocalStorage.removeItem('test-key');

      expect(localStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('localStorage 에러를 안전하게 처리해야 함', () => {
      (localStorage.getItem as jest.Mock).mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(safeLocalStorage.getItem('test-key')).toBeNull();
    });

    it('SSR 환경에서 안전하게 작동해야 함', () => {
      // window 객체 제거
      const originalWindow = global.window;
      delete (global as any).window;

      expect(safeLocalStorage.getItem('test-key')).toBeUndefined();
      expect(() => safeLocalStorage.setItem('test-key', 'value')).not.toThrow();
      expect(() => safeLocalStorage.removeItem('test-key')).not.toThrow();

      // window 객체 복원
      global.window = originalWindow;
    });
  });
});