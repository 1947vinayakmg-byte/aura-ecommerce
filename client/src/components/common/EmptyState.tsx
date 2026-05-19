import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, Sparkles } from 'lucide-react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  actionPath
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-32 flex flex-col items-center justify-center text-center px-6"
    >
      <div className="relative mb-12">
        <div className="w-24 h-24 rounded-full border border-primary/5 flex items-center justify-center text-secondary">
          <Icon size={40} strokeWidth={1} />
        </div>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute inset-0 bg-luxury-gold blur-[40px] rounded-full -z-10"
        />
      </div>

      <h3 className="text-2xl font-display tracking-[0.3em] mb-6 uppercase">{title}</h3>
      <p className="text-secondary text-sm md:text-md tracking-widest leading-loose max-w-md mb-12 italic">
        {description}
      </p>

      {actionLabel && actionPath && (
        <Button 
          variant="luxury" 
          onClick={() => navigate(actionPath)}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
