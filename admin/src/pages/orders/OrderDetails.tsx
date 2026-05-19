import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  CreditCard, 
  User, 
  MapPin, 
  Calendar,
  ExternalLink,
  Printer,
  Download,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { format } from 'date-fns';
import { cn } from '../../utils/utils';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await orderService.getOrder(id);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    if (!id) return;
    try {
      setStatusLoading(true);
      await orderService.updateOrderStatus(id, newStatus);
      setOrder((prev: any) => ({ ...prev, status: newStatus }));
      if (newStatus === 'Delivered') {
        setOrder((prev: any) => ({ ...prev, isDelivered: true, deliveredAt: new Date() }));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="glass-card p-12 text-center space-y-4">
        <AlertCircle className="mx-auto text-luxury-gold" size={48} />
        <h2 className="text-2xl font-display font-bold">Order Not Found</h2>
        <p className="text-luxury-text-secondary">The order you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate('/orders')}
          className="luxury-button-primary inline-flex items-center gap-2"
        >
          <ChevronLeft size={18} /> BACK TO ORDERS
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-400 bg-green-400/10';
      case 'processing': return 'text-blue-400 bg-blue-400/10';
      case 'shipped': return 'text-purple-400 bg-purple-400/10';
      case 'pending': return 'text-amber-400 bg-amber-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-luxury-text-secondary bg-white/5';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <button 
            onClick={() => navigate('/orders')}
            className="text-luxury-gold flex items-center gap-2 text-sm font-bold tracking-widest hover:translate-x-[-4px] transition-transform"
          >
            <ChevronLeft size={16} /> BACK TO LIST
          </button>
          <div className="flex items-center gap-4 mt-2">
            <h1 className="text-3xl font-display font-bold">Order #{order._id?.slice(-8).toUpperCase()}</h1>
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
              getStatusColor(order.status)
            )}>
              {order.status}
            </span>
          </div>
          <p className="text-luxury-text-secondary text-sm flex items-center gap-2">
            <Calendar size={14} /> Placed on {order.createdAt ? format(new Date(order.createdAt), 'PPP') : 'N/A'} at {order.createdAt ? format(new Date(order.createdAt), 'p') : 'N/A'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 glass-card bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-luxury-text-secondary hover:text-white transition-all">
            <Printer size={20} />
          </button>
          <button className="p-2.5 glass-card bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-luxury-text-secondary hover:text-white transition-all">
            <Download size={20} />
          </button>
          <button 
            disabled={statusLoading || order.status === 'Delivered'}
            onClick={() => updateStatus('Shipped')}
            className="luxury-button-primary flex items-center gap-2 text-xs disabled:opacity-50"
          >
            <Truck size={16} /> {order.status === 'Shipped' ? 'ALREADY SHIPPED' : 'SHIP ORDER'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-luxury-border flex items-center justify-between bg-white/[0.01]">
              <h3 className="font-display font-bold flex items-center gap-2">
                <Package size={18} className="text-luxury-gold" /> ORDER ITEMS
              </h3>
              <span className="text-xs text-luxury-text-secondary">{order.orderItems?.length || 0} Items</span>
            </div>
            <div className="divide-y divide-luxury-border">
              {order.orderItems?.map((item: any, idx: number) => (
                <div key={idx} className="p-6 flex gap-4 hover:bg-white/[0.01] transition-colors">
                  <div className="w-20 h-24 rounded-lg bg-luxury-bg border border-luxury-border overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white group-hover:text-luxury-gold transition-colors">{item.name}</h4>
                      <p className="text-xs text-luxury-text-secondary">ID: {item.product?.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-luxury-gold font-medium mt-2">₹{item.price?.toLocaleString()} × {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-lg">₹{((item.price || 0) * (item.qty || 0)).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-white/[0.02] space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-luxury-text-secondary">Subtotal</span>
                <span className="text-white">₹{(order.totalPrice * 0.9).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-luxury-text-secondary">Shipping</span>
                <span className="text-white">₹{(order.shippingPrice || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-luxury-text-secondary">Taxes</span>
                <span className="text-white">₹{(order.taxPrice || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-luxury-border">
                <span className="font-display font-bold text-luxury-gold">TOTAL</span>
                <span className="font-display font-bold text-xl text-luxury-gold">₹{order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="font-display font-bold flex items-center gap-2">
              <Truck size={18} className="text-luxury-gold" /> SHIPPING TIMELINE
            </h3>
            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-luxury-border">
              <div className="relative pl-8 space-y-1">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-luxury-gold border-4 border-luxury-bg shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                <p className="text-sm font-bold text-white">Order Received</p>
                <p className="text-xs text-luxury-text-secondary">{order.createdAt ? format(new Date(order.createdAt), 'PPP p') : 'N/A'}</p>
              </div>
              <div className="relative pl-8 space-y-1 opacity-50">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-luxury-border border-4 border-luxury-bg" />
                <p className="text-sm font-bold">Processing & Packaging</p>
                <p className="text-xs text-luxury-text-secondary">Pending completion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold flex items-center gap-2">
                <User size={18} className="text-luxury-gold" /> CUSTOMER
              </h3>
              <button className="text-luxury-gold hover:underline text-[10px] font-bold tracking-widest uppercase">
                View Profile
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold font-display font-bold text-lg">
                {(order.user?.name || 'G').charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white">{order.user?.name || 'Guest User'}</p>
                <p className="text-xs text-luxury-text-secondary">{order.user?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-luxury-border space-y-3">
              <p className="text-[10px] font-bold text-luxury-gold tracking-widest uppercase">Purchase History</p>
              <div className="flex justify-between text-xs">
                <span className="text-luxury-text-secondary">Total Orders</span>
                <span className="text-white font-bold">1</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-luxury-text-secondary">Lifetime Value</span>
                <span className="text-white font-bold">₹{order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Manage Order Lifecycle */}
          <div className="glass-card p-6 space-y-4 border-luxury-gold/20 bg-luxury-gold/5">
            <h3 className="font-display font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-luxury-gold" /> MANAGE ORDER
            </h3>
            <div className="space-y-3">
              <p className="text-[10px] text-luxury-text-secondary font-bold uppercase tracking-widest">Update Lifecycle State</p>
              <div className="grid grid-cols-1 gap-2">
                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    disabled={statusLoading || order.status === status}
                    onClick={() => updateStatus(status)}
                    className={cn(
                      "w-full py-2.5 px-4 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-between",
                      order.status === status 
                        ? "bg-luxury-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                        : "bg-white/5 text-luxury-text-secondary hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {status}
                    {order.status === status && <CheckCircle size={14} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-display font-bold flex items-center gap-2">
              <CreditCard size={18} className="text-luxury-gold" /> PAYMENT
            </h3>
            <div className="p-3 bg-white/[0.02] border border-luxury-border rounded-xl flex items-center gap-3">
              <div className="w-10 h-6 bg-luxury-gold/10 rounded flex items-center justify-center">
                <span className="text-[8px] font-bold text-luxury-gold">{order.paymentMethod?.toUpperCase() || 'PAYMENT'}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">ID: {order.paymentResult?.id?.slice(-8) || 'N/A'}</p>
                <p className="text-[10px] text-luxury-text-secondary uppercase">{order.paymentResult?.status || 'Pending'}</p>
              </div>
              <span className={cn(
                "ml-auto px-2 py-0.5 rounded text-[8px] font-bold uppercase",
                order.isPaid ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                {order.isPaid ? 'PAID' : 'UNPAID'}
              </span>
            </div>
          </div>

          {/* Shipping Card */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-display font-bold flex items-center gap-2">
              <MapPin size={18} className="text-luxury-gold" /> SHIPPING ADDRESS
            </h3>
            <div className="space-y-1 text-sm text-luxury-text-secondary">
              <p className="text-white font-bold">{order.user?.name || 'Customer'}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
            <button className="w-full luxury-input mt-2 text-xs flex items-center justify-center gap-2 hover:bg-white/[0.05]">
              <ExternalLink size={14} /> VIEW ON MAP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

