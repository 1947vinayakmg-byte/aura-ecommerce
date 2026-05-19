import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Container = ({ children, className, size = 'lg' }: ContainerProps) => {
  const sizes = {
    sm: 'max-w-4xl',
    md: 'max-w-6xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1440px]',
    full: 'max-w-full px-4 md:px-12'
  };

  return (
    <div className={cn(
      'mx-auto px-6 md:px-12 lg:px-16 w-full',
      sizes[size],
      className
    )}>
      {children}
    </div>
  );
};

export default Container;
