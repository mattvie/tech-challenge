import React, { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    const baseClasses = 'w-full p-3 rounded-md text-base transition-colors duration-200';
    const borderClasses = hasError
      ? 'border-red-500 text-red-700 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20';
    const focusClasses = 'focus:outline-none focus:ring-2';

    return (
      <input
        ref={ref}
        className={clsx(baseClasses, borderClasses, focusClasses, className)}
        {...props}
      />
    );
  }
);