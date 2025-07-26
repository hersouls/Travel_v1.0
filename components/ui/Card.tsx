import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: 'default' | 'bordered' | 'elevated';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          '@container bg-white rounded-lg border border-gray-200 font-pretendard',
          {
            'shadow-sm': variant === 'default',
            'border-2': variant === 'bordered',
            'shadow-lg border-0': variant === 'elevated',
            'transition-all duration-200 hover:shadow-md hover:border-gray-300 cursor-pointer': hover,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-lg font-semibold leading-none tracking-korean-tight break-keep-ko',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-sm text-gray-600 tracking-korean-normal break-keep-ko',
        className
      )}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn('p-6 pt-0', className)} 
      {...props} 
    />
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';