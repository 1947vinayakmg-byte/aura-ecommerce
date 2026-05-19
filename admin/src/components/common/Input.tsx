import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-xs font-semibold text-luxury-text-secondary uppercase tracking-wider ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary group-focus-within:text-luxury-gold transition-colors duration-200">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "w-full bg-luxury-secondary-bg border border-luxury-border text-white text-sm rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:border-luxury-gold/50 focus:ring-4 focus:ring-luxury-gold/5 placeholder:text-luxury-text-secondary/50",
              icon && "pl-11",
              error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/5",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
