import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Trash2, Search, Filter, RefreshCw, MessageSquare, 
  AlertCircle, CheckCircle, ArrowUpRight, ShieldAlert 
} from 'lucide-react';
import { getAllReviews, deleteReview } from '../../services/productService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  product: {
    _id: string;
    name: string;
    image: string;
  };
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews();
      setReviews(data || []);
    } catch (error: any) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load feedback catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id: string, clientName: string) => {
    if (window.confirm(`Are you sure you want to remove the review submitted by "${clientName}"?`)) {
      const toastId = toast.loading('Removing review from catalog...');
      try {
        await deleteReview(id);
        toast.success('Review successfully moderated and removed', { id: toastId });
        setReviews(prev => prev.filter(r => r._id !== id));
      } catch (error: any) {
        console.error('Failed to delete review:', error);
        toast.error('Failed to delete review', { id: toastId });
      }
    }
  };

  // Helper to render rating stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={13} 
            className={i < rating ? "fill-luxury-gold text-luxury-gold" : "text-white/10"} 
          />
        ))}
      </div>
    );
  };

  // Filter & Search Logic
  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      r.product.name.toLowerCase().includes(search.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  // Calculate review stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';
  const positiveSentiment = totalReviews > 0
    ? Math.round((reviews.filter(r => r.rating >= 4).length / totalReviews) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Ambient background decorative blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[5%] w-[35%] h-[35%] bg-luxury-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[5%] w-[35%] h-[35%] bg-luxury-gold/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-display font-bold">Client Reviews</h1>
          <p className="text-luxury-text-secondary mt-1 text-sm">
            Moderate, audit, and curate authentic product reviews and client testimonials.
          </p>
        </div>
        <button 
          onClick={fetchReviews}
          className="flex items-center gap-2 bg-white/[0.03] border border-luxury-border px-4 py-2.5 rounded-xl text-xs font-luxury font-bold hover:bg-white/[0.05] transition-all self-start md:self-auto"
        >
          <RefreshCw size={14} /> SILENT SYNC
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest mb-1">Total Testimonials</p>
            <p className="text-2xl font-display font-bold text-luxury-gold">{totalReviews}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
            <MessageSquare size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest mb-1">Catalog Rating</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-white">{avgRating}</span>
              <span className="text-xs text-luxury-text-secondary">/ 5.0</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
            <Star size={18} className="fill-luxury-gold" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest mb-1">Sentiment Rating</p>
            <p className="text-2xl font-display font-bold text-luxury-gold">{positiveSentiment}% Positive</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
            <CheckCircle size={18} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 bg-white/[0.02] border border-luxury-border p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search by client name, product name, or review content..."
            className="w-full bg-white/[0.03] border border-luxury-border rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-luxury-gold/30 text-white placeholder-luxury-text-secondary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
          <Filter size={14} className="text-luxury-text-secondary" />
          <select
            className="bg-white/[0.03] border border-luxury-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold/30 transition-all font-semibold"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all" className="bg-luxury-sidebar">All Stars</option>
            <option value="5" className="bg-luxury-sidebar">5 Stars</option>
            <option value="4" className="bg-luxury-sidebar">4 Stars</option>
            <option value="3" className="bg-luxury-sidebar">3 Stars</option>
            <option value="2" className="bg-luxury-sidebar">2 Stars</option>
            <option value="1" className="bg-luxury-sidebar">1 Star</option>
          </select>
        </div>
      </div>

      {/* Review Cards Grid */}
      {loading ? (
        <div className="py-20 flex justify-center"><Loader /></div>
      ) : filteredReviews.length === 0 ? (
        <div className="glass-card py-20 flex flex-col items-center justify-center text-center relative z-10 border border-luxury-border">
          <AlertCircle size={48} className="text-luxury-text-secondary opacity-30 mb-4" />
          <h3 className="font-display font-bold text-xl text-white">No Reviews Found</h3>
          <p className="text-luxury-text-secondary text-sm mt-1 max-w-sm px-4">
            No testimonials match your current filter preferences.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {filteredReviews.map((review, index) => {
            const clientInitials = review.name ? review.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'C';
            return (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 border border-luxury-border hover:border-luxury-gold/30 hover:shadow-gold transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Review Header (Avatar, Stars, Date) */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-[10px] font-bold text-luxury-gold">
                        {clientInitials}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">{review.name}</h4>
                        <p className="text-[9px] text-luxury-text-secondary mt-0.5">
                          {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  {/* Review Comment text */}
                  <p className="text-xs text-luxury-text-secondary leading-relaxed italic mb-5 select-text">
                    "{review.comment}"
                  </p>
                </div>

                {/* Card Footer (Product Reference, Actions) */}
                <div className="pt-4 border-t border-luxury-border/50 flex items-center justify-between gap-3">
                  <Link 
                    to={`/products/${review.product?._id}`}
                    className="flex items-center gap-2 flex-1 min-w-0 group/prod"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-luxury-border/50 bg-white/5 shrink-0">
                      <img 
                        src={review.product?.image || 'https://placehold.co/100x100?text=Aura'} 
                        alt={review.product?.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-luxury-text-secondary font-bold uppercase tracking-widest leading-none">Catalog Item</p>
                      <p className="text-[11px] text-white truncate font-medium group-hover/prod:text-luxury-gold transition-colors mt-0.5 flex items-center gap-0.5">
                        {review.product?.name}
                        <ArrowUpRight size={10} className="shrink-0" />
                      </p>
                    </div>
                  </Link>

                  <button 
                    onClick={() => handleDeleteReview(review._id, review.name)}
                    className="p-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-xl text-luxury-text-secondary hover:text-red-500 transition-all opacity-40 group-hover:opacity-100 shrink-0"
                    title="Moderate Review"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
