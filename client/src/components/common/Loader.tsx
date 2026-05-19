import React from 'react';
import { motion } from 'motion/react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[300] bg-luxury-black flex items-center justify-center">
      <div className="relative flex flex-col items-center">
        {/* Cinematic Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border border-primary/5 border-t-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]"
        />
        
        {/* Inner Pulsing Brand Logo / Placeholder */}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-[10px] font-serif font-bold tracking-[0.5em] text-luxury-gold uppercase translate-x-1">AURA</span>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-[8px] uppercase tracking-[0.6em] text-secondary font-black"
        >
          Preparing the Volume
        </motion.p>
      </div>
    </div>
  );
};

export default Loader;
