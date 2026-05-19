import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'black' | 'outline' | 'danger' | 'emerald';
  size?: 'sm' | 'md';
}

const Badge = ({ children, variant = 'gold', size = 'sm' }: BadgeProps) => {
  const variants = {
    gold: 'bg-luxury-gold text-black gold-glow',
    black: 'bg-primary text-luxury-black',
    outline: 'border border-primary/20 text-primary',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-[8px]',
    md: 'px-4 py-2 text-[10px]'
  };

  return (
    <span className={cn(
      'font-black uppercase tracking-[0.2em] rounded-sm inline-flex items-center justify-center',
      variants[variant],
      sizes[size]
    )}>
      {children}
    </span>
  );
};

export default Badge;
