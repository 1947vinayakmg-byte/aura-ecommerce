import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Fashion Hero"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
      </div>

      <div className="relative z-10 text-center lg:text-left px-12 lg:px-24 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-luxury-gold tracking-[0.6em] text-[12px] uppercase mb-8 font-semibold"
          >
            Spring / Summer 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-6xl md:text-[7rem] font-serif italic light leading-[0.9] mb-10 tracking-tight"
          >
            Define Your <br />
            <span className="not-italic font-bold tracking-tighter text-primary">Presence.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-secondary text-sm md:text-md mb-12 max-w-md tracking-widest leading-loose italic font-light"
          >
            Experience the intersection of architectural structure and fluid elegance. Crafted for those who command every room they enter.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-8"
          >
            <Link to="/shop">
              <Button variant="gold" size="lg" icon={<ArrowRight size={16} />}>
                Shop Selection
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Explore Film
            </Button>
          </motion.div>
        </div>

        <div className="flex-1 hidden lg:flex justify-end relative h-[600px]">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="w-[420px] h-[580px] bg-luxury-dark border border-white/5 relative glass p-1"
          >
            <div className="absolute -left-20 bottom-20 w-72 p-8 glass backdrop-blur-3xl rounded-sm shadow-2xl z-20">
              <div className="text-[10px] text-luxury-gold tracking-[0.4em] uppercase mb-3 font-black">Editorial Pick</div>
              <div className="text-2xl font-serif mb-2 leading-none">Aura Silk Dusk</div>
              <div className="text-[14px] text-secondary font-mono tracking-widest mb-6 italic">₹1,250.00</div>
              <Link to="/product/1" className="text-[10px] tracking-[0.3em] uppercase font-bold text-primary border-b border-luxury-gold pb-1 hover:text-luxury-gold transition-colors">
                View Details
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800"
              alt="Feature product"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute -right-6 -top-6 text-[100px] font-serif text-luxury-gold/10 pointer-events-none select-none">AURA</div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
