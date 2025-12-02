import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary-gradient text-[#231F20] hover:translate-y-[-2px] hover:shadow-lg focus:ring-primary',
      secondary: 'bg-secondary-gradient text-[#231F20] border border-[#FFD100] hover:translate-y-[-2px] hover:shadow-lg focus:ring-secondary',
      accent: 'bg-accent-gradient text-[#231F20] hover:translate-y-[-2px] hover:shadow-lg focus:ring-accent',
      outline: 'border-2 border-[#FFD100] text-[#231F20] bg-transparent hover:bg-[#FFFAE6] focus:ring-primary',
      ghost: 'text-muted-foreground bg-transparent hover:bg-[#FFFAE6] hover:text-foreground focus:ring-muted'
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-xl',
      xl: 'px-10 py-5 text-xl rounded-xl'
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;