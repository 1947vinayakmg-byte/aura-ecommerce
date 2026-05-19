import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { collections } from '../../data/mockData';
import { ArrowRight } from 'lucide-react';

const FeaturedCollection = () => {
  return (
    <section id="collections" className="py-32 px-6 md:px-12 bg-luxury-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <span className="text-luxury-gold text-xs tracking-[0.4em] mb-4 block uppercase font-bold">Our Universe</span>
            <h2 className="text-3xl md:text-5xl font-display leading-tight tracking-[0.1em]">THE COLLECTIONS</h2>
          </div>
          <Link to="/shop" className="group flex items-center gap-4 text-xs tracking-[0.3em] uppercase hover:text-luxury-gold transition-colors pb-2 border-b border-primary/10 hover:border-luxury-gold">
            Explore All <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((collection, idx) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative h-[600px] overflow-hidden bg-luxury-dark"
            >
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              <div className="absolute inset-x-8 bottom-12">
                <h3 className="text-xl md:text-2xl font-display tracking-widest mb-6 leading-tight">{collection.title}</h3>
                <Link to={collection.path} className="text-[10px] tracking-[0.4em] uppercase font-bold py-3 px-6 border border-white/20 hover:bg-luxury-gold hover:border-luxury-gold hover:text-black transition-all duration-500 rounded-sm">
                  View Volume
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
