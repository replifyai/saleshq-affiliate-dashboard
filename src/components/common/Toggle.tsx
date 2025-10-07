import React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ checked, onChange, label, disabled, className, id, ...props }, ref) => {
    const toggleId = id || (label ? `toggle-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={cn('flex items-center space-x-3', className)}>
        <div className="relative inline-flex items-center">
          <input
            ref={ref}
            id={toggleId}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <label
            htmlFor={toggleId}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out cursor-pointer',
              disabled ? 'cursor-not-selectable opacity-50' : 'cursor-pointer',
              checked ? 'bg-primary-gradient' : 'bg-muted'
            )}
          >
            <span
              className={cn(
                'inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out',
                checked ? 'translate-x-5' : 'translate-x-0.5'
              )}
            />
          </label>
        </div>
        {label && (
          <label
            htmlFor={toggleId}
            className={cn(
              'text-sm font-medium text-foreground cursor-pointer',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;