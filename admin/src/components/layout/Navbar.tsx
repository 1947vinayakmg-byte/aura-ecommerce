import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Bell, MessageSquare, Plus, ChevronDown, 
  X, AlertCircle, ShoppingBag, ArrowRight, ShieldAlert, Package, Check, Menu 
} from 'lucide-react';
import { getProducts } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItem {
  id: string;
  type: 'out_of_stock' | 'low_stock';
  title: string;
  message: string;
  time: string;
  productId: string;
}

interface MessageItem {
  id: string;
  type: 'new_order';
  customer: string;
  amount: number;
  time: string;
  orderId: string;
}

export function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const navigate = useNavigate();
  
  // Dropdown & Alert States
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [topAlert, setTopAlert] = useState<{ id: string; message: string; type: 'out' | 'low' } | null>(null);
  
  // Data States
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Refs for closing on outside click
  const notifRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);

  const fetchNavbarData = async () => {
    try {
      // 1. Fetch products to scan for out of stock or low stock alerts
      const productData = await getProducts('', 1);
      const allProducts = productData.products || [];
      
      const newNotifs: NotificationItem[] = [];
      let outOfStockAlertProduct = null;
      let lowStockAlertProduct = null;

      allProducts.forEach((p: any) => {
        if (p.countInStock === 0) {
          newNotifs.push({
            id: `out-${p._id}`,
            type: 'out_of_stock',
            title: 'Depleted Stock Alert',
            message: `The masterpiece "${p.name}" is completely out of stock.`,
            time: 'Just Now',
            productId: p._id
          });
          outOfStockAlertProduct = p;
        } else if (p.countInStock > 0 && p.countInStock <= 10) {
          newNotifs.push({
            id: `low-${p._id}`,
            type: 'low_stock',
            title: 'Low Inventory Alert',
            message: `"${p.name}" has only ${p.countInStock} units remaining.`,
            time: 'Just Now',
            productId: p._id
          });
          lowStockAlertProduct = p;
        }
      });

      const savedReadNotifs = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      setNotifications(newNotifs);
      setUnreadNotifications(newNotifs.filter(n => !savedReadNotifs.includes(n.id)).length);

      // Trigger top popup alert if any products are out of stock or low stock
      if (outOfStockAlertProduct) {
        setTopAlert({
          id: (outOfStockAlertProduct as any)._id,
          type: 'out',
          message: `CRITICAL STOCK ALERT: The masterpiece "${(outOfStockAlertProduct as any).name}" is fully depleted.`
        });
      } else if (lowStockAlertProduct) {
        setTopAlert({
          id: (lowStockAlertProduct as any)._id,
          type: 'low',
          message: `INVENTORY ALERT: "${(lowStockAlertProduct as any).name}" is down to ${(lowStockAlertProduct as any).countInStock} pieces.`
        });
      }

      // 2. Fetch orders to display new order messages
      const orderData = await orderService.getAllOrders();
      const recentOrders = orderData.slice(0, 5); // Take top 5
      
      const newMessages: MessageItem[] = recentOrders.map((o: any) => ({
        id: `msg-${o._id}`,
        type: 'new_order',
        customer: o.user?.name || 'Private Client',
        amount: o.totalPrice,
        time: formatDistanceToNow(new Date(o.createdAt), { addSuffix: true }),
        orderId: o._id
      }));

      const savedReadMsgs = JSON.parse(localStorage.getItem('readMessages') || '[]');
      setMessages(newMessages);
      setUnreadMessages(newMessages.filter(m => !savedReadMsgs.includes(m.id)).length);

    } catch (error) {
      console.error('Navbar live telemetry error:', error);
    }
  };

  useEffect(() => {
    fetchNavbarData();

    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchNavbarData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle outside click to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (msgRef.current && !msgRef.current.contains(event.target as Node)) {
        setShowMessages(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markItemAsRead = (key: 'readNotifications' | 'readMessages', id: string) => {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (!saved.includes(id)) {
      localStorage.setItem(key, JSON.stringify([...saved, id]));
    }
  };

  const handleNotificationClick = (productId: string, id: string) => {
    markItemAsRead('readNotifications', id);
    setUnreadNotifications(prev => Math.max(0, prev - 1));
    setShowNotifications(false);
    navigate(`/products/${productId}`);
  };

  const handleMessageClick = (orderId: string, id: string) => {
    markItemAsRead('readMessages', id);
    setUnreadMessages(prev => Math.max(0, prev - 1));
    setShowMessages(false);
    navigate(`/orders/${orderId}`);
  };

  const handleClearNotifications = () => {
    const savedReadNotifs = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    const newReadNotifs = Array.from(new Set([...savedReadNotifs, ...notifications.map(n => n.id)]));
    localStorage.setItem('readNotifications', JSON.stringify(newReadNotifs));
    setUnreadNotifications(0);
  };

  const handleClearMessages = () => {
    const savedReadMsgs = JSON.parse(localStorage.getItem('readMessages') || '[]');
    const newReadMsgs = Array.from(new Set([...savedReadMsgs, ...messages.map(m => m.id)]));
    localStorage.setItem('readMessages', JSON.stringify(newReadMsgs));
    setUnreadMessages(0);
  };

  return (
    <>
      {/* Top Floating Popup Stock Alert */}
      {topAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
          <div className={`glass-card border p-4 shadow-luxury flex items-center justify-between gap-4 bg-[#121212] ${
            topAlert.type === 'out' ? 'border-red-500/30 text-red-500' : 'border-amber-500/30 text-amber-500'
          }`}>
            <div className="flex items-center gap-3">
              <ShieldAlert className="shrink-0 animate-bounce" size={20} />
              <div className="text-xs text-white">
                <p className={`font-bold uppercase tracking-widest text-[9px] mb-0.5 ${
                  topAlert.type === 'out' ? 'text-red-500' : 'text-amber-500'
                }`}>
                  {topAlert.type === 'out' ? 'CRITICAL ASSET DEPLETED' : 'INVENTORY PRIVILEGE WARNING'}
                </p>
                <p className="font-luxury text-luxury-text-secondary leading-relaxed font-medium">
                  {topAlert.message}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => navigate(`/products/${topAlert.id}`)}
                className="px-3 py-1.5 bg-white/5 border border-luxury-border hover:border-luxury-gold/50 rounded-lg text-[9px] font-bold uppercase tracking-widest text-luxury-gold transition-all"
              >
                Inspect
              </button>
              <button 
                onClick={() => setTopAlert(null)}
                className="p-1.5 bg-white/5 border border-luxury-border rounded-lg text-luxury-text-secondary hover:text-white transition-all"
                title="Dismiss Warning"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <header className="h-20 glass-nav sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 gap-4">
        {/* Mobile menu trigger */}
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2.5 text-luxury-text-secondary hover:text-white hover:bg-white/[0.05] rounded-xl transition-all"
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary group-focus-within:text-luxury-gold transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search products, orders, customers..." 
              className="w-full bg-[#121212] text-white border border-luxury-border rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-luxury-gold/50 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/products/add')}
            className="hidden lg:flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-hover text-black px-4 py-2 rounded-xl font-luxury font-bold text-xs transition-all shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:-translate-y-0.5"
          >
            <Plus size={16} />
            QUICK ADD
          </button>

          <div className="flex items-center gap-2 px-4 border-r border-luxury-border relative">
            {/* Messages Dropdown */}
            <div className="relative" ref={msgRef}>
              <button 
                onClick={() => { setShowMessages(!showMessages); setShowNotifications(false); }}
                className="p-2 text-luxury-text-secondary hover:text-luxury-text-primary hover:bg-white/[0.05] rounded-lg transition-all relative"
              >
                <MessageSquare size={20} />
                {unreadMessages > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-luxury-gold rounded-full border-2 border-luxury-bg animate-pulse" />
                )}
              </button>

              {/* Messages Popover Menu */}
              {showMessages && (
                <div className="absolute right-0 mt-3 w-80 border border-luxury-border bg-[#121212] shadow-luxury rounded-2xl overflow-hidden py-1 z-50">
                  <div className="p-4 border-b border-luxury-border/50 flex justify-between items-center bg-white/[0.02]">
                    <h4 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
                      <ShoppingBag size={14} className="text-luxury-gold" /> ACQUISITION LOGS
                    </h4>
                    {unreadMessages > 0 && (
                      <button 
                        onClick={handleClearMessages}
                        className="text-[9px] font-bold text-luxury-gold hover:underline tracking-wider"
                      >
                        MARK ALL READ
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-luxury-border/30">
                    {messages.length === 0 ? (
                      <p className="p-6 text-center text-xs text-luxury-text-secondary italic">No active customer acquisitions</p>
                    ) : (
                      messages.map(msg => (
                        <div 
                          key={msg.id}
                          onClick={() => handleMessageClick(msg.orderId, msg.id)}
                          className="p-4 hover:bg-white/[0.02] cursor-pointer transition-all flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold font-bold text-xs shrink-0 mt-0.5">
                            {msg.customer.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate">Order Placed by {msg.customer}</p>
                            <p className="text-[10px] text-luxury-text-secondary leading-snug mt-1">
                              Acquisition sum: <span className="text-luxury-gold font-bold">₹{msg.amount.toLocaleString()}</span>
                            </p>
                            <p className="text-[9px] text-luxury-text-secondary mt-1">{msg.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-luxury-border/30 text-center bg-white/[0.01]">
                    <Link to="/orders" onClick={() => setShowMessages(false)} className="text-[10px] font-bold text-luxury-gold hover:underline tracking-widest uppercase">
                      View all acquisitions
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false); }}
                className="p-2 text-luxury-text-secondary hover:text-luxury-text-primary hover:bg-white/[0.05] rounded-lg transition-all relative"
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-luxury-gold rounded-full border-2 border-luxury-bg animate-pulse" />
                )}
              </button>

              {/* Notifications Popover Menu */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-85 border border-luxury-border bg-[#121212] shadow-luxury rounded-2xl overflow-hidden py-1 z-50">
                  <div className="p-4 border-b border-luxury-border/50 flex justify-between items-center bg-white/[0.02]">
                    <h4 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
                      <AlertCircle size={14} className="text-luxury-gold" /> SYSTEM NOTIFICATIONS
                    </h4>
                    {unreadNotifications > 0 && (
                      <button 
                        onClick={handleClearNotifications}
                        className="text-[9px] font-bold text-luxury-gold hover:underline tracking-wider"
                      >
                        MARK ALL READ
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-luxury-border/30">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center flex flex-col items-center gap-1 text-luxury-text-secondary">
                        <Check size={20} className="text-green-500" />
                        <p className="text-xs italic">All stock assets are securely replenished</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.productId, notif.id)}
                          className="p-4 hover:bg-white/[0.02] cursor-pointer transition-all flex items-start gap-3"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            notif.type === 'out_of_stock' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {notif.type === 'out_of_stock' ? <ShieldAlert size={14} /> : <Package size={14} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-bold ${
                              notif.type === 'out_of_stock' ? 'text-red-500' : 'text-amber-500'
                            }`}>{notif.title}</p>
                            <p className="text-[10px] text-luxury-text-secondary leading-snug mt-1">{notif.message}</p>
                            <p className="text-[9px] text-luxury-text-secondary mt-1">{notif.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-luxury-border/30 text-center bg-white/[0.01]">
                    <Link to="/inventory" onClick={() => setShowNotifications(false)} className="text-[10px] font-bold text-luxury-gold hover:underline tracking-widest uppercase">
                      Inspect Maison Inventory
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button className="flex items-center gap-3 pl-2 group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-luxury font-semibold text-luxury-text-primary">Alexander</p>
              <p className="text-[10px] text-luxury-text-secondary font-medium tracking-wider">PLATINUM MEMBER</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-luxury-border p-0.5 group-hover:border-luxury-gold transition-colors">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" 
                alt="Admin" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <ChevronDown size={14} className="text-luxury-text-secondary group-hover:text-luxury-gold transition-colors" />
          </button>
        </div>
      </header>
    </>
  );
}
