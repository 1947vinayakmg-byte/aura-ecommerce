import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Truck, Package, ChevronRight, Loader2, Clock, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { motion } from 'motion/react';
import { format } from 'date-fns';

const CodSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState<any>(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.3em] text-green-500 border-green-500/20 bg-green-500/5">
            <CheckCircle2 size={12} /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500 border-blue-500/20 bg-blue-500/5">
            <Truck size={12} /> Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 border-amber-500/20 bg-amber-500/5">
            <Clock size={12} /> Processing
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 border-red-500/20 bg-red-500/5">
            <Clock size={12} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.3em] text-secondary border-primary/10 bg-primary/5">
            <Clock size={12} /> Pending Approval
          </span>
        );
    }
  };

  useEffect(() => {
    if (order) return;
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id, order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-luxury-gold" size={40} />
        <p className="text-[10px] uppercase tracking-[0.4em] text-luxury-gold">Securing Acquisition...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center">
        <p className="text-sm uppercase tracking-widest text-secondary">Order not found.</p>
        <Link to="/shop" className="mt-8 text-[10px] uppercase tracking-[0.4em] text-luxury-gold border-b border-luxury-gold pb-1">Return to Shop</Link>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6 md:px-12 bg-luxury-black min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-luxury-card p-10 md:p-16 border border-primary/5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-luxury-gold" />
        
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-luxury-gold/20">
            <Truck size={40} className="text-luxury-gold animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display mb-4 tracking-[0.1em] text-primary">ACQUISITION SECURED</h1>
          <p className="text-secondary text-sm tracking-widest uppercase mb-6">
            Thank you for your request. Your Cash on Delivery order is logged and pending dispatch.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
             <span className="text-[10px] uppercase tracking-[0.4em] font-black text-secondary/60">Dispatch Status:</span>
             {getStatusBadge(order.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-b border-primary/10 py-10 mb-10">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] text-luxury-text-secondary uppercase tracking-[0.4em] mb-2 font-black">Order Reference</p>
              <p className="text-sm font-bold tracking-widest text-luxury-gold uppercase">#{order._id.slice(-8)}</p>
            </div>
            <div>
              <p className="text-[10px] text-luxury-text-secondary uppercase tracking-[0.4em] mb-2 font-black">Date Placed</p>
              <p className="text-sm tracking-widest uppercase">
                {format(new Date(order.createdAt), 'MMM dd, yyyy')} @ {format(new Date(order.createdAt), 'hh:mm a')}
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] text-luxury-text-secondary uppercase tracking-[0.4em] mb-2 font-black">Cash to Collect</p>
              <p className="text-sm font-bold tracking-widest text-primary">₹{order.totalPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-luxury-text-secondary uppercase tracking-[0.4em] mb-2 font-black">Delivery Coordinates</p>
              <p className="text-xs text-secondary leading-relaxed">
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xs uppercase tracking-[0.4em] font-black mb-6 border-b border-primary/10 pb-4">Reserved Items</h3>
          <div className="space-y-4">
            {order.orderItems.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-6 p-4 bg-primary/5 border border-primary/5">
                <div className="w-16 h-20 bg-luxury-dark border border-primary/10 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-display tracking-widest mb-1">{item.name}</p>
                  <p className="text-[10px] text-secondary uppercase tracking-widest">QTY: {item.qty}</p>
                </div>
                <div className="text-sm font-bold tracking-widest">₹{(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            to="/my-orders" 
            className="flex items-center justify-center gap-3 bg-primary/5 border border-primary/10 text-primary px-8 py-4 text-[10px] uppercase tracking-[0.4em] font-black hover:bg-primary/10 transition-colors"
          >
            <Package size={14} /> View All Orders
          </Link>
          <Link 
            to="/shop" 
            className="flex items-center justify-center gap-3 bg-primary text-luxury-black px-8 py-4 text-[10px] uppercase tracking-[0.4em] font-black hover:bg-luxury-gold transition-colors gold-glow"
          >
            Continue Shopping <ChevronRight size={14} />
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

export default CodSuccess;
