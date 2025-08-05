import React, { forwardRef } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  variant?: 'default' | 'admin';
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  containerClassName?: string;
  maxLength?: number;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      variant = 'default',
      size = 'md',
      required = false,
      containerClassName = '',
      className = '',
      disabled = false,
      id,
      rows = 4,
      maxLength,
      value = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const currentLength = typeof value === 'string' ? value.length : 0;
    const isNearLimit = maxLength && currentLength > maxLength * 0.9;
    const isOverLimit = maxLength && currentLength > maxLength;

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const baseClasses = 'w-full rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-deep-teal/40 focus:border-deep-teal resize-none shadow-md';

    const variantClasses = {
      default: cn(
        'border-2 border-gray-300 bg-white text-text-primary placeholder:text-gray-500 hover:border-gray-400 focus:border-deep-teal focus:bg-white hover:shadow-lg focus:shadow-xl',
        disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed opacity-75 border-gray-200'
      ),
      admin: cn(
        'border-2 border-gray-300 rounded-lg text-right transition-all duration-200 shadow-md',
        error
          ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20 hover:border-red-500'
          : 'border-gray-300 bg-white hover:border-gray-400 focus:border-deep-teal hover:shadow-lg focus:shadow-xl',
        disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed opacity-75 border-gray-200'
      ),
    };

    const stateClasses = cn(
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500/40',
      success && 'border-green-500 focus:border-green-500 focus:ring-green-500/40',
      disabled && 'cursor-not-allowed',
      isOverLimit && 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
    );

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-2',
              variant === 'admin' ? 'text-deep-teal text-right' : 'text-text-primary'
            )}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            id={inputId}
            ref={ref}
            className={cn(
              baseClasses,
              sizeClasses[size],
              variantClasses[variant],
              stateClasses,
              className
            )}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            value={value}
            {...props}
          />

          {/* Status Icons */}
          {error && (
            <div className="absolute top-3 left-3 pointer-events-none">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
          {success && !error && (
            <div className="absolute top-3 left-3 pointer-events-none">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>

        {/* Character Counter */}
        {maxLength && (
          <div className={cn(
            'mt-1 text-xs text-right',
            isOverLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-gray-500'
          )}>
            {currentLength}/{maxLength} حرف
          </div>
        )}

        {/* Helper Text */}
        {error && (
          <p className={cn('mt-1 text-sm text-red-600', variant === 'admin' ? 'text-right' : '')}>{error}</p>
        )}
        {helperText && !error && (
          <p className={cn('mt-1 text-sm text-text-secondary', variant === 'admin' ? 'text-right' : '')}>{helperText}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea; 