import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package, Truck, CheckCircle2, Clock, Search,
  AlertCircle, CreditCard, Banknote, TrendingUp,
  ArrowRight, RefreshCw, IndianRupee, ShoppingBag
} from 'lucide-react';
import { cn } from '../../utils/utils';
import { orderService } from '../../services/orderService';
import Loader from '../../components/common/Loader';
import { format } from 'date-fns';

type PaymentTab = 'online' | 'cod';

const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  pending:    { label: 'Pending',    color: 'text-amber-400 bg-amber-400/10 border-amber-400/25',   dot: 'bg-amber-400'   },
  processing: { label: 'Processing', color: 'text-blue-400 bg-blue-400/10 border-blue-400/25',      dot: 'bg-blue-400'    },
  shipped:    { label: 'Shipped',    color: 'text-purple-400 bg-purple-400/10 border-purple-400/25', dot: 'bg-purple-400'  },
  delivered:  { label: 'Delivered',  color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25', dot: 'bg-emerald-400' },
  cancelled:  { label: 'Cancelled',  color: 'text-red-400 bg-red-400/10 border-red-400/25',         dot: 'bg-red-400'     },
};

function StatusBadge({ status }: { status: string }) {
  const key = status?.toLowerCase() || 'pending';
  const meta = STATUS_META[key] || STATUS_META['pending'];
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border',
      meta.color
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className={cn(
      'p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all',
      color
    )}>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-75 mb-1">{label}</p>
        <p className="text-2xl font-display font-bold">{value}</p>
        {sub && <p className="text-[10px] opacity-60 mt-0.5">{sub}</p>}
      </div>
      <Icon size={28} className="opacity-70 shrink-0" />
    </div>
  );
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<PaymentTab>('online');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // ── Tab Segmentation ──────────────────────────────────────────────────────
  // "COD" = paymentMethod includes 'cod' (case-insensitive)
  // "Online" = everything else (Razorpay, card, UPI, etc.)
  const isCOD = (order: any) =>
    order.paymentMethod?.toLowerCase().includes('cod') ||
    order.paymentMethod?.toLowerCase().includes('cash');

  const onlineOrders = orders.filter(o => !isCOD(o));
  const codOrders    = orders.filter(o => isCOD(o));

  const tabOrders = activeTab === 'online' ? onlineOrders : codOrders;

  // ── Filters ───────────────────────────────────────────────────────────────
  const filteredOrders = tabOrders.filter(order => {
    const matchSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchStatus =
      statusFilter === 'all' || order.status?.toLowerCase() === statusFilter;

    return matchSearch && matchStatus;
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const buildStats = (list: any[]) => ({
    total:     list.length,
    pending:   list.filter(o => o.status?.toLowerCase() === 'pending').length,
    shipped:   list.filter(o => o.status?.toLowerCase() === 'shipped').length,
    delivered: list.filter(o => o.status?.toLowerCase() === 'delivered').length,
    revenue:   list.reduce((acc, o) => acc + (o.totalPrice || 0), 0),
  });

  const onlineStats = buildStats(onlineOrders);
  const codStats    = buildStats(codOrders);
  const currentStats = activeTab === 'online' ? onlineStats : codStats;

  // ── Update Status ─────────────────────────────────────────────────────────
  const updateStatus = async (e: React.MouseEvent, orderId: string, newStatus: string) => {
    e.stopPropagation();
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) return <div className="py-20"><Loader /></div>;

  return (
    <div className="space-y-8">

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Order Management</h1>
          <p className="text-luxury-text-secondary mt-1 text-sm">
            Track and manage exclusive client acquisitions.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest">Total Revenue</p>
            <p className="text-2xl font-display font-bold text-luxury-gold">
              ₹{orders.reduce((a, o) => a + (o.totalPrice || 0), 0).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="p-2.5 glass-card bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-luxury-text-secondary hover:text-white transition-all"
            title="Refresh orders"
          >
            <RefreshCw size={18} className={cn(refreshing && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* ── Payment Type Tabs ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Online Payment Tab */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => { setActiveTab('online'); setStatusFilter('all'); setSearchTerm(''); }}
          className={cn(
            'relative p-6 rounded-2xl border text-left transition-all duration-300 overflow-hidden',
            activeTab === 'online'
              ? 'border-luxury-gold/40 bg-luxury-gold/5 shadow-[0_0_30px_rgba(212,175,55,0.1)]'
              : 'border-luxury-border bg-white/[0.02] hover:border-luxury-gold/20'
          )}
        >
          {activeTab === 'online' && (
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />
          )}
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
              activeTab === 'online' ? 'bg-luxury-gold text-black' : 'bg-white/5 text-luxury-text-secondary'
            )}>
              <CreditCard size={22} />
            </div>
            <span className={cn(
              'text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border',
              activeTab === 'online' ? 'text-luxury-gold border-luxury-gold/30 bg-luxury-gold/10' : 'text-luxury-text-secondary border-luxury-border'
            )}>
              {onlineOrders.length} orders
            </span>
          </div>
          <h3 className={cn(
            'text-lg font-display font-bold mb-1 transition-colors',
            activeTab === 'online' ? 'text-luxury-gold' : 'text-white'
          )}>
            Online Payments
          </h3>
          <p className="text-xs text-luxury-text-secondary mb-4">
            Razorpay · UPI · Card · Netbanking
          </p>
          <div className="flex items-center gap-6 pt-4 border-t border-luxury-border/50">
            <div>
              <p className="text-[10px] text-luxury-text-secondary uppercase tracking-wider">Revenue</p>
              <p className="text-sm font-bold text-white">₹{onlineStats.revenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-luxury-text-secondary uppercase tracking-wider">Pending</p>
              <p className="text-sm font-bold text-amber-400">{onlineStats.pending}</p>
            </div>
            <div>
              <p className="text-[10px] text-luxury-text-secondary uppercase tracking-wider">Delivered</p>
              <p className="text-sm font-bold text-emerald-400">{onlineStats.delivered}</p>
            </div>
          </div>
        </motion.button>

        {/* COD Tab */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => { setActiveTab('cod'); setStatusFilter('all'); setSearchTerm(''); }}
          className={cn(
            'relative p-6 rounded-2xl border text-left transition-all duration-300 overflow-hidden',
            activeTab === 'cod'
              ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.08)]'
              : 'border-luxury-border bg-white/[0.02] hover:border-emerald-500/20'
          )}
        >
          {activeTab === 'cod' && (
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          )}
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
              activeTab === 'cod' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-luxury-text-secondary'
            )}>
              <Banknote size={22} />
            </div>
            <span className={cn(
              'text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border',
              activeTab === 'cod' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-luxury-text-secondary border-luxury-border'
            )}>
              {codOrders.length} orders
            </span>
          </div>
          <h3 className={cn(
            'text-lg font-display font-bold mb-1 transition-colors',
            activeTab === 'cod' ? 'text-emerald-400' : 'text-white'
          )}>
            Cash on Delivery
          </h3>
          <p className="text-xs text-luxury-text-secondary mb-4">
            Payment collected upon delivery
          </p>
          <div className="flex items-center gap-6 pt-4 border-t border-luxury-border/50">
            <div>
              <p className="text-[10px] text-luxury-text-secondary uppercase tracking-wider">Value</p>
              <p className="text-sm font-bold text-white">₹{codStats.revenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-luxury-text-secondary uppercase tracking-wider">Pending</p>
              <p className="text-sm font-bold text-amber-400">{codStats.pending}</p>
            </div>
            <div>
              <p className="text-[10px] text-luxury-text-secondary uppercase tracking-wider">Delivered</p>
              <p className="text-sm font-bold text-emerald-400">{codStats.delivered}</p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* ── Quick Stats for active tab ───────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value={currentStats.total}
            color={activeTab === 'online'
              ? 'text-luxury-gold bg-luxury-gold/5 border-luxury-gold/20'
              : 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20'}
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={currentStats.pending}
            color="text-amber-400 bg-amber-400/5 border-amber-400/20"
          />
          <StatCard
            icon={Truck}
            label="Shipped"
            value={currentStats.shipped}
            color="text-purple-400 bg-purple-400/5 border-purple-400/20"
          />
          <StatCard
            icon={CheckCircle2}
            label="Delivered"
            value={currentStats.delivered}
            color="text-emerald-400 bg-emerald-400/5 border-emerald-400/20"
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Table Card ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + '-table'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="glass-card"
        >
          {/* Toolbar */}
          <div className="p-6 border-b border-luxury-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-text-secondary" size={15} />
                <input
                  type="text"
                  placeholder="Search ID, name or email…"
                  className="w-full bg-white/[0.03] border border-luxury-border rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-luxury-gold/50 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      'px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all border',
                      statusFilter === s
                        ? 'bg-luxury-gold text-black border-luxury-gold'
                        : 'bg-white/[0.03] text-luxury-text-secondary border-luxury-border hover:border-luxury-gold/30 hover:text-white'
                    )}
                  >
                    {s === 'all' ? 'All' : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab indicator badge */}
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold tracking-wider shrink-0',
              activeTab === 'online'
                ? 'border-luxury-gold/30 bg-luxury-gold/10 text-luxury-gold'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            )}>
              {activeTab === 'online' ? <CreditCard size={13} /> : <Banknote size={13} />}
              {activeTab === 'online' ? 'Online Payments' : 'Cash on Delivery'}
              <span className="ml-1 opacity-60">· {filteredOrders.length}</span>
            </div>
          </div>

          {/* Table */}
          {filteredOrders.length === 0 ? (
            <div className="py-24 flex flex-col items-center text-luxury-text-secondary gap-3">
              <AlertCircle size={40} className="opacity-20" />
              <p className="text-sm font-medium">No orders found.</p>
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-xs text-luxury-gold hover:underline">
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-luxury-border bg-white/[0.01]">
                    <th className="px-6 py-4 text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase">Order</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase">Client</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase">Items</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase">Payment</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase">Quick Update</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, idx) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="border-b border-luxury-border/40 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    >
                      {/* Order ID + Date */}
                      <td className="px-6 py-4">
                        <p className="font-luxury font-bold text-sm text-white group-hover:text-luxury-gold transition-colors">
                          #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-luxury-text-secondary mt-0.5">
                          {format(new Date(order.createdAt), 'dd MMM yyyy')}
                        </p>
                      </td>

                      {/* Client */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold text-[10px] font-bold shrink-0">
                            {(order.user?.name || 'G').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{order.user?.name || 'Guest'}</p>
                            <p className="text-[10px] text-luxury-text-secondary">{order.user?.email || '—'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-6 py-4">
                        <p className="text-xs text-luxury-text-secondary max-w-[140px] truncate">
                          {order.orderItems[0]?.name}
                        </p>
                        {order.orderItems.length > 1 && (
                          <p className="text-[10px] text-luxury-gold">+{order.orderItems.length - 1} more</p>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        <p className="font-display font-bold text-sm text-white">
                          ₹{order.totalPrice?.toLocaleString()}
                        </p>
                      </td>

                      {/* Payment Status */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={cn(
                            'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border',
                            isCOD(order)
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                              : 'text-luxury-gold bg-luxury-gold/10 border-luxury-gold/25'
                          )}>
                            {isCOD(order) ? <Banknote size={10} /> : <CreditCard size={10} />}
                            {order.paymentMethod?.toUpperCase() || 'N/A'}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              order.isPaid ? 'bg-emerald-400' : 'bg-amber-400'
                            )} />
                            <span className="text-[10px] text-luxury-text-secondary">
                              {order.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Fulfillment Status Badge */}
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status || 'Pending'} />
                      </td>

                      {/* Quick Status Dropdown */}
                      <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) => updateStatus(e as any, order._id, e.target.value)}
                          className={cn(
                            'bg-white/5 border border-luxury-border rounded-lg px-2 py-1.5 text-[10px] font-bold tracking-wider uppercase focus:outline-none focus:border-luxury-gold/50 cursor-pointer transition-all hover:border-luxury-gold/30',
                            order.status?.toLowerCase() === 'delivered' ? 'text-emerald-400' :
                            order.status?.toLowerCase() === 'shipped'   ? 'text-purple-400' :
                            order.status?.toLowerCase() === 'processing'? 'text-blue-400' :
                            order.status?.toLowerCase() === 'cancelled' ? 'text-red-400' : 'text-amber-400'
                          )}
                        >
                          <option value="Pending"    className="bg-[#121212] text-amber-400">Pending</option>
                          <option value="Processing" className="bg-[#121212] text-blue-400">Processing</option>
                          <option value="Shipped"    className="bg-[#121212] text-purple-400">Shipped</option>
                          <option value="Delivered"  className="bg-[#121212] text-emerald-400">Delivered</option>
                          <option value="Cancelled"  className="bg-[#121212] text-red-400">Cancelled</option>
                        </select>
                      </td>

                      {/* View Arrow */}
                      <td className="px-6 py-4 text-right">
                        <span className="text-luxury-text-secondary group-hover:text-luxury-gold transition-colors">
                          <ArrowRight size={16} />
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
