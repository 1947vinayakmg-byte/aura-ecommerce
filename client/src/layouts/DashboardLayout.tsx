import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  Menu, 
  User,
  Bell,
  Search,
  ChevronDown,
  Shield,
  X
} from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { orderService } from '../services/orderService';
import { useWishlist } from '../context/WishlistContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { wishlist } = useWishlist();
  const [hasOrders, setHasOrders] = useState(false);

  const filteredWishlist = wishlist.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const checkOrders = async () => {
      try {
        const orders = await orderService.getMyOrders();
        setHasOrders(orders.length > 0);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    if (user) checkOrders();
  }, [user]);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'orders', label: 'Acquisitions', icon: ShoppingBag, path: '/dashboard/orders' },
    { id: 'wishlist', label: 'The Vault', icon: Heart, path: '/wishlist' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  };

  // Close profile and search dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeItem = sidebarItems.find(item => item.path === location.pathname) || sidebarItems[0];

  return (
    <div className="min-h-screen bg-luxury-black flex">
      {/* Sidebar for Desktop */}
      <DashboardSidebar 
        items={sidebarItems} 
        activeTab={activeItem.id} 
        onTabChange={(id) => {
          const item = sidebarItems.find(i => i.id === id);
          if (item) navigate(item.path);
        }}
        onLogout={handleLogout}
        className="hidden lg:flex"
      />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-luxury-black/80 backdrop-blur-md z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-[110] lg:hidden"
            >
              <DashboardSidebar 
                items={sidebarItems} 
                activeTab={activeItem.id} 
                onTabChange={(id) => {
                  const item = sidebarItems.find(i => i.id === id);
                  if (item) navigate(item.path);
                }}
                onLogout={handleLogout}
                onClose={() => setIsSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dashboard Header */}
        <header className="h-24 border-b border-primary/5 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-luxury-black/90 backdrop-blur-2xl z-50">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center text-secondary hover:text-luxury-gold hover:border-luxury-gold/30 transition-all"
            >
              <Menu size={20} />
            </button>
            
            {/* Functional Search Bar */}
            <div className="relative" ref={searchRef}>
              <form 
                onSubmit={handleSearch}
                className={cn(
                  "hidden md:flex items-center gap-4 py-3 px-6 rounded-full border transition-all duration-500",
                  isSearchFocused || searchQuery.trim() 
                    ? "bg-primary/10 border-luxury-gold/30 w-96 shadow-[0_0_30px_rgba(212,175,55,0.1)]" 
                    : "bg-primary/5 border-transparent w-64"
                )}
              >
                <Search size={16} className={cn("transition-colors", isSearchFocused ? "text-luxury-gold" : "text-secondary")} />
                <input 
                  type="text"
                  placeholder="SEARCH ARCHIVE & VAULT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="bg-transparent text-[10px] uppercase tracking-[0.2em] outline-none w-full placeholder:text-secondary/50 text-primary"
                />
                {searchQuery.trim() && (
                  <button type="button" onClick={() => setSearchQuery('')} className="text-secondary hover:text-primary">
                    <X size={14} />
                  </button>
                )}
              </form>

              {/* Live Search Results Dropdown */}
              <AnimatePresence>
                {(isSearchFocused || searchQuery.trim().length > 0) && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-4 w-96 bg-luxury-card glass border border-primary/10 rounded-sm shadow-[0_30px_60px_rgba(0,0,0,0.7)] p-6 z-50 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-luxury-gold" />
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {/* Vault Matches */}
                      <div>
                        <div className="flex items-center justify-between mb-4 border-b border-primary/10 pb-2">
                          <span className="text-[9px] uppercase tracking-[0.3em] font-black text-luxury-gold flex items-center gap-2">
                            <Heart size={10} fill="currentColor" /> The Vault Matches
                          </span>
                          <span className="text-[9px] text-secondary tracking-widest">{filteredWishlist.length} Found</span>
                        </div>
                        {filteredWishlist.length === 0 ? (
                          <p className="text-[10px] text-secondary italic tracking-widest py-2">No matching pieces in your Vault.</p>
                        ) : (
                          <div className="space-y-3">
                            {filteredWishlist.map((item) => (
                              <Link
                                key={item._id || item.id}
                                to={`/product/${item._id || item.id}`}
                                onClick={() => { setSearchQuery(''); setIsSearchFocused(false); }}
                                className="flex items-center gap-4 p-2 hover:bg-primary/5 rounded transition-colors group"
                              >
                                <div className="w-12 h-16 bg-luxury-bg border border-primary/5 overflow-hidden flex-shrink-0 rounded-sm">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary group-hover:text-luxury-gold transition-colors truncate">{item.name}</h4>
                                  <p className="text-[9px] text-secondary uppercase tracking-widest mt-1">{item.category} • ₹{item.price?.toLocaleString()}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Search All Prompt */}
                      <button
                        onClick={() => handleSearch()}
                        className="w-full py-3 bg-primary/5 hover:bg-luxury-gold hover:text-black text-primary text-[9px] uppercase tracking-[0.4em] font-black transition-all rounded-sm border border-primary/10 flex items-center justify-center gap-2 group"
                      >
                        <Search size={12} className="group-hover:scale-110 transition-transform" /> Search Entire Catalog
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <button className="relative w-12 h-12 rounded-full bg-primary/5 border border-primary/5 flex items-center justify-center text-secondary hover:text-primary hover:border-primary/20 transition-all">
              <Bell size={18} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-luxury-gold rounded-full gold-glow" />
            </button>
            
            <div className="h-8 w-[1px] bg-primary/10 hidden md:block" />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={cn(
                  "flex items-center gap-4 py-2 px-2 md:px-4 rounded-full transition-all duration-500",
                  isProfileOpen ? "bg-primary/10 shadow-2xl" : "hover:bg-primary/5"
                )}
              >
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">{user?.name || 'Valmont V.'}</p>
                  <p className="text-[9px] text-luxury-gold uppercase tracking-[0.2em] font-bold">Platinum</p>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-primary/10 p-1 group-hover:border-luxury-gold/50 transition-all overflow-hidden bg-luxury-dark">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-luxury-gold/20 to-transparent flex items-center justify-center">
                    <User size={20} className="text-luxury-gold" />
                  </div>
                </div>
                <ChevronDown 
                  size={14} 
                  className={cn("text-secondary transition-transform duration-500", isProfileOpen && "rotate-180")} 
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="absolute right-0 mt-6 w-72 bg-luxury-card glass border border-primary/10 rounded-sm shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-6 overflow-hidden z-50"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-luxury-gold" />
                    
                    <div className="space-y-2 mb-8 border-b border-primary/5 pb-6">
                      <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-black text-luxury-gold mb-2">
                        <Shield size={12} />
                        <span>Security Cleared</span>
                      </div>
                      <p className="text-[11px] font-bold tracking-widest uppercase">{user?.email}</p>
                    </div>

                    <div className="space-y-2">
                      <Link to="/wishlist" onClick={() => setIsProfileOpen(false)} className="w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-colors flex items-center gap-3 rounded-sm group">
                        <Heart size={14} className="text-secondary group-hover:text-red-400 transition-colors" />
                        <span>The Vault</span>
                      </Link>

                      {hasOrders && (
                       <Link to="/dashboard/orders" onClick={() => setIsProfileOpen(false)} className="w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-colors flex items-center gap-3 rounded-sm group">
                          <ShoppingBag size={14} className="text-secondary group-hover:text-luxury-gold transition-colors" />
                          <span>My Orders</span>
                        </Link>
                      )}

                      <Link to="/dashboard/settings" onClick={() => setIsProfileOpen(false)} className="w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-colors flex items-center gap-3 rounded-sm group">
                        <Settings size={14} className="text-secondary group-hover:text-primary transition-colors" />
                        <span>Account Nexus</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors flex items-center gap-3 rounded-sm group"
                      >
                        <LogOut size={14} className="group-hover:text-red-500 transition-colors" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
