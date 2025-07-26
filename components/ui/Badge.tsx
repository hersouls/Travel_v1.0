import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-pretendard tracking-korean-normal transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        primary: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
        secondary: 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200',
        success: 'bg-success-100 text-success-800 hover:bg-success-200',
        warning: 'bg-warning-100 text-warning-800 hover:bg-warning-200',
        error: 'bg-error-100 text-error-800 hover:bg-error-200',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        
        // 여행 관련 변형
        beach: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
        mountain: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
        city: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
        nature: 'bg-green-100 text-green-800 hover:bg-green-200',
        culture: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
        food: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
        shopping: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
        adventure: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

// 여행 타입에 따른 배지 생성 헬퍼 함수
export const getTravelTypeBadge = (type: string) => {
  const typeMap: Record<string, { variant: string; label: string }> = {
    beach: { variant: 'beach', label: '해변' },
    mountain: { variant: 'mountain', label: '산/자연' },
    city: { variant: 'city', label: '도시' },
    nature: { variant: 'nature', label: '자연' },
    culture: { variant: 'culture', label: '문화' },
    food: { variant: 'food', label: '맛집' },
    shopping: { variant: 'shopping', label: '쇼핑' },
    adventure: { variant: 'adventure', label: '모험' },
    default: { variant: 'default', label: '기타' },
  };

  return typeMap[type] || typeMap.default;
};

// 여행 기간에 따른 배지
export const getDurationBadge = (days: number) => {
  if (days === 1) {
    return { variant: 'success', label: '당일치기' };
  } else if (days <= 3) {
    return { variant: 'primary', label: '단기' };
  } else if (days <= 7) {
    return { variant: 'secondary', label: '중기' };
  } else {
    return { variant: 'warning', label: '장기' };
  }
};