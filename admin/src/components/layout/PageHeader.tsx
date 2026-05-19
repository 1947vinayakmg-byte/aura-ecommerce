import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions, className }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10", className)}
    >
      <div className="space-y-1.5">
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-luxury-text-secondary text-base max-w-2xl">
            {description}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </motion.div>
  );
};

export default PageHeader;
