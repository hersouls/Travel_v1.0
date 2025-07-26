import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error = false, helperText, label, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 font-pretendard tracking-korean-normal break-keep-ko"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-pretendard tracking-korean-normal',
            'placeholder-gray-400 transition-colors duration-200',
            'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
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