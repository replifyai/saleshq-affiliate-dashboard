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
    const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-[#131313] text-white hover:bg-[#2a2a2a]',
      secondary: 'bg-[#F5F5F5] text-[#131313] border border-[#E5E5E5] hover:bg-[#EBEBEB]',
      accent: 'bg-[#FFE887] text-[#131313] hover:bg-[#FFD54F]',
      outline: 'border-2 border-[#E5E5E5] text-[#131313] bg-transparent hover:bg-[#F5F5F5]',
      ghost: 'text-[#BCBCBC] bg-transparent hover:bg-[#F5F5F5] hover:text-[#131313]'
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-full',
      md: 'px-6 py-3 text-base rounded-full',
      lg: 'px-8 py-4 text-base rounded-full',
      xl: 'px-10 py-5 text-lg rounded-full'
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