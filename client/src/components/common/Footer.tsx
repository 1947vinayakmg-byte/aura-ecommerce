import { Mail, Instagram, Facebook, Twitter, Youtube, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-luxury-black text-primary pt-24 pb-12 px-6 md:px-12 border-t border-primary/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-24">
        <div className="flex flex-col gap-8">
          <Link to="/" className="text-3xl font-display font-bold tracking-[0.3em]">
            AURA<span className="text-luxury-gold">.</span>
          </Link>
          <p className="text-secondary text-sm leading-loose max-w-xs">
            Defining modern elegance through meticulously crafted luxury apparel. 
            Experience fashion as an identity.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-luxury-gold transition-colors"><Instagram size={20} strokeWidth={1.5} /></a>
            <a href="#" className="hover:text-luxury-gold transition-colors"><Twitter size={20} strokeWidth={1.5} /></a>
            <a href="#" className="hover:text-luxury-gold transition-colors"><Youtube size={20} strokeWidth={1.5} /></a>
            <a href="#" className="hover:text-luxury-gold transition-colors"><Facebook size={20} strokeWidth={1.5} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-luxury-gold font-display text-sm tracking-[0.2em] mb-8">SHOP</h4>
          <ul className="flex flex-col gap-4 text-sm text-secondary">
            <li><Link to="/shop?category=Men" className="hover:text-white transition-colors">Men's Collection</Link></li>
            <li><Link to="/shop?category=Women" className="hover:text-white transition-colors">Women's Collection</Link></li>
            <li><Link to="/shop?category=Streetwear" className="hover:text-white transition-colors">Street Couture</Link></li>
            <li><Link to="/shop?category=Essentials" className="hover:text-white transition-colors">Premium Essentials</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-luxury-gold font-display text-sm tracking-[0.2em] mb-8">ASSISTANCE</h4>
          <ul className="flex flex-col gap-4 text-sm text-secondary">
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-luxury-gold font-display text-sm tracking-[0.2em] mb-8">NEWSLETTER</h4>
          <p className="text-secondary text-sm mb-6 leading-relaxed">
            Join the AURA movement. Receive exclusive access to new drops and private events.
          </p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full bg-transparent border-b border-white/20 pb-4 pr-10 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
            />
            <button className="absolute right-0 bottom-4 hover:text-luxury-gold transition-colors">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary tracking-widest">
        <p>© 2026 AURA L'ÉLITE. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">TERMS</a>
          <a href="#" className="hover:text-white">PRIVACY</a>
          <a href="#" className="hover:text-white">COOKIES</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
