import { GRADIENT_CLASSES } from '@/components/ui/backgrounds';

// 페이지별 배경 변형 매핑
export const getPageBackground = (currentPath: string): keyof typeof GRADIENT_CLASSES => {
  // 기본 경로별 배경 설정
  const pathBackgrounds: Record<string, keyof typeof GRADIENT_CLASSES> = {
    '/': 'moonwave',
    '/travels': 'ocean',
    '/map': 'forest',
    '/profile': 'purple',
    '/notifications': 'sunset',
    '/add': 'forest',
    '/auth': 'moonwave',
    '/signin': 'moonwave',
    '/signup': 'moonwave',
  };

  // 정확한 경로 매칭
  if (pathBackgrounds[currentPath]) {
    return pathBackgrounds[currentPath];
  }

  // 부분 경로 매칭
  for (const [path, background] of Object.entries(pathBackgrounds)) {
    if (currentPath.startsWith(path) && path !== '/') {
      return background;
    }
  }

  // 기본값
  return 'moonwave';
};

// 시간대별 배경 변형 (선택적)
export const getTimeBasedBackground = (): keyof typeof GRADIENT_CLASSES => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return 'sunset'; // 아침
  } else if (hour >= 12 && hour < 18) {
    return 'ocean'; // 오후
  } else if (hour >= 18 && hour < 22) {
    return 'purple'; // 저녁
  } else {
    return 'moonwave'; // 밤
  }
};

// 사용자 설정에 따른 배경 (선택적)
export const getUserPreferredBackground = (
  userPreference?: string
): keyof typeof GRADIENT_CLASSES => {
  if (userPreference && userPreference in GRADIENT_CLASSES) {
    return userPreference as keyof typeof GRADIENT_CLASSES;
  }
  return 'moonwave';
};

// 배경 클래스 조합 헬퍼
export const combineBackgroundClasses = (
  baseClass: keyof typeof GRADIENT_CLASSES,
  additionalClasses: string = ''
): string => {
  return `${GRADIENT_CLASSES[baseClass]} ${additionalClasses}`.trim();
};

// 반응형 배경 클래스
export const getResponsiveBackground = (
  baseClass: keyof typeof GRADIENT_CLASSES,
  mobileClass?: keyof typeof GRADIENT_CLASSES
): string => {
  const base = GRADIENT_CLASSES[baseClass];
  const mobile = mobileClass ? GRADIENT_CLASSES[mobileClass] : base;
  
  return `${mobile} md:${base.replace('bg-gradient-', 'md:bg-gradient-')}`;
};

// 애니메이션 배경 클래스
export const getAnimatedBackground = (
  baseClass: keyof typeof GRADIENT_CLASSES,
  animationType: 'pulse' | 'bounce' | 'spin' = 'pulse'
): string => {
  const base = GRADIENT_CLASSES[baseClass];
  return `${base} animate-${animationType}`;
};

// 테마별 배경 매핑
export const THEME_BACKGROUNDS = {
  light: {
    moonwave: 'bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200',
    sunset: 'bg-gradient-to-b from-orange-50 via-red-100 to-pink-200',
    ocean: 'bg-gradient-to-b from-teal-50 via-cyan-100 to-blue-200',
    forest: 'bg-gradient-to-b from-green-50 via-emerald-100 to-teal-200',
    purple: 'bg-gradient-to-b from-purple-50 via-indigo-100 to-blue-200',
  },
  dark: {
    moonwave: 'bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700',
    sunset: 'bg-gradient-to-b from-orange-900 via-red-800 to-pink-700',
    ocean: 'bg-gradient-to-b from-teal-900 via-cyan-800 to-blue-700',
    forest: 'bg-gradient-to-b from-green-900 via-emerald-800 to-teal-700',
    purple: 'bg-gradient-to-b from-purple-900 via-indigo-800 to-blue-700',
  },
} as const;

// 테마별 배경 가져오기
export const getThemeBackground = (
  variant: keyof typeof GRADIENT_CLASSES,
  theme: 'light' | 'dark' = 'dark'
): string => {
  return THEME_BACKGROUNDS[theme][variant] || THEME_BACKGROUNDS.dark.moonwave;
};

// 배경 전환 애니메이션 클래스
export const BACKGROUND_TRANSITIONS = {
  fade: 'transition-all duration-500 ease-in-out',
  slide: 'transition-all duration-700 ease-out',
  bounce: 'transition-all duration-300 ease-bounce',
} as const;

// 배경 전환 효과 적용
export const applyBackgroundTransition = (
  baseClass: string,
  transitionType: keyof typeof BACKGROUND_TRANSITIONS = 'fade'
): string => {
  return `${baseClass} ${BACKGROUND_TRANSITIONS[transitionType]}`;
};