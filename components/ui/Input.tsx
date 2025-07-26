import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // 기본 스타일 - Pretendard 폰트 적용
          'font-pretendard antialiased',
          'flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2',
          'text-sm text-gray-900 placeholder:text-gray-400',
          'tracking-korean-normal break-keep-ko',
          
          // 포커스 스타일
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moonwave-primary focus-visible:ring-offset-2',
          'focus-visible:border-moonwave-primary',
          
          // 비활성화 스타일
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
          
          // 호버 스타일
          'hover:border-gray-300 transition-colors duration-200',
          
          // 파일 input 스타일
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-900',
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, helperText, label, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 font-pretendard tracking-korean-normal break-keep-ko"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-pretendard tracking-korean-normal',
            'placeholder-gray-400 transition-colors duration-200 resize-vertical',
            'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            'break-keep-ko',
            {
              'border-error-500 focus:border-error-500 focus:ring-error-500': error,
            },
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              'text-xs font-pretendard tracking-korean-normal break-keep-ko',
              error ? 'text-error-600' : 'text-gray-500'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';