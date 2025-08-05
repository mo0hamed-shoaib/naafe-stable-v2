import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, required = false, containerClassName = '', className = '', ...props }, ref) => {
    return (
      <div className={containerClassName}>
        <label className="block text-sm font-semibold text-deep-teal text-right mb-2">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
        
        <div className="relative">
          <textarea
            ref={ref}
            className={`
              w-full px-4 py-3 border rounded-lg text-right transition-colors resize-none
              focus:outline-none focus:ring-2 focus:ring-deep-teal/20 focus:border-deep-teal
              ${error 
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-warm-cream bg-white hover:border-soft-teal'
              }
              ${className}
            `}
            {...props}
          />
          
          {error && (
            <div className="absolute left-3 top-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600 text-right">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-soft-teal text-right">{helperText}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea; 