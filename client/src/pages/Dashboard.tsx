import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Clock,
  ExternalLink,
  ShieldCheck,
  Star,
  Package,
  CheckCircle2,
  Plus,
  Trash2,
  Gift,
  ArrowRight,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { products } from '../data/mockData';
import ProductCard from '../components/product/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// --- Sub-components for Tabs ---

const OverviewTab = ({ orders, loading }: { orders: any[], loading: boolean }) => {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Acquisitions', value: orders.length.toString().padStart(2, '0'), icon: ShoppingBag, color: 'text-luxury-gold' },
    { label: 'Vaulted Items', value: wishlist.length.toString().padStart(2, '0'), icon: Heart, color: 'text-red-400' },
    { label: 'Status Tier', value: 'Platinum', icon: ShieldCheck, color: 'text-blue-400' },
    { label: 'Elite Points', value: (orders.length * 250).toLocaleString(), icon: Gift, color: 'text-emerald-400' },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'processing': return 'text-luxury-gold bg-luxury-gold/10 border-luxury-gold/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-12">
      <header className="mb-12">
        <h2 className="text-3xl font-serif italic mb-4">Welcome back, {user?.name?.split(' ')[0] || 'Valmont'}</h2>
        <p className="text-secondary text-xs uppercase tracking-[0.3em]">Member since February 2024 • ID: AE-99021</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-luxury-card border border-primary/5 p-8 glass group hover:border-luxury-gold/20 transition-all duration-500"
          >
            <div className={cn("w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", stat.color)}>
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-secondary mb-2">{stat.label}</p>
            <p className="text-2xl font-display font-bold tracking-widest">{stat.value}</p>
          </motion.div>
        ))}
      </div>      <div className="space-y-16">
        {/* . THE VAULT Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-xs uppercase tracking-[0.4em] font-black italic">. THE VAULT</h3>
            <Link to="/wishlist" className="text-[9px] uppercase tracking-widest text-luxury-gold hover:underline">Explore Entire Archive</Link>
          </div>
          
          {wishlist.length === 0 ? (
            <div className="p-16 border border-dashed border-primary/10 rounded-sm text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-secondary">The Vault is currently empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.slice(0, 4).map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => navigate(`/product/${product._id || product.id}`)} 
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] bg-luxury-card relative overflow-hidden mb-4 rounded-sm border border-primary/5">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[8px] uppercase tracking-[0.3em] font-black border border-primary/20 px-4 py-2 bg-black/60 backdrop-blur-md text-white">View Masterpiece</span>
                    </div>
                  </div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold truncate">{product.name}</h4>
                  <p className="text-[10px] text-luxury-gold mt-1">₹{product.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Order Tracking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-end">
              <h3 className="text-xs uppercase tracking-[0.4em] font-black">Order Fulfillment Tracking</h3>
              <Link to="/dashboard/orders" className="text-[9px] uppercase tracking-widest text-luxury-gold hover:underline">Full History</Link>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4 glass">
                <Loader2 size={24} className="animate-spin text-luxury-gold" />
                <p className="text-[8px] uppercase tracking-widest text-secondary">Synchronizing Dispatches...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-20 glass border border-primary/5 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-secondary leading-loose">Your acquisition history is currently empty.<br />Discover the latest collection to begin your journey.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.slice(0, 3).map((order) => (
                  <motion.div 
                    key={order._id}
                    className="bg-luxury-card border border-primary/5 p-8 rounded-sm hover:border-luxury-gold/20 transition-all group overflow-hidden relative"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-20 bg-luxury-bg border border-primary/5 rounded-sm overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                          <img src={order.orderItems[0]?.image} alt={order.orderItems[0]?.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-1">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-[10px] text-secondary tracking-widest uppercase mb-4">{format(new Date(order.createdAt), 'MMM dd, yyyy @ hh:mm a')}</p>
                          <span className={`text-[8px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end">
                        <div className="text-right">
                          <p className="text-[10px] font-black tracking-widest uppercase mb-1">{order.orderItems.length} Piece{order.orderItems.length > 1 ? 's' : ''}</p>
                          <p className="text-sm font-display text-luxury-gold">₹{order.totalPrice.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => navigate(order.paymentMethod === 'COD' ? `/cod-success/${order._id}` : `/order-success/${order._id}`)}
                          className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-secondary hover:text-primary transition-colors group/btn"
                        >
                          Track Details <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Progress Line */}
                    <div className="absolute bottom-0 left-0 h-0.5 bg-primary/5 w-full">
                      <div 
                        className="h-full bg-luxury-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] transition-all duration-1000" 
                        style={{ 
                          width: order.status === 'Delivered' ? '100%' : 
                                 order.status === 'Shipped' ? '75%' : 
                                 order.status === 'Processing' ? '40%' : '15%' 
                        }} 
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="bg-luxury-gold p-10 flex flex-col justify-between group cursor-pointer relative overflow-hidden rounded-sm h-[400px]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-black/10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                <Star size={24} className="text-black mb-12" fill="currentColor" />
                <h3 className="text-2xl font-serif italic text-black mb-4">Elite Early Access</h3>
                <p className="text-black/60 text-xs tracking-widest leading-loose uppercase font-bold mb-12 italic">The Winter Solstice Volume is now available for your tier.</p>
              </div>
              <button 
                onClick={() => navigate('/shop')}
                className="flex items-center gap-4 text-black text-[10px] font-black uppercase tracking-[0.4em] relative z-10 group-hover:gap-6 transition-all"
              >
                Explore Volume <ArrowRight size={14} />
              </button>
            </div>

            <div className="bg-primary/5 border border-primary/5 p-10 rounded-sm">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black mb-8 italic">. STATUS TIER</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center text-[10px] tracking-widest uppercase font-bold">
                  <span className="text-secondary">Current</span>
                  <span className="text-luxury-gold">Platinum Elite</span>
                </div>
                <div className="h-1 w-full bg-primary/5 rounded-full overflow-hidden">
                  <div className="h-full bg-luxury-gold w-[70%]" />
                </div>
                <p className="text-[8px] text-secondary tracking-widest uppercase italic leading-loose">Your next tier (Obsidian) will be unlocked after 3 more acquisitions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersTab = ({ orders, loading }: { orders: any[], loading: boolean }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'processing': return 'text-luxury-gold bg-luxury-gold/10 border-luxury-gold/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-12">
      <header className="mb-12 border-b border-primary/5 pb-8">
        <h2 className="text-2xl font-serif italic mb-4 uppercase tracking-widest">Order History</h2>
        <p className="text-secondary text-xs tracking-[0.2em] uppercase italic">A comprehensive archive of your style journey.</p>
      </header>
      
      {loading ? (
        <div className="py-32 text-center glass border border-primary/5 rounded-sm">
          <Loader2 size={32} className="animate-spin text-luxury-gold mx-auto mb-8" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-secondary">Synchronizing Archive...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-32 text-center glass border border-primary/5 rounded-sm">
          <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-8">
            <ShoppingBag size={24} className="text-secondary" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-secondary">Your collection is currently empty.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <motion.div 
              key={order._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-luxury-card border border-primary/5 rounded-sm overflow-hidden glass hover:border-luxury-gold/30 transition-all duration-500"
            >
              {/* Order Header */}
              <div className="p-8 border-b border-primary/5 flex flex-wrap justify-between items-center gap-6 bg-primary/[0.02]">
                <div className="flex gap-10">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-secondary mb-2 font-black">Order Reference</p>
                    <p className="text-[11px] font-bold tracking-widest uppercase">#{order._id.slice(-12).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-secondary mb-2 font-black">Acquired On</p>
                    <p className="text-[11px] font-bold tracking-widest uppercase">{format(new Date(order.createdAt), 'MMMM dd, yyyy @ hh:mm a')}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-secondary mb-2 font-black">Total Investment</p>
                    <p className="text-[11px] font-bold tracking-widest uppercase text-luxury-gold">₹{order.totalPrice.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`text-[9px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <Link to={order.paymentMethod === 'COD' ? `/cod-success/${order._id}` : `/order-success/${order._id}`} className="text-secondary hover:text-primary transition-colors"><ExternalLink size={16} /></Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-8 space-y-6">
                {order.orderItems.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-24 bg-luxury-bg border border-primary/5 rounded-sm overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1">{item.name}</h4>
                        <p className="text-[9px] text-secondary uppercase tracking-widest flex items-center gap-3">
                          Quantity: {item.qty} <span className="w-1 h-1 bg-primary/20 rounded-full" /> Price: ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {item.product ? (
                      <Link 
                        to={`/product/${item.product._id || item.product}`}
                        className="text-[9px] uppercase tracking-[0.4em] font-black text-secondary opacity-0 group-hover:opacity-100 transition-all hover:text-luxury-gold flex items-center gap-2"
                      >
                        View Piece <ArrowRight size={10} />
                      </Link>
                    ) : (
                      <span className="text-[9px] uppercase tracking-[0.4em] font-black text-secondary/40 flex items-center gap-2 cursor-not-allowed">
                        Product Unavailable
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Status Bar */}
              <div className="h-1 w-full bg-primary/5 relative">
                <div 
                  className="h-full bg-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-1000" 
                  style={{ 
                    width: order.status === 'Delivered' ? '100%' : 
                           order.status === 'Shipped' ? '75%' : 
                           order.status === 'Processing' ? '40%' : '15%' 
                  }} 
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const WishlistTab = () => {
  const { wishlist } = useWishlist();
  return (
    <div className="space-y-12">
      <header className="mb-12 border-b border-primary/5 pb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif italic mb-4 uppercase tracking-widest">The Vault</h2>
          <p className="text-secondary text-xs tracking-[0.2em] uppercase italic">Pieces reserved for your future presence.</p>
        </div>
        <span className="text-[10px] uppercase tracking-widest font-black text-luxury-gold">{wishlist.length} Items</span>
      </header>
      
      {wishlist.length === 0 ? (
        <div className="py-24 text-center glass border border-primary/5 rounded-sm">
          <Heart size={40} strokeWidth={1} className="text-primary/10 mx-auto mb-6" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-secondary">The Vault is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

const AddressesTab = () => (
  <div className="space-y-12">
    <header className="mb-12 border-b border-primary/5 pb-8">
      <h2 className="text-2xl font-serif italic mb-4 uppercase tracking-widest">Delivery Coordinates</h2>
      <p className="text-secondary text-xs tracking-[0.2em] uppercase italic">Manage your global logistics profile.</p>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-8 bg-luxury-card border-l-2 border-luxury-gold glass rounded-sm">
        <div className="flex justify-between items-start mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">Primary Residence</span>
          <MapPin size={16} className="text-secondary" />
        </div>
        <p className="text-[11px] font-bold tracking-widest uppercase mb-4">Valmont V.</p>
        <p className="text-xs text-secondary tracking-widest leading-relaxed mb-8">
          14 Avenue Montaigne<br />
          Paris, 75008<br />
          France
        </p>
        <div className="flex gap-4">
          <button className="text-[9px] uppercase tracking-widest font-black text-secondary hover:text-primary transition-colors">Edit</button>
          <button className="text-[9px] uppercase tracking-widest font-black text-red-500/50 hover:text-red-500 transition-colors">Remove</button>
        </div>
      </div>
      <button className="p-8 border border-dashed border-primary/20 hover:border-luxury-gold transition-colors flex flex-col items-center justify-center gap-4 group rounded-sm">
        <Plus size={24} className="text-secondary group-hover:text-luxury-gold transition-colors" />
        <span className="text-[10px] uppercase tracking-[0.3em] font-black">Add New Coordinate</span>
      </button>
    </div>
  </div>
);

const PaymentsTab = () => (
  <div className="space-y-12">
    <header className="mb-12 border-b border-primary/5 pb-8">
      <h2 className="text-2xl font-serif italic mb-4 uppercase tracking-widest">Financial Nexus</h2>
      <p className="text-secondary text-xs tracking-[0.2em] uppercase italic">Secure management of your acquisition methods.</p>
    </header>
    <div className="max-w-xl p-10 glass border border-primary/5 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden rounded-sm group">
      <div className="absolute top-0 right-0 p-8">
        <ShieldCheck size={24} className="text-luxury-gold opacity-30 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>
      <CreditCard size={32} strokeWidth={1} className="text-secondary mb-12" />
      <div className="space-y-4 mb-12">
        <p className="text-xl font-mono tracking-[0.3em]">•••• •••• •••• 9901</p>
        <div className="flex justify-between items-end">
          <p className="text-[10px] uppercase tracking-widest text-secondary">VALMONT V.</p>
          <p className="text-[10px] uppercase tracking-widest text-secondary">12 / 28</p>
        </div>
      </div>
      <button className="text-[9px] uppercase tracking-[0.4em] font-black text-luxury-gold hover:underline">Manage Security</button>
    </div>
  </div>
);

const NotificationsTab = () => (
  <div className="space-y-12">
    <header className="mb-12 border-b border-primary/5 pb-8">
      <h2 className="text-2xl font-serif italic mb-4 uppercase tracking-widest">Direct Dispatches</h2>
      <p className="text-secondary text-xs tracking-[0.2em] uppercase italic">Stay informed on limited drops and tier updates.</p>
    </header>
    <div className="space-y-4">
      {[1, 2].map((n) => (
        <div key={n} className="p-8 glass border-l-2 border-transparent hover:border-luxury-gold bg-primary/[0.02] flex justify-between items-center group transition-all rounded-sm">
          <div className="flex gap-6 items-center">
            <div className="w-2 h-2 bg-luxury-gold rounded-full gold-glow" />
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-1">Platinum Tier Anniversary Benefit</p>
              <p className="text-[10px] text-secondary tracking-widest uppercase italic">You have earned complimentary express shipping for life.</p>
            </div>
          </div>
          <button className="text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
        </div>
      ))}
    </div>
  </div>
);

const SettingsTab = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="space-y-12">
      <header className="mb-12 border-b border-primary/5 pb-8">
        <h2 className="text-2xl font-serif italic mb-4 uppercase tracking-widest">Interface Preferences</h2>
        <p className="text-secondary text-xs tracking-[0.2em] uppercase italic">Customize your digital sanctuary.</p>
      </header>
      <div className="space-y-8 max-w-2xl">
        <div className="flex justify-between items-center p-8 bg-luxury-card border border-primary/5 rounded-sm glass">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Display Theme</p>
            <p className="text-[10px] text-secondary tracking-widest uppercase italic">Current Environment: {theme === 'dark' ? 'MIDNIGHT OBSIDIAN' : 'LUXURY SILK'}</p>
          </div>
          <button 
            onClick={toggleTheme}
            className="px-6 py-3 border border-primary/10 text-[9px] uppercase tracking-widest font-black hover:bg-luxury-gold hover:text-black transition-all"
          >
            Toggle Atmosphere
          </button>
        </div>
        
        <div className="flex justify-between items-center p-8 bg-luxury-card border border-primary/5 rounded-sm glass">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Privacy Encryption</p>
            <p className="text-[10px] text-secondary tracking-widest uppercase italic">2FA Status: ACTIVATED</p>
          </div>
          <div className="flex items-center gap-4">
             <CheckCircle2 size={16} className="text-emerald-500" />
             <span className="text-[9px] uppercase tracking-widest font-black text-secondary">Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Routes>
      <Route index element={<OverviewTab orders={orders} loading={loading} />} />
      <Route path="orders" element={<OrdersTab orders={orders} loading={loading} />} />
      <Route path="addresses" element={<AddressesTab />} />
      <Route path="payments" element={<PaymentsTab />} />
      <Route path="notifications" element={<NotificationsTab />} />
      <Route path="settings" element={<SettingsTab />} />
    </Routes>
  );
};

export default Dashboard;
