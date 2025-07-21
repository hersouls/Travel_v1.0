import React from 'react';
import { cn } from '@/utils/helpers';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
      secondary: 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200',
      outline: 'border border-secondary-300 text-secondary-700',
      destructive: 'bg-error-100 text-error-800 hover:bg-error-200',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };