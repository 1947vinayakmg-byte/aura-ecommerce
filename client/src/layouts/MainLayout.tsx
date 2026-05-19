import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../animations/ScrollToTop';
import { pageTransition } from '../animations/pageTransition';
import { useScroll, useSpring } from 'motion/react';
import SEO from '../components/common/SEO';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-luxury-black font-sans text-primary relative transition-colors duration-500 overflow-x-hidden">
      <SEO />
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-luxury-gold origin-left z-[100] shadow-[0_0_10px_rgba(212,175,55,0.5)]"
        style={{ scaleX }}
      />
      {/* Ambient Aesthetic Background Elements */}
      <div className="ambient-glow-1 fixed top-0 right-0 w-[800px] h-[800px] bg-luxury-gold/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="ambient-glow-2 fixed bottom-0 left-0 w-[600px] h-[600px] bg-white/3 blur-[100px] rounded-full pointer-events-none -z-10 opacity-20" />
      
      <ScrollToTop />
      <Navbar />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          className="relative z-10"
        >
          {children || <Outlet />}
        </motion.div>
      </AnimatePresence>

      <Footer />
      
      {/* Scroll indicator for some sections or global presence */}
      <div className="fixed bottom-10 right-10 z-50 pointer-events-none hidden lg:block">
        <div className="flex flex-col items-center gap-4 opacity-20">
          <span className="text-[8px] uppercase tracking-[0.5em] vertical-text">AURA L'ÉLITE</span>
          <div className="w-[1px] h-20 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
