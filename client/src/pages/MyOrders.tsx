import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Truck, CheckCircle2, Clock, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { format } from 'date-fns';
import { useCart } from '../context/CartContext';

const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleOrderAgain = (order: any) => {
    try {
      order.orderItems.forEach((item: any) => {
        const product = {
          _id: item.product,
          id: item.product,
          name: item.name,
          price: item.price,
          image: item.image,
          images: [item.image],
        };
        const size = item.size || item.selectedSize || 'M';
        const color = item.color || item.selectedColor || 'Gold';
        const quantity = item.qty || 1;

        addToCart(product as any, quantity, size, color);
      });
      navigate('/cart');
    } catch (err) {
      console.error("Failed to re-add order items", err);
      alert("Failed to add items to selection collection. Please try manual checkout.");
    }
  };

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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle2 size={18} className="text-green-500" />;
      case 'shipped': return <Truck size={18} className="text-blue-400" />;
      case 'processing': return <Package size={18} className="text-luxury-gold" />;
      default: return <Clock size={18} className="text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'processing': return 'text-luxury-gold bg-luxury-gold/10 border-luxury-gold/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-luxury-gold" size={40} />
        <p className="text-[10px] uppercase tracking-[0.4em] text-luxury-gold">Fetching your collection...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-luxury-black pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-display mb-4 tracking-[0.2em] uppercase">My Orders</h1>
          <p className="text-luxury-text-secondary tracking-widest text-sm uppercase">Track your exclusive AURA masterpieces.</p>
        </header>

        {orders.length === 0 ? (
          <div className="bg-luxury-card p-20 glass rounded-sm text-center space-y-8">
            <div className="w-20 h-20 bg-luxury-gold/5 rounded-full flex items-center justify-center mx-auto border border-luxury-gold/10">
              <ShoppingBag size={40} className="text-luxury-gold opacity-20" />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-display tracking-widest uppercase">Your collection is empty</h2>
              <p className="text-luxury-text-secondary text-xs uppercase tracking-widest leading-loose max-w-md mx-auto">
                Discover our latest curation of high-fashion and elevate your style with AURA L'ÉLITE.
              </p>
            </div>
            <Link 
              to="/shop" 
              className="inline-block bg-primary text-luxury-black px-12 py-5 rounded-sm text-[10px] uppercase tracking-[0.4em] font-black hover:bg-luxury-gold transition-all gold-glow"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, idx) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-luxury-card glass rounded-sm overflow-hidden hover:border-luxury-gold/20 transition-all duration-500 group"
              >
                <div className="p-8 md:p-10 flex flex-col lg:flex-row justify-between gap-10">
                  {/* Order Info */}
                  <div className="space-y-6 flex-1">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-[0.4em] px-3 py-1 rounded-full border flex items-center gap-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-12">
                      <div>
                        <p className="text-[10px] text-luxury-text-secondary uppercase tracking-[0.4em] mb-2 font-black">Date & Time Placed</p>
                        <p className="text-sm font-luxury tracking-widest uppercase">{format(new Date(order.createdAt), 'MMM dd, yyyy @ hh:mm a')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-luxury-text-secondary uppercase tracking-[0.4em] mb-2 font-black">Total Investment</p>
                        <p className="text-sm font-display text-luxury-gold tracking-widest">₹{order.totalPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-luxury-text-secondary uppercase tracking-[0.4em] mb-2 font-black">Payment Method</p>
                        <p className="text-sm font-luxury tracking-widest uppercase">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex -space-x-4">
                    {order.orderItems.map((item: any, i: number) => (
                      <div key={i} className="w-20 h-28 rounded-sm bg-luxury-dark border border-primary/5 overflow-hidden shadow-2xl relative group-hover:scale-105 transition-transform duration-500" style={{ zIndex: 10 - i }}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="w-20 h-28 rounded-sm bg-luxury-card border border-primary/5 flex items-center justify-center relative z-0">
                        <span className="text-xs font-bold">+{order.orderItems.length - 3}</span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex flex-col items-end gap-3 justify-center">
                    <Link 
                      to={order.paymentMethod === 'COD' ? `/cod-success/${order._id}` : `/order-success/${order._id}`}
                      className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] group/btn"
                    >
                      <span>Order Details</span>
                      <div className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center group-hover/btn:border-luxury-gold group-hover/btn:text-luxury-gold transition-all">
                        <ChevronRight size={16} />
                      </div>
                    </Link>
                    <button 
                      onClick={() => handleOrderAgain(order)}
                      className="flex items-center gap-3 bg-primary text-luxury-black px-5 py-2.5 rounded-sm text-[9px] uppercase tracking-[0.3em] font-black hover:bg-luxury-gold transition-colors gold-glow mt-1"
                    >
                      <ShoppingBag size={12} /> Order Again
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 w-full bg-primary/5 relative">
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
    </main>
  );
};

export default MyOrders;
