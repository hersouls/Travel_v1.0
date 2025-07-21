import { format, differenceInDays, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

// 황금비율 상수 및 함수
export const GOLDEN_RATIO = 1.618;

export const goldenRatio = (size: number): number => {
  return size * GOLDEN_RATIO;
};

export const goldenRatioInverse = (size: number): number => {
  return size / GOLDEN_RATIO;
};

// 황금비율 기반 크기 계산
export const goldenSizes = {
  // 카드 크기 (320px : 198px)
  card: {
    width: 320,
    height: Math.round(320 / GOLDEN_RATIO), // 198px
  },
  // 이미지 크기 (360px : 223px)
  image: {
    width: 360,
    height: Math.round(360 / GOLDEN_RATIO), // 223px
  },
  // 버튼 크기 (65px : 40px)
  button: {
    width: Math.round(40 * GOLDEN_RATIO), // 65px
    height: 40,
  },
  // 폰트 크기
  typography: {
    body: 16,
    title: Math.round(16 * GOLDEN_RATIO), // 26px
    h1: Math.round(26 * GOLDEN_RATIO), // 42px
    h2: Math.round(16 * GOLDEN_RATIO), // 26px
  },
  // 여백/패딩
  spacing: {
    small: 8,
    medium: Math.round(8 * GOLDEN_RATIO), // 13px
    large: Math.round(13 * GOLDEN_RATIO), // 21px
    xlarge: Math.round(21 * GOLDEN_RATIO), // 34px
  },
};

// 날짜 포맷팅
export const formatDate = (date: string | Date, formatStr: string = 'yyyy-MM-dd') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: ko });
};

export const formatDateTime = (date: string | Date) => {
  return formatDate(date, 'yyyy-MM-dd HH:mm');
};

export const formatRelativeDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffDays = differenceInDays(now, dateObj);
  
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays === -1) return '내일';
  if (diffDays > 0) return `${diffDays}일 전`;
  if (diffDays < 0) return `${Math.abs(diffDays)}일 후`;
  
  return formatDate(date, 'M월 d일');
};

// 여행 기간 계산
export const calculateTripDuration = (startDate: string, endDate: string) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return differenceInDays(end, start) + 1;
};

// 시간 포맷팅
export const formatTime = (time: string) => {
  if (!time) return '';
  return time.substring(0, 5); // HH:mm 형식으로 변환
};

// 파일 크기 포맷팅
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 이미지 URL 검증
export const isValidImageUrl = (url: string) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

// YouTube URL에서 비디오 ID 추출
export const extractYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// YouTube 임베드 URL 생성
export const getYouTubeEmbedUrl = (url: string) => {
  const videoId = extractYouTubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

// 문자열 길이 제한
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// 색상 유틸리티
export const getRandomColor = () => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// 로컬 스토리지 유틸리티
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// 디바운스 함수
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 클래스명 조합
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// 스크롤 위치 저장/복원
export const scrollPosition = {
  save: (key: string) => {
    if (typeof window === 'undefined') return;
    storage.set(`scroll_${key}`, window.scrollY);
  },
  
  restore: (key: string) => {
    if (typeof window === 'undefined') return;
    const position = storage.get(`scroll_${key}`);
    if (position !== null) {
      window.scrollTo(0, position);
    }
  }
};

// 모바일 디바이스 감지
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// 카메라 접근
export const openCamera = (): Promise<File> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'camera';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        resolve(file);
      } else {
        reject(new Error('No file selected'));
      }
    };
    
    input.click();
  });
};

// 이미지 압축
export const compressImage = (file: File, maxWidth: number = 800): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }
      }, file.type, 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
};