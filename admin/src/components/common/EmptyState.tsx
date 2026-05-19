import React from 'react';
import { ArchiveX } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = <ArchiveX className="w-16 h-16 text-luxury-text-secondary/20" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 glass-card text-center space-y-6">
      <div className="p-6 bg-white/5 rounded-3xl relative">
        {icon}
        <div className="absolute inset-0 bg-luxury-gold/5 blur-3xl -z-10 rounded-full" />
      </div>
      
      <div className="max-w-xs space-y-2">
        <h3 className="text-xl font-display font-bold text-white">{title}</h3>
        <p className="text-sm text-luxury-text-secondary leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
