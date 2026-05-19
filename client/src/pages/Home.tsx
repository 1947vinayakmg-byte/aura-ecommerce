import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import HeroSection from '../components/home/HeroSection';
import FeaturedCollection from '../components/home/FeaturedCollection';
import Testimonials from '../components/home/Testimonials';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const { data } = await API.get('/products');
        const products = data.products || [];
        const trending = products.filter((p: any) => p.isTrending);
        setTrendingProducts(trending.length > 0 ? trending : products.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch trending products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <main className="overflow-hidden">
      <HeroSection />

      <FeaturedCollection />

      {/* Trending Products */}
      <section className="py-32 px-6 md:px-12 bg-luxury-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-luxury-gold text-xs tracking-[0.4em] mb-4 block uppercase font-bold">Curated Selection</span>
            <h2 className="text-3xl md:text-5xl font-display leading-tight tracking-[0.1em]">TRENDING PIECES</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[3/4] bg-neutral-900 border border-white/5 rounded-sm relative overflow-hidden" />
                  <div className="flex justify-between items-start pt-2">
                    <div className="space-y-2 w-2/3">
                      <div className="h-4 bg-neutral-900 rounded w-full" />
                      <div className="h-3 bg-neutral-900 rounded w-1/2" />
                    </div>
                    <div className="h-4 bg-neutral-900 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={trendingProducts} />
          )}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="relative py-48 px-6 md:px-12 overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&q=80&w=2000"
            alt="Brand Story Background"
            className="w-full h-full object-cover opacity-20 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-6xl font-serif italic mb-12 capitalize tracking-normal text-luxury-gold">
              "Luxury is not just fashion. It is identity, confidence, and presence."
            </h2>
            <p className="text-secondary tracking-[0.2em] text-sm md:text-lg mb-12 leading-loose">
              Founded in Paris with a commitment to uncompromising quality and architectural silhouettes.
              Our pieces are designed as modern armor, empowering those who wear them to command the room.
            </p>
            <Link to="/about" className="inline-block text-xs uppercase tracking-[0.4em] border-b border-luxury-gold pb-2 hover:text-luxury-gold transition-colors">
              Our Philosophy
            </Link>
          </motion.div>
        </div>
      </section>

      <Testimonials />

      {/* New Arrivals Banner */}
      <section className="py-24 bg-luxury-gold">
        <div className="max-w-7xl mx-auto px-6 text-black flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-4 italic">NEW SEASON DROP</h2>
            <p className="text-black/60 tracking-widest text-sm uppercase font-bold">FEBRUARY 2026 • LIMITED QUANTITIES</p>
          </div>
          <Link to="/shop">
            <Button variant="primary" size="lg">Acquire Now</Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
