import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  cn(
    // 기본 스타일 - Pretendard 폰트 적용
    'font-pretendard antialiased',
    'inline-flex items-center justify-center rounded-lg',
    'text-sm font-medium tracking-korean-normal',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]'
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-moonwave-primary text-white shadow-sm',
          'hover:bg-moonwave-blue-700 focus-visible:ring-moonwave-primary'
        ),
        destructive: cn(
          'bg-red-500 text-white shadow-sm',
          'hover:bg-red-600 focus-visible:ring-red-500'
        ),
        outline: cn(
          'border border-gray-200 bg-white text-gray-900 shadow-sm',
          'hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-moonwave-primary'
        ),
        secondary: cn(
          'bg-moonwave-secondary text-white shadow-sm',
          'hover:bg-moonwave-purple-700 focus-visible:ring-moonwave-secondary'
        ),
        ghost: cn(
          'text-gray-900 hover:bg-gray-100 focus-visible:ring-moonwave-primary'
        ),
        link: cn(
          'text-moonwave-primary underline-offset-4',
          'hover:underline focus-visible:ring-moonwave-primary'
        ),
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 py-1 text-xs',
        lg: 'h-12 px-6 py-3 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="-ml-1 mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="tracking-korean-normal break-keep-ko">
              처리 중...
            </span>
          </>
        ) : (
          <span className="tracking-korean-normal break-keep-ko">
            {children}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
