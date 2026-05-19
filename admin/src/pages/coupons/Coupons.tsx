import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Ticket, Plus, Calendar, Percent, Trash2, Edit2, 
  Copy, Check, Search, AlertCircle, RefreshCw, X, HelpCircle 
} from 'lucide-react';
import { couponService, Coupon } from '../../services/couponService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { format, isAfter, parseISO } from 'date-fns';

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expireAt: ''
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await couponService.getCoupons();
      setCoupons(data);
    } catch (error: any) {
      console.error('Failed to fetch coupons:', error);
      toast.error(error.response?.data?.message || 'Failed to load privilege coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Code "${code}" copied to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discount: '',
      expireAt: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') // 1 week default
    });
    setShowModal(true);
  };

  const handleOpenEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount: coupon.discount.toString(),
      expireAt: format(new Date(coupon.expireAt), 'yyyy-MM-dd')
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to revoke the exclusive "${code}" privilege coupon?`)) {
      try {
        await couponService.deleteCoupon(id);
        toast.success(`Coupon "${code}" successfully revoked`);
        setCoupons(prev => prev.filter(c => c._id !== id));
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete coupon');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        discount: Number(formData.discount),
        expireAt: new Date(formData.expireAt).toISOString()
      };

      if (editingCoupon?._id) {
        const updated = await couponService.updateCoupon(editingCoupon._id, payload);
        toast.success(`Coupon "${payload.code}" updated successfully`);
        setCoupons(prev => prev.map(c => c._id === editingCoupon._id ? updated : c));
      } else {
        const created = await couponService.createCoupon(payload);
        toast.success(`Coupon "${payload.code}" created successfully`);
        setCoupons(prev => [created, ...prev]);
      }
      setShowModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter & Search Logic
  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  // Statistics
  const activeCoupons = coupons.filter(c => isAfter(new Date(c.expireAt), new Date()));
  const avgDiscount = coupons.length > 0 
    ? Math.round(coupons.reduce((acc, c) => acc + c.discount, 0) / coupons.length) 
    : 0;
  const highestDiscount = coupons.length > 0
    ? Math.max(...coupons.map(c => c.discount))
    : 0;

  return (
    <div className="space-y-8">
      {/* Ambient background blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-luxury-gold/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-luxury-gold/5 rounded-full blur-[120px]" />
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-display font-bold">Privilege Coupons</h1>
          <p className="text-luxury-text-secondary mt-1 text-sm">
            Curate exclusive discount codes and customer privileges for global store access.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-luxury-gold text-black px-6 py-2.5 rounded-xl text-sm font-luxury font-bold hover:bg-luxury-gold-hover transition-all shadow-lg"
          >
            <Plus size={16} />
            GENERATE NEW PRIVILEGE
          </button>
        </div>
      </div>

      {/* Quick Statistics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest mb-1">Active Privileges</p>
            <p className="text-2xl font-display font-bold text-luxury-gold">{activeCoupons.length} / {coupons.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
            <Ticket size={20} />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest mb-1">Average Discount Value</p>
            <p className="text-2xl font-display font-bold text-luxury-gold">{avgDiscount}% OFF</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
            <Percent size={20} />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest mb-1">Peak Discount Offer</p>
            <p className="text-2xl font-display font-bold text-luxury-gold">{highestDiscount}% OFF</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
            <Percent size={20} />
          </div>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="relative z-10 flex items-center gap-4 bg-white/[0.02] border border-luxury-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search privilege coupon code..."
            className="w-full bg-white/[0.03] border border-luxury-border rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-luxury-gold/30 text-white placeholder-luxury-text-secondary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={fetchCoupons}
          className="p-2.5 bg-white/[0.03] border border-luxury-border rounded-xl text-luxury-text-secondary hover:text-white transition-all"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Coupons View */}
      {loading ? (
        <div className="py-20 flex justify-center"><Loader /></div>
      ) : filteredCoupons.length === 0 ? (
        <div className="glass-card py-20 flex flex-col items-center justify-center text-center relative z-10 border border-luxury-border">
          <AlertCircle size={48} className="text-luxury-text-secondary opacity-30 mb-4" />
          <h3 className="font-display font-bold text-xl text-white">No Coupons Found</h3>
          <p className="text-luxury-text-secondary text-sm mt-1 max-w-sm px-4">
            Curate and reward your special clients by generating a brand new privilege discount code.
          </p>
          <button 
            onClick={handleOpenCreate}
            className="mt-6 flex items-center gap-2 bg-luxury-gold text-black px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-luxury-gold-hover transition-all"
          >
            <Plus size={14} /> GENERATE COUPON
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {filteredCoupons.map((coupon, index) => {
            const isExpired = !isAfter(new Date(coupon.expireAt), new Date());
            return (
              <motion.div
                key={coupon._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card p-6 border transition-all duration-300 relative overflow-hidden group ${
                  isExpired 
                    ? 'border-red-500/10 bg-red-950/[0.02]' 
                    : 'border-luxury-border hover:border-luxury-gold/30 hover:shadow-gold'
                }`}
              >
                {/* Visual discount water-mark */}
                <div className="absolute -right-4 -bottom-6 opacity-[0.03] text-8xl font-display font-bold text-white pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  {coupon.discount}%
                </div>

                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${
                    isExpired 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                      : 'bg-green-500/10 text-green-500 border-green-500/20'
                  }`}>
                    {isExpired ? 'EXPIRED' : 'ACTIVE'}
                  </span>
                  
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenEdit(coupon)}
                      className="p-1.5 bg-white/5 border border-luxury-border rounded-lg text-luxury-text-secondary hover:text-white hover:border-luxury-gold/30 transition-all"
                      title="Edit Privilege"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      onClick={() => handleDelete(coupon._id!, coupon.code)}
                      className="p-1.5 bg-white/5 border border-luxury-border rounded-lg text-luxury-text-secondary hover:text-red-500 hover:border-red-500/20 transition-all"
                      title="Revoke Privilege"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Coupon Code Block */}
                <div className="flex items-center justify-between bg-white/[0.02] border border-luxury-border p-3.5 rounded-xl mb-4 select-all">
                  <div className="flex items-center gap-2">
                    <Ticket className="text-luxury-gold" size={16} />
                    <span className="font-mono font-bold text-sm tracking-wider text-white uppercase">{coupon.code}</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(coupon.code, coupon._id!)}
                    className="text-luxury-text-secondary hover:text-luxury-gold transition-colors p-1"
                  >
                    {copiedId === coupon._id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-luxury-text-secondary">Discount Level</span>
                    <span className="font-display font-bold text-lg text-luxury-gold">{coupon.discount}% OFF</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-luxury-text-secondary flex items-center gap-1">
                      <Calendar size={13} />
                      Expires On
                    </span>
                    <span className="text-white font-medium">
                      {format(new Date(coupon.expireAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal dialog for creating / editing */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass-card p-8 border border-luxury-border shadow-luxury overflow-hidden bg-luxury-bg z-10"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 text-luxury-text-secondary hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-luxury-gold flex items-center justify-center text-black">
                  <Ticket size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">
                    {editingCoupon ? 'Modify Privilege' : 'Generate Privilege'}
                  </h3>
                  <p className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest">
                    Maison de Luxe Discount Code
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Coupon Code Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AURA10, ROYALVIP"
                    className="w-full luxury-input font-mono uppercase"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  />
                  <p className="text-[10px] text-luxury-text-secondary pl-1">Codes are automatically converted to uppercase.</p>
                </div>

                {/* Discount Percentage */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">
                    Discount Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      placeholder="e.g. 15"
                      className="w-full luxury-input pr-10"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                    />
                    <Percent className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary" size={16} />
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      className="w-full luxury-input"
                      value={formData.expireAt}
                      onChange={(e) => setFormData(prev => ({ ...prev, expireAt: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-white/5 border border-luxury-border text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all text-xs"
                  >
                    CANCEL
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-grow bg-luxury-gold text-black font-bold py-3 rounded-xl hover:bg-luxury-gold-hover transition-all text-xs flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        PROCESSING...
                      </>
                    ) : (
                      editingCoupon ? 'SAVE CHANGES' : 'CREATE PRIVILEGE'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
