import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  enableContainerQueries?: boolean;
}

export default function ResponsiveContainer({
  children,
  className,
  size = 'lg',
  enableContainerQueries = true,
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none',
  };

  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        enableContainerQueries && '@container',
        className
      )}
    >
      <div
        className={cn(
          'space-y-6',
          // Container query responsive spacing
          enableContainerQueries && [
            '@sm:space-y-8',
            '@md:space-y-10',
            '@lg:space-y-12',
          ]
        )}
      >
        {children}
      </div>
    </div>
  );
}
