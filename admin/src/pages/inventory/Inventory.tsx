import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Package, Search, Filter, AlertTriangle, CheckCircle, 
  XCircle, Edit3, Save, RefreshCw, IndianRupee, Archive 
} from 'lucide-react';
import { getProducts, updateProduct } from '../../services/productService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  countInStock: number;
  category: string;
  image: string;
  images: string[];
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'out'>('all');
  
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch 100 products to showcase the complete inventory list
      const data = await getProducts(search, 1);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleStartEdit = (id: string, currentStock: number) => {
    setEditingId(id);
    setEditStock(currentStock);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveStock = async (id: string) => {
    setUpdatingId(id);
    const toastId = toast.loading('Updating stock levels...');
    try {
      await updateProduct(id, { countInStock: editStock });
      toast.success('Stock level successfully updated', { id: toastId });
      setProducts(prev => prev.map(p => p._id === id ? { ...p, countInStock: editStock } : p));
      setEditingId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update stock', { id: toastId });
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter products based on status
  const filteredProducts = products.filter(p => {
    const isOut = p.countInStock === 0;
    const isLow = p.countInStock > 0 && p.countInStock <= 10;
    
    if (statusFilter === 'out') return isOut;
    if (statusFilter === 'low') return isLow;
    return true;
  });

  // Calculate statistics
  const totalStockUnits = products.reduce((acc, p) => acc + p.countInStock, 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.countInStock), 0);
  const lowStockCount = products.filter(p => p.countInStock > 0 && p.countInStock <= 10).length;
  const outOfStockCount = products.filter(p => p.countInStock === 0).length;

  return (
    <div className="space-y-8">
      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-luxury-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-luxury-gold/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-display font-bold">Maison Inventory</h1>
          <p className="text-luxury-text-secondary mt-1 text-sm">
            Monitor luxury stock levels, SKU valuations, and perform instant catalog replenishments.
          </p>
        </div>
        <button 
          onClick={fetchProducts}
          className="flex items-center gap-2 bg-white/[0.03] border border-luxury-border px-4 py-2.5 rounded-xl text-xs font-luxury font-bold hover:bg-white/[0.05] transition-all self-start md:self-auto"
        >
          <RefreshCw size={14} /> REFRESH INVENTORY
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest mb-1">Total Stock Units</p>
            <p className="text-2xl font-display font-bold text-luxury-gold">{totalStockUnits}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
            <Package size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest mb-1">Inventory Valuation</p>
            <p className="text-2xl font-display font-bold text-luxury-gold">₹{totalInventoryValue.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
            <IndianRupee size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest mb-1">Low Stock Alerts</p>
            <p className="text-2xl font-display font-bold text-amber-500">{lowStockCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-luxury-border bg-white/[0.02] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest mb-1">Depleted Assets</p>
            <p className="text-2xl font-display font-bold text-red-500">{outOfStockCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
            <Archive size={18} />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 bg-white/[0.02] border border-luxury-border p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search SKU or product name..."
            className="w-full bg-white/[0.03] border border-luxury-border rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-luxury-gold/30 text-white placeholder-luxury-text-secondary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tab Filters */}
        <div className="flex bg-white/[0.03] border border-luxury-border rounded-xl p-1 shrink-0 w-full md:w-auto">
          {[
            { label: 'All Assets', value: 'all' },
            { label: 'Low Stock', value: 'low' },
            { label: 'Out of Stock', value: 'out' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value as any)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                statusFilter === tab.value 
                  ? 'bg-luxury-gold text-black shadow-gold' 
                  : 'text-luxury-text-secondary hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory List Table */}
      {loading ? (
        <div className="py-20 flex justify-center"><Loader /></div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-card py-20 flex flex-col items-center justify-center text-center relative z-10 border border-luxury-border">
          <AlertTriangle size={48} className="text-luxury-text-secondary opacity-30 mb-4" />
          <h3 className="font-display font-bold text-xl text-white">No Inventory Matched</h3>
          <p className="text-luxury-text-secondary text-sm mt-1 max-w-sm px-4">
            No active products matched your selected search filters or stock alerts.
          </p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden border border-luxury-border relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-luxury-border bg-white/[0.02] text-xs font-bold text-luxury-text-secondary tracking-widest uppercase">
                  <th className="py-4 px-6">Masterpiece Image</th>
                  <th className="py-4 px-6">SKU / Product Code</th>
                  <th className="py-4 px-6">Collection</th>
                  <th className="py-4 px-6">Value (INR)</th>
                  <th className="py-4 px-6 text-center">Availability Status</th>
                  <th className="py-4 px-6 text-center">Remaining Stock</th>
                  <th className="py-4 px-6 text-right">Stock Management</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const isOut = product.countInStock === 0;
                  const isLow = product.countInStock > 0 && product.countInStock <= 10;
                  
                  return (
                    <tr 
                      key={product._id} 
                      className="border-b border-luxury-border/50 hover:bg-white/[0.01] transition-all text-sm group"
                    >
                      {/* Image */}
                      <td className="py-3 px-6">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-luxury-border group-hover:border-luxury-gold/50 transition-all">
                          <img 
                            src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/100x100?text=Aura'} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </td>

                      {/* Name & SKU */}
                      <td className="py-3 px-6">
                        <p className="font-bold text-white group-hover:text-luxury-gold transition-colors leading-snug">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-luxury-text-secondary uppercase font-mono mt-0.5 tracking-wider">
                          {product.sku || `SKU-${product._id.slice(-6).toUpperCase()}`}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-6">
                        <span className="px-2 py-0.5 bg-white/5 border border-luxury-border rounded-lg text-[10px] font-bold uppercase tracking-wider text-luxury-text-secondary">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-6 font-bold text-white">
                        ₹{product.price.toLocaleString()}
                      </td>

                      {/* Stock Status Badge */}
                      <td className="py-3 px-6 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${
                          isOut 
                            ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                            : isLow 
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                            : 'bg-green-500/10 text-green-500 border-green-500/20'
                        }`}>
                          {isOut ? (
                            <>
                              <XCircle size={10} /> OUT OF STOCK
                            </>
                          ) : isLow ? (
                            <>
                              <AlertTriangle size={10} /> LOW STOCK
                            </>
                          ) : (
                            <>
                              <CheckCircle size={10} /> IN STOCK
                            </>
                          )}
                        </span>
                      </td>

                      {/* Stock Level Display */}
                      <td className="py-3 px-6 text-center font-semibold">
                        {editingId === product._id ? (
                          <input 
                            type="number"
                            min="0"
                            className="w-20 bg-white/[0.03] border border-luxury-gold/30 rounded-lg px-2 py-1 text-center text-sm font-bold text-luxury-gold focus:outline-none focus:border-luxury-gold"
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                          />
                        ) : (
                          <span className={isOut ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-white'}>
                            {product.countInStock} Units
                          </span>
                        )}
                      </td>

                      {/* Quick Management Trigger */}
                      <td className="py-3 px-6 text-right">
                        {editingId === product._id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              disabled={updatingId === product._id}
                              onClick={() => handleSaveStock(product._id)}
                              className="p-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 hover:bg-green-500 hover:text-white transition-all"
                              title="Commit Replenishment"
                            >
                              <Save size={13} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 bg-white/5 border border-luxury-border rounded-lg text-luxury-text-secondary hover:text-white transition-all"
                              title="Discard"
                            >
                              <XCircle size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(product._id, product.countInStock)}
                            className="p-2 bg-white/5 hover:bg-luxury-gold/10 border border-luxury-border hover:border-luxury-gold/30 rounded-xl text-luxury-text-secondary hover:text-luxury-gold transition-all opacity-40 group-hover:opacity-100"
                            title="Instant Stock Replenishment"
                          >
                            <Edit3 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
