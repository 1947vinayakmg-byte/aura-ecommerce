import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'solid' | 'outline' | 'gold';
  isHoverable?: boolean;
}

const Card = ({ 
  children, 
  className, 
  variant = 'glass', 
  isHoverable = true,
  ...props 
}: CardProps) => {
  const variants = {
    glass: 'glass shadow-2xl',
    solid: 'bg-luxury-card border border-primary/5',
    outline: 'border border-primary/10 bg-transparent',
    gold: 'bg-luxury-gold/5 border border-luxury-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.05)]'
  };

  return (
    <motion.div
      whileHover={isHoverable ? { y: -10, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } : {}}
      className={cn(
        'rounded-sm p-8 transition-all duration-700 relative overflow-hidden',
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Subtle ambient light inside card */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
