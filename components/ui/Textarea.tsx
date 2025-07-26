import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // 기본 스타일 - Pretendard 폰트 적용
          'font-pretendard antialiased',
          'flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2',
          'text-sm text-gray-900 placeholder:text-gray-400',
          'tracking-korean-normal break-keep-ko',
          'resize-y',
          
          // 포커스 스타일
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moonwave-primary focus-visible:ring-offset-2',
          'focus-visible:border-moonwave-primary',
          
          // 비활성화 스타일
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
          
          // 호버 스타일
          'hover:border-gray-300 transition-colors duration-200',
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';