import React, { useState, useEffect } from 'react';
import { Archive, Search, AlertTriangle, RefreshCw, Undo2 } from 'lucide-react';
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

export default function DeletedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchDeletedProducts = async () => {
    try {
      setLoading(true);
      // Fetch hidden products
      const data = await getProducts(search, 1, true);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch deleted products:', error);
      toast.error('Failed to load deleted products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedProducts();
  }, [search]);

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    const toastId = toast.loading('Restoring product to live storefront...');
    try {
      await updateProduct(id, { isHidden: false });
      toast.success('Product successfully restored', { id: toastId });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to restore product', { id: toastId });
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-red-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-red-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-display font-bold">Deleted Products Archive</h1>
          <p className="text-luxury-text-secondary mt-1 text-sm">
            View products that have been removed from the live storefront. Restore them at any time.
          </p>
        </div>
        <button 
          onClick={fetchDeletedProducts}
          className="flex items-center gap-2 bg-white/[0.03] border border-luxury-border px-4 py-2.5 rounded-xl text-xs font-luxury font-bold hover:bg-white/[0.05] transition-all self-start md:self-auto"
        >
          <RefreshCw size={14} /> REFRESH ARCHIVE
        </button>
      </div>

      {/* Filters & Search */}
      <div className="relative z-10 flex items-center bg-white/[0.02] border border-luxury-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search archived product name..."
            className="w-full bg-white/[0.03] border border-luxury-border rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-red-500/30 text-white placeholder-luxury-text-secondary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List Table */}
      {loading ? (
        <div className="py-20 flex justify-center"><Loader /></div>
      ) : products.length === 0 ? (
        <div className="glass-card py-20 flex flex-col items-center justify-center text-center relative z-10 border border-luxury-border">
          <Archive size={48} className="text-luxury-text-secondary opacity-30 mb-4" />
          <h3 className="font-display font-bold text-xl text-white">Archive Empty</h3>
          <p className="text-luxury-text-secondary text-sm mt-1 max-w-sm px-4">
            There are currently no deleted products in the archive.
          </p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden border border-luxury-border relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-luxury-border bg-white/[0.02] text-xs font-bold text-luxury-text-secondary tracking-widest uppercase">
                  <th className="py-4 px-6">Product Image</th>
                  <th className="py-4 px-6">Name / SKU</th>
                  <th className="py-4 px-6">Collection</th>
                  <th className="py-4 px-6">Value (INR)</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr 
                    key={product._id} 
                    className="border-b border-luxury-border/50 hover:bg-white/[0.01] transition-all text-sm group"
                  >
                    <td className="py-3 px-6">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-luxury-border opacity-60 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0">
                        <img 
                          src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/100x100?text=Aura'} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </td>

                    <td className="py-3 px-6 opacity-60 group-hover:opacity-100 transition-opacity">
                      <p className="font-bold text-white leading-snug line-through group-hover:no-underline">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-luxury-text-secondary uppercase font-mono mt-0.5 tracking-wider">
                        {product.sku || `SKU-${product._id.slice(-6).toUpperCase()}`}
                      </p>
                    </td>

                    <td className="py-3 px-6">
                      <span className="px-2 py-0.5 bg-white/5 border border-luxury-border rounded-lg text-[10px] font-bold uppercase tracking-wider text-luxury-text-secondary opacity-60 group-hover:opacity-100">
                        {product.category}
                      </span>
                    </td>

                    <td className="py-3 px-6 font-bold text-luxury-text-secondary opacity-60 group-hover:opacity-100">
                      ₹{product.price.toLocaleString()}
                    </td>

                    <td className="py-3 px-6 text-right">
                      <button
                        disabled={restoringId === product._id}
                        onClick={() => handleRestore(product._id)}
                        className="p-2 bg-white/5 hover:bg-green-500/10 border border-luxury-border hover:border-green-500/30 rounded-xl text-luxury-text-secondary hover:text-green-500 transition-all"
                        title="Restore Product"
                      >
                        {restoringId === product._id ? (
                          <RefreshCw size={16} className="animate-spin" />
                        ) : (
                          <Undo2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
