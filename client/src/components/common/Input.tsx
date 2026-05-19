import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-3">
        {label && (
          <label className="block text-[10px] uppercase tracking-[0.4em] font-black text-secondary ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={cn(
              "w-full bg-primary/5 border border-primary/10 rounded-sm px-6 py-4 text-[13px] tracking-widest text-primary placeholder:text-secondary/30 transition-all duration-500 focus:outline-none focus:border-luxury-gold focus:bg-primary/[0.08] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)]",
              error && "border-red-500/50 focus:border-red-500 focus:shadow-red-500/10",
              className
            )}
            {...props}
          />
          {/* Glass highlight effect */}
          <div className="absolute inset-0 rounded-sm pointer-events-none border border-primary/5 group-hover:border-primary/10 transition-colors" />
        </div>
        {error && (
          <p className="text-[9px] uppercase tracking-widest text-red-400 font-bold ml-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
