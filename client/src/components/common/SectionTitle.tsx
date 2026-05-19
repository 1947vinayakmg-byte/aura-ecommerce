import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const SectionTitle = ({ subtitle, title, description, align = 'center', className }: SectionTitleProps) => {
  return (
    <div className={cn(
      'mb-20',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      className
    )}>
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] font-black mb-6 block"
        >
          {subtitle}
        </motion.span>
      )}
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
        className="text-4xl md:text-6xl font-display tracking-[0.2em] mb-8 uppercase leading-tight"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-secondary text-sm tracking-widest max-w-2xl mx-auto uppercase leading-relaxed font-medium"
        >
          {description}
        </motion.p>
      )}

      {/* Decorative Line */}
      {align === 'center' && (
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: 60 }}
          viewport={{ once: true }}
          className="h-[1px] bg-luxury-gold mx-auto mt-12 opacity-50" 
        />
      )}
    </div>
  );
};

export default SectionTitle;
