import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Shield, Sparkles, Award } from 'lucide-react';

const About = () => {
  return (
    <main className="bg-luxury-black min-h-screen text-primary overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Atelier"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-luxury-gold text-[10px] uppercase tracking-[0.6em] font-black mb-6 block"
          >
            Since 2024
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-5xl md:text-8xl font-serif italic mb-8 tracking-tighter"
          >
            The Heritage of <br />
            <span className="not-italic font-bold text-primary">Aura L'Élite.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="w-px h-24 bg-gradient-to-b from-luxury-gold to-transparent mx-auto"
          />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] mb-6 block font-bold">The Vision</span>
            <h2 className="text-3xl md:text-5xl font-display mb-10 tracking-[0.1em] leading-tight">ARCHITECTURAL SILHOUETTES, <br />FLUID ELEGANCE.</h2>
            <p className="text-secondary text-sm md:text-lg leading-loose tracking-widest mb-12 italic">
              Aura was founded on the principle that luxury is a dialogue between the wearer and the world. 
              Our pieces aren't just garments; they are architectural statements crafted from the world's 
              most exclusive materials.
            </p>
            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-primary/5">
              <div>
                <h4 className="text-luxury-gold font-display text-2xl mb-2">100%</h4>
                <p className="text-[10px] uppercase tracking-widest text-secondary">Virgin Materials</p>
              </div>
              <div>
                <h4 className="text-luxury-gold font-display text-2xl mb-2">PARIS</h4>
                <p className="text-[10px] uppercase tracking-widest text-secondary">Design Atelier</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] bg-luxury-dark border border-primary/5 overflow-hidden group"
          >
            <img 
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800" 
              alt="Craftsmanship" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-luxury-gold">Craftsmanship</span>
              <p className="text-xl font-serif text-white mt-2">The Hands of Aura</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-luxury-card py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] mb-4 block font-bold">Our Pillars</span>
            <h2 className="text-3xl md:text-5xl font-display tracking-[0.2em]">UNCOMPROMISING QUALITY</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Globe, title: "Sourcing", desc: "We traverse the globe for the finest silks, cashmeres, and leathers, ensuring every thread meets our legacy standard." },
              { icon: Shield, title: "Artistry", desc: "Each piece is hand-finished by master tailors with decades of experience in high-end couture." },
              { icon: Award, title: "Legacy", desc: "An Aura piece is designed to transcend seasons, becoming a permanent fixture in your personal archive." }
            ].map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="glass p-12 text-center group hover:bg-luxury-gold/5 transition-colors border border-primary/5 hover:border-luxury-gold/20"
              >
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-8 group-hover:bg-luxury-gold group-hover:text-black transition-all">
                  <value.icon size={28} strokeWidth={1} />
                </div>
                <h3 className="text-xl font-display tracking-widest mb-6 uppercase">{value.title}</h3>
                <p className="text-secondary text-xs tracking-widest leading-loose italic">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-48 relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
            alt="CTA Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        
        <div className="relative z-10 max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Sparkles className="text-luxury-gold mx-auto mb-8" size={40} strokeWidth={1} />
            <h2 className="text-4xl md:text-6xl font-serif italic mb-12 tracking-tight">Begin Your Narrative.</h2>
            <p className="text-secondary tracking-[0.2em] text-sm md:text-lg mb-12 leading-loose">
              Join the elite. Explore our current collections or speak with a personal concierge.
            </p>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              <Link to="/shop" className="bg-luxury-gold text-black px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] rounded-sm hover:bg-luxury-gold-light transition-all gold-glow">
                Explore Shop
              </Link>
              <Link to="/contact" className="text-primary border border-primary/20 px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] rounded-sm hover:border-luxury-gold transition-all">
                Speak with Concierge
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default About;
