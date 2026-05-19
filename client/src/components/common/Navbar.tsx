import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import API from '../../services/api';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const { data } = await API.get(`/products?keyword=${searchQuery}&pageNumber=1`);
        setSuggestions(data.products?.slice(0, 4) || []);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Men', path: '/shop?category=Men' },
    { name: 'Women', path: '/shop?category=Women' },
    { name: 'Collections', path: '/#collections' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 left-0 w-full z-50 transition-all duration-500 py-5 px-4 sm:px-8 md:px-16 flex items-center justify-between border-b border-white/5',
          isScrolled
            ? 'glass py-4 backdrop-blur-3xl'
            : cn('bg-luxury-black', theme === 'light' && 'bg-white border-black/5')
        )}
      >
        <div className="flex-1 hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className="text-[11px] uppercase tracking-[0.25em] luxury-underline font-medium"
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="flex-1 lg:flex-none flex justify-start lg:justify-center">
          <Link to="/" className="text-2xl md:text-3xl font-serif font-bold tracking-[0.4em] text-luxury-gold uppercase translate-x-[-10%] md:translate-x-0">
            AURA
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-end gap-4 sm:gap-6 md:gap-10">
          <button
            onClick={toggleTheme}
            className="hover:text-luxury-gold transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
          </button>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hover:text-luxury-gold transition-colors"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
          <Link to="/wishlist" className="hover:text-luxury-gold transition-colors hidden md:block">
            <Heart size={20} strokeWidth={1.5} />
          </Link>
          <Link to="/cart" className="relative hover:text-luxury-gold transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-luxury-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <Link to={isAuthenticated ? "/dashboard" : "/login"} className="hover:text-luxury-gold transition-colors hidden md:block">
            <User size={20} strokeWidth={1.5} />
          </Link>
          <button
            className="lg:hidden hover:text-luxury-gold transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Full Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-luxury-black flex flex-col items-center justify-center p-6 md:p-24 backdrop-blur-3xl"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-12 right-12 text-secondary hover:text-white transition-colors"
            >
              <X size={32} strokeWidth={1} />
            </button>

            <div className="w-full max-w-4xl">
              <span className="text-luxury-gold text-xs tracking-[0.6em] uppercase font-black mb-8 block text-center">Global Archive Search</span>
              <form onSubmit={handleSearch} className="relative group">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="SEARCH THE VOLUME..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-10 text-3xl md:text-6xl font-display uppercase tracking-widest focus:outline-none focus:border-luxury-gold transition-all placeholder:text-white/5"
                />
                <button 
                  type="submit"
                  className="absolute right-0 bottom-10 p-4 text-luxury-gold hover:translate-x-4 transition-transform duration-500"
                >
                  <ArrowRight size={40} strokeWidth={1} />
                </button>
              </form>
              
              {/* Live Suggestions */}
              {searchQuery.trim() && (
                <div className="mt-12 flex flex-col gap-4 w-full">
                  {isSearching ? (
                    <div className="text-center text-luxury-gold text-[10px] tracking-[0.4em] uppercase animate-pulse py-12">
                      Searching Archives...
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full animate-in fade-in duration-500">
                      {suggestions.map((product) => (
                        <div 
                          key={product._id} 
                          onClick={() => {
                            navigate(`/product/${product._id}`);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex flex-col gap-4 group cursor-pointer"
                        >
                          <div className="aspect-[3/4] overflow-hidden bg-white/5 relative">
                            <img 
                              src={product.images?.[0]?.url || product.images?.[0] || '/placeholder.jpg'} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                            />
                          </div>
                          <div>
                            <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white group-hover:text-luxury-gold transition-colors truncate">
                              {product.name}
                            </h4>
                            <p className="text-[10px] text-secondary mt-1 tracking-widest">₹{product.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-secondary text-[10px] tracking-[0.4em] uppercase py-12">
                      No matching pieces found
                    </div>
                  )}
                </div>
              )}

              {/* Default Tags when no query */}
              {!searchQuery.trim() && (
                <div className="mt-16 flex flex-wrap gap-8 justify-center opacity-40">
                  {['Outerwear', 'Footwear', 'Limited Series', 'Accessories'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => {
                        setSearchQuery(tag);
                        navigate(`/shop?keyword=${tag}`);
                        setIsSearchOpen(false);
                      }}
                      className="text-[10px] uppercase tracking-widest hover:text-luxury-gold transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-luxury-black z-[60] flex flex-col p-12"
          >
            <div className="flex justify-end">
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={32} strokeWidth={1} />
              </button>
            </div>
            <div className="flex flex-col gap-8 mt-12">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-display uppercase tracking-widest hover:text-luxury-gold"
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="h-[1px] bg-white/10 my-4" />
              <div className="flex gap-8">
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                  <Heart size={24} />
                </Link>
                <Link to={isAuthenticated ? "/dashboard" : "/login"} onClick={() => setMobileMenuOpen(false)}>
                  <User size={24} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
