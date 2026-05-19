import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, ShieldCheck } from 'lucide-react';

const Contact = () => {
  return (
    <main className="bg-luxury-black min-h-screen text-primary pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] font-black mb-6 block"
          >
            Aura Concierge
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-serif italic mb-8 tracking-tight"
          >
            How May We <br />
            <span className="not-italic font-bold text-primary">Assist You?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-secondary text-sm md:text-lg tracking-widest max-w-2xl mx-auto italic leading-loose"
          >
            Our dedicated team of advisors is available to provide personalized assistance with your acquisitions and inquiries.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Contact Information */}
          <div className="space-y-16">
            <section>
              <h2 className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] mb-12 font-bold border-b border-primary/5 pb-4">Direct Communication</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-luxury-gold group-hover:text-black transition-all">
                    <MessageSquare size={18} strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-black">Live Concierge</p>
                  <p className="text-xs text-secondary tracking-widest">Available 24/7 via secure link</p>
                </div>
                <div className="space-y-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-luxury-gold group-hover:text-black transition-all">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-black">Private Inquiries</p>
                  <p className="text-xs text-secondary tracking-widest">concierge@aura-elite.com</p>
                </div>
                <div className="space-y-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-luxury-gold group-hover:text-black transition-all">
                    <Phone size={18} strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-black">Global Line</p>
                  <p className="text-xs text-secondary tracking-widest">+33 1 23 45 67 89</p>
                </div>
                <div className="space-y-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-luxury-gold group-hover:text-black transition-all">
                    <Clock size={18} strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-black">Response Time</p>
                  <p className="text-xs text-secondary tracking-widest">Under 2 hours guaranteed</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] mb-12 font-bold border-b border-primary/5 pb-4">Global Ateliers</h2>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <MapPin className="text-luxury-gold shrink-0" size={20} strokeWidth={1.5} />
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-2">Flagship Paris</p>
                    <p className="text-xs text-secondary tracking-widest leading-loose uppercase">
                      42 Avenue de la Concorde <br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <MapPin className="text-luxury-gold shrink-0" size={20} strokeWidth={1.5} />
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-2">London Studio</p>
                    <p className="text-xs text-secondary tracking-widest leading-loose uppercase">
                      15 Savile Row <br />
                      Mayfair, London W1S 3PJ
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass p-12 md:p-16 rounded-sm relative"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck size={120} strokeWidth={0.5} className="text-luxury-gold" />
            </div>
            
            <h3 className="text-2xl font-display tracking-widest mb-12 uppercase">Secure Message</h3>
            <form className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Full Identity</label>
                  <input type="text" placeholder="ALEXANDER MCQUEEN" className="bg-transparent border-b border-primary/10 py-4 text-xs tracking-widest focus:outline-none focus:border-luxury-gold transition-colors uppercase" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Email Secure</label>
                  <input type="email" placeholder="VIP@AURA-ELITE.COM" className="bg-transparent border-b border-primary/10 py-4 text-xs tracking-widest focus:outline-none focus:border-luxury-gold transition-colors uppercase" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Nature of Inquiry</label>
                <select className="bg-transparent border-b border-primary/10 py-4 text-xs tracking-widest focus:outline-none focus:border-luxury-gold transition-colors uppercase appearance-none cursor-pointer">
                  <option className="bg-luxury-black">General Inquiry</option>
                  <option className="bg-luxury-black">Private Shopping</option>
                  <option className="bg-luxury-black">Order Status</option>
                  <option className="bg-luxury-black">Bespoke Requests</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Message Content</label>
                <textarea rows={6} placeholder="DESCRIBE YOUR REQUIREMENTS..." className="bg-transparent border-b border-primary/10 py-4 text-xs tracking-widest focus:outline-none focus:border-luxury-gold transition-colors uppercase resize-none"></textarea>
              </div>
              
              <button className="w-full bg-primary text-luxury-black py-6 rounded-sm text-[10px] uppercase tracking-[0.4em] font-black flex items-center justify-center gap-3 hover:bg-luxury-gold hover:text-black transition-all gold-glow group">
                TRANSMIT MESSAGE <Send size={16} className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
              </button>
              
              <p className="text-[9px] text-secondary text-center uppercase tracking-widest opacity-50">
                Encrypted with 256-bit SSL security.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
