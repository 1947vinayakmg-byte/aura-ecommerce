import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductGrid from '../components/product/ProductGrid';
import EmptyState from '../components/common/EmptyState';

const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();

  return (
    <main className="bg-luxury-black min-h-screen text-primary pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-primary/5 pb-12">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] font-black mb-6 block"
            >
              Curated Desire
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-7xl font-serif italic tracking-tight"
            >
              The Treasure <br />
              <span className="not-italic font-bold text-primary uppercase">Vault.</span>
            </motion.h1>
          </div>

          {wishlist.length > 0 && (
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={clearWishlist}
              className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-secondary hover:text-red-500 transition-colors pb-2 border-b border-primary/5 hover:border-red-500/20"
            >
              <Trash2 size={14} /> Dissolve All Items
            </motion.button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {wishlist.length === 0 ? (
            <EmptyState 
              icon={Heart}
              title="The Vault is Vacant"
              description="Your curated archive is currently empty. Explore our meticulously designed collections to find pieces that define your presence."
              actionLabel="Begin Discovery"
              actionPath="/shop"
            />
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ProductGrid products={wishlist} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishlist Recommendations */}
        {wishlist.length > 0 && (
          <section className="mt-48 pt-32 border-t border-primary/5">
            <div className="text-center mb-24">
              <span className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] mb-4 block font-bold">Refined Selection</span>
              <h2 className="text-3xl md:text-5xl font-display tracking-[0.2em]">COMPLETE THE ARCHIVE</h2>
            </div>
            
            <div className="glass p-12 md:p-24 rounded-sm text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/5 via-transparent to-luxury-gold/5 opacity-50" />
              <div className="relative z-10">
                <p className="text-xl md:text-3xl font-serif italic mb-12 tracking-wide leading-relaxed">
                  "Desire is the precursor to identity. <br />Your vault represents the next evolution of your aesthetic."
                </p>
                <Link to="/shop" className="inline-block text-[10px] uppercase tracking-[0.5em] font-black border-b border-luxury-gold pb-2 hover:text-luxury-gold transition-colors">
                  Continue Curating
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
