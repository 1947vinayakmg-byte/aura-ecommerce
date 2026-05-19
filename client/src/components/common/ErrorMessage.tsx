import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "An unexpected interruption occurred in the sanctuary.",
  onRetry
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-32 flex flex-col items-center justify-center text-center px-6"
    >
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-8 border border-red-500/20">
        <AlertCircle size={24} strokeWidth={1.5} />
      </div>

      <h3 className="text-xl font-display tracking-[0.2em] mb-4 uppercase text-red-500">System Deviation</h3>
      <p className="text-secondary text-xs tracking-widest leading-loose max-w-sm mb-10">
        {message}
      </p>

      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          icon={<RotateCcw size={14} />}
        >
          Retry Connection
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;
