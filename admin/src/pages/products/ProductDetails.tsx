import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Edit, 
  Trash2, 
  Package, 
  Tag, 
  BarChart3, 
  History,
  Box,
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { Product } from '../../types/product';
import { getProduct } from '../../services/productService';
import { format } from 'date-fns';
import { cn } from '../../utils/utils';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="glass-card p-12 text-center space-y-4">
        <Package className="mx-auto text-luxury-gold" size={48} />
        <h2 className="text-2xl font-display font-bold">Product Not Found</h2>
        <button 
          onClick={() => navigate('/products')}
          className="luxury-button-primary inline-flex items-center gap-2"
        >
          <ChevronLeft size={18} /> BACK TO PRODUCTS
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <button 
            onClick={() => navigate('/products')}
            className="text-luxury-gold flex items-center gap-2 text-sm font-bold tracking-widest hover:translate-x-[-4px] transition-transform"
          >
            <ChevronLeft size={16} /> BACK TO CATALOG
          </button>
          <h1 className="text-4xl font-display font-bold mt-2">{product.name}</h1>
          <div className="flex items-center gap-4 text-sm text-luxury-text-secondary">
            <span className="flex items-center gap-1.5"><Tag size={14} /> {product.category}</span>
            <span className="flex items-center gap-1.5"><Box size={14} /> SKU: {product.sku}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/products/edit/${product._id || (product as any).id}`)}
            className="glass-card px-6 py-3 flex items-center gap-2 text-sm font-bold hover:border-luxury-gold/50 transition-all"
          >
            <Edit size={16} /> EDIT PRODUCT
          </button>
          <button className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images and Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Image Gallery */}
          <div className="grid grid-cols-2 gap-4">
            {product.images.map((img, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "glass-card overflow-hidden h-[400px]",
                  idx === 0 ? "col-span-2" : "col-span-1"
                )}
              >
                <img src={img} alt={product.name} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>

          {/* Description */}
          <div className="glass-card p-8 space-y-4">
            <h3 className="font-display font-bold text-xl flex items-center gap-2 border-b border-luxury-border pb-4">
              <Layers size={20} className="text-luxury-gold" /> PRODUCT DESCRIPTION
            </h3>
            <p className="text-luxury-text-secondary leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* AI Insights Dynamic */}
          <div className="glass-card p-8 bg-linear-to-br from-luxury-gold/5 to-transparent border-luxury-gold/20 relative overflow-hidden">
            <Sparkles className="absolute -top-4 -right-4 w-32 h-32 text-luxury-gold/5 rotate-12" />
            <div className="relative z-10 space-y-4">
              <h3 className="font-display font-bold text-xl flex items-center gap-2 text-luxury-gold">
                <Sparkles size={20} /> AI PERFORMANCE INSIGHTS
              </h3>
              <p className="text-sm text-luxury-text-secondary max-w-xl leading-relaxed">
                {product.countInStock === 0 ? (
                  `CRITICAL ALERT: "${product.name}" is currently out of stock but has generated ₹${(product.totalRevenue || 0).toLocaleString()} in lifetime revenue. Immediate restocking of at least 50 units is strongly advised to capture ongoing demand.`
                ) : (product.last30DaysSold || 0) > 10 ? (
                  `HIGH PERFORMER: "${product.name}" is experiencing strong momentum with ${(product.last30DaysSold || 0)} acquisitions in the last 30 days. At the current sales velocity, existing stock of ${product.countInStock} units will optimize turnover. Consider featuring in the "Maison's Choice" collection.`
                ) : (
                  `STABLE ASSET: "${product.name}" maintains an exclusive presence in the catalog with ${product.countInStock} units available. Total lifetime acquisitions stand at ${product.totalSold || 0} units generating ₹${(product.totalRevenue || 0).toLocaleString()}. Recommend targeted VIP email campaigns.`
                )}
              </p>
              <button className="text-xs font-bold tracking-widest text-luxury-gold hover:underline flex items-center gap-1">
                VIEW FULL REPORT <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Inventory and Stats Sidebar */}
        <div className="space-y-6">
          {/* Status & Pricing */}
          <div className="glass-card p-8 space-y-6">
            <div className="space-y-1 text-center">
              <p className="text-[10px] font-bold text-luxury-text-secondary tracking-[0.3em] uppercase">Current Value</p>
              <h2 className="text-5xl font-display font-bold text-luxury-gold">₹{product.price.toLocaleString()}</h2>
            </div>

            <div className="pt-6 border-t border-luxury-border space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-luxury-text-secondary font-medium">Availability</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  product.countInStock > 10 ? "text-green-400 bg-green-400/10" : "text-amber-400 bg-amber-400/10"
                )}>
                  {product.countInStock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-luxury-text-secondary font-medium">Stock Level</span>
                <span className="text-white font-bold">{product.countInStock} Units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-luxury-text-secondary font-medium">Status</span>
                <span className="text-white font-bold uppercase">{product.status || 'active'}</span>
              </div>
            </div>

            <button className="w-full luxury-button-primary">
              UPDATE INVENTORY
            </button>
          </div>

          {/* Sales Stats */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-display font-bold flex items-center gap-2">
              <BarChart3 size={18} className="text-luxury-gold" /> SALES PERFORMANCE
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-luxury-text-secondary">Monthly Target Progress</span>
                  <span className="text-white font-bold">{Math.min(100, Math.round(((product.last30DaysSold || 0) / 30) * 100))}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-luxury-gold" style={{ width: `${Math.min(100, Math.round(((product.last30DaysSold || 0) / 30) * 100))}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-white/[0.02] rounded-xl border border-luxury-border">
                  <p className="text-[10px] text-luxury-text-secondary uppercase">Last 30 Days</p>
                  <p className="text-lg font-bold text-white mt-1">{product.last30DaysSold || 0} Units</p>
                </div>
                <div className="p-3 bg-white/[0.02] rounded-xl border border-luxury-border">
                  <p className="text-[10px] text-luxury-text-secondary uppercase">Total Revenue</p>
                  <p className="text-lg font-bold text-white mt-1">₹{(product.totalRevenue || 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="p-3 bg-white/[0.02] rounded-xl border border-luxury-border flex justify-between items-center">
                <span className="text-[10px] text-luxury-text-secondary uppercase">Lifetime Units Sold</span>
                <span className="text-sm font-bold text-luxury-gold">{product.totalSold || 0} Units</span>
              </div>
            </div>
          </div>

          {/* Timeline/History */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-display font-bold flex items-center gap-2">
              <History size={18} className="text-luxury-gold" /> RECENT ACQUISITIONS
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
              {(!product.recentOrders || product.recentOrders.length === 0) ? (
                <p className="text-xs text-luxury-text-secondary text-center py-4">No recent acquisitions recorded for this masterpiece.</p>
              ) : (
                product.recentOrders.map((order: any, idx: number) => (
                  <div key={order._id || idx} className="flex gap-3 relative before:absolute before:left-[7px] before:top-6 before:bottom-0 before:w-[1px] before:bg-luxury-border last:before:hidden">
                    <div className="w-4 h-4 rounded-full bg-luxury-gold mt-1 z-10 shrink-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-luxury-bg rounded-full" />
                    </div>
                    <div className="space-y-1 flex-1 bg-white/[0.01] p-3 rounded-xl border border-luxury-border/50 hover:border-luxury-gold/30 transition-all">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-bold text-white group-hover:text-luxury-gold transition-colors">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <span className="text-[10px] font-bold text-luxury-gold">₹{order.total?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-luxury-text-secondary">
                        <span>{order.user?.name || 'Guest'} ({order.qty}x)</span>
                        <span>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
