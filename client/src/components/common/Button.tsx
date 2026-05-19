import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'outline' | 'ghost' | 'luxury';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-luxury-black hover:bg-primary/90',
      outline: 'border border-primary/20 text-primary hover:border-primary hover:bg-primary/5',
      ghost: 'text-secondary hover:text-primary hover:bg-primary/5',
      luxury: 'border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black hover:gold-glow shadow-[0_0_15px_rgba(212,175,55,0.1)]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-[10px]',
      md: 'px-8 py-4 text-[11px]',
      lg: 'px-12 py-5 text-[12px]',
      xl: 'px-16 py-6 text-[14px]',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative flex items-center justify-center font-black uppercase tracking-[0.3em] transition-all duration-500 rounded-sm overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading}
        {...props}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center"
            >
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.span
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10"
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
        
        {/* Hover Effect Layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
      </motion.button>
    );
  }
);

import { AnimatePresence } from 'motion/react';

Button.displayName = 'Button';

export default Button;
