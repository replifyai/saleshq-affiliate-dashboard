import React from 'react';
import { cn } from '@/lib/utils';

export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'tel';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({
    label,
    placeholder,
    value,
    onChange,
    type = 'text',
    error,
    disabled,
    required,
    className,
    id,
    name,
    autoComplete,
    ...props
  }, ref) => {
    const inputId = id || name || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ease-in-out',
            'bg-card text-foreground placeholder:text-muted-foreground',
            'border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20',
            'hover:border-secondary disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-destructive focus:border-destructive focus:ring-destructive',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive flex items-center">
            <span className="mr-1">⚠️</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;