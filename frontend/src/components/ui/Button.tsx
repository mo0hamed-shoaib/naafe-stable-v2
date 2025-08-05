
import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}, ref) => {
  // Base classes with Material Design principles
  const baseClasses = [
    // Typography & Layout
    'inline-flex items-center justify-center font-medium',
    'border border-transparent rounded-lg',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'active:scale-[0.98]', // Material Design press feedback
    'hover:scale-[1.01]', // Subtle hover scaling
  ].join(' ');

  // Variant classes with Material Design color system
  const variantClasses = {
    primary: [
      'bg-deep-teal text-white',
      'hover:bg-deep-teal/90 hover:shadow-md',
      'focus:ring-deep-teal/50',
      'active:bg-deep-teal/95'
    ].join(' '),
    
    secondary: [
      'bg-bright-orange text-white',
      'hover:bg-bright-orange/90 hover:shadow-md',
      'focus:ring-bright-orange/50',
      'active:bg-bright-orange/95'
    ].join(' '),
    
    ghost: [
      'bg-transparent text-text-primary',
      'hover:bg-bright-orange/10 hover:text-deep-teal',
      'focus:ring-bright-orange/30',
      'active:bg-bright-orange/20'
    ].join(' '),
    
    outline: [
      'bg-warm-cream border-2 border-deep-teal text-deep-teal',
      'hover:bg-deep-teal hover:text-white hover:shadow-md',
      'focus:ring-deep-teal/50',
      'active:bg-deep-teal/95'
    ].join(' '),
    
    danger: [
      'bg-red-600 text-white',
      'hover:bg-red-700 hover:shadow-md',
      'focus:ring-red-500/50',
      'active:bg-red-800'
    ].join(' '),
    
    success: [
      'bg-green-600 text-white',
      'hover:bg-green-700 hover:shadow-md',
      'focus:ring-green-500/50',
      'active:bg-green-800'
    ].join(' '),
    
    link: [
      'bg-transparent text-deep-teal underline-offset-4',
      'hover:text-deep-teal/80 hover:underline',
      'focus:ring-deep-teal/30',
      'active:text-deep-teal/90'
    ].join(' ')
  };

  // Size classes with consistent spacing scale
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-5 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3'
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div 
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
      aria-hidden="true"
    />
  );

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
              disabled={disabled || loading}
        {...(disabled || loading ? { 'aria-disabled': 'true' } : {})}
        {...(loading ? { 'aria-busy': 'true' } : {})}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          <span className="sr-only">Loading</span>
          <span aria-live="polite">Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="flex-shrink-0" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <span className="flex-shrink-0">{children}</span>
          {rightIcon && (
            <span className="flex-shrink-0" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button; 