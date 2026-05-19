import React from 'react';
import { motion } from 'motion/react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className="relative w-16 h-16">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-full h-full border-4 border-luxury-gold/20 border-t-luxury-gold rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-luxury-gold/10 rounded-full blur-xl"
        />
      </div>
      <p className="text-sm font-medium text-luxury-text-secondary animate-pulse uppercase tracking-[0.2em]">
        Loading Aura L'Élite
      </p>
    </div>
  );
};

export default Loader;
