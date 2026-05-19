import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Eleanor Vance",
    role: "Creative Director",
    content: "Aura L'Élite isn't just fashion; it's an architectural manifesto. The way the Silk Dusk Blazer commands space is unparalleled in modern couture.",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 2,
    name: "Julian Thorne",
    role: "Private Collector",
    content: "The attention to detail in the hidden seams and the weight of the Italian silk makes every piece feel like a wearable treasure. Uncompromising quality.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 3,
    name: "Sienna Moretti",
    role: "Architect",
    content: "I appreciate the structural integrity of the silhouettes. Aura understands that a garment should empower the wearer through form and function.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  }
];

const Testimonials = () => {
  return (
    <section className="py-32 px-6 md:px-12 bg-luxury-dark relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
        <Quote size={300} strokeWidth={1} className="text-luxury-gold" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <span className="text-luxury-gold text-xs tracking-[0.4em] mb-4 block uppercase font-bold">Client Perspectives</span>
          <h2 className="text-3xl md:text-5xl font-display leading-tight tracking-[0.1em]">THE VOICES OF AURA</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="glass p-12 rounded-sm border border-white/5 relative group hover:border-luxury-gold/20 transition-all duration-500"
            >
              <div className="flex gap-1 text-luxury-gold mb-8">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <p className="text-secondary text-sm md:text-md tracking-widest leading-loose mb-12 italic">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-8">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-luxury-gold/30">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-black">{t.name}</h4>
                  <p className="text-[9px] uppercase tracking-widest text-secondary mt-1">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
