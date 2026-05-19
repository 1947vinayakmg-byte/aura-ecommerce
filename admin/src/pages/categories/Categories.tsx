import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, Search, Filter, ShoppingBag, FolderOpen, ArrowRight, 
  HelpCircle, RefreshCw, BarChart, Package, Tag, ArrowUpRight 
} from 'lucide-react';
import { getProducts } from '../../services/productService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  countInStock: number;
  category: string;
  image: string;
  images: string[];
}

interface CategoryStats {
  name: string;
  productCount: number;
  totalStock: number;
  avgPrice: number;
  products: Product[];
}

export default function Categories() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryStats | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts('', 1);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load categories catalog:', error);
      toast.error('Failed to analyze product collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Compute category statistics based on products in the catalog
  const categoriesMap: { [key: string]: Product[] } = {};
  products.forEach(p => {
    const cat = p.category ? p.category.trim() : 'Exclusive';
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
    }
    categoriesMap[cat].push(p);
  });

  const categoryStats: CategoryStats[] = Object.keys(categoriesMap).map(name => {
    const catProducts = categoriesMap[name];
    const productCount = catProducts.length;
    const totalStock = catProducts.reduce((acc, p) => acc + p.countInStock, 0);
    const avgPrice = catProducts.length > 0 
      ? Math.round(catProducts.reduce((acc, p) => acc + p.price, 0) / catProducts.length)
      : 0;

    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      productCount,
      totalStock,
      avgPrice,
      products: catProducts
    };
  });

  // Filter Categories by search
  const filteredCategories = categoryStats.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Background ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[5%] w-[35%] h-[35%] bg-luxury-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[35%] h-[35%] bg-luxury-gold/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-display font-bold">Maison Collections</h1>
          <p className="text-luxury-text-secondary mt-1 text-sm">
            Curate luxury product taxonomies, collections, and inspect performance of each product line.
          </p>
        </div>
        <button 
          onClick={fetchProducts}
          className="flex items-center gap-2 bg-white/[0.03] border border-luxury-border px-4 py-2.5 rounded-xl text-xs font-luxury font-bold hover:bg-white/[0.05] transition-all self-start md:self-auto"
        >
          <RefreshCw size={14} /> REFRES COLLECTION INDEX
        </button>
      </div>

      {/* Search and stats bar */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 bg-white/[0.02] border border-luxury-border p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search catalog collections by name..."
            className="w-full bg-white/[0.03] border border-luxury-border rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-luxury-gold/30 text-white placeholder-luxury-text-secondary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="p-2.5 bg-white/5 border border-luxury-border rounded-xl text-xs font-bold text-luxury-gold shrink-0">
          {categoryStats.length} Unique Collections Active
        </div>
      </div>

      {/* Main View Grid split if a category is selected */}
      {loading ? (
        <div className="py-20 flex justify-center"><Loader /></div>
      ) : filteredCategories.length === 0 ? (
        <div className="glass-card py-20 flex flex-col items-center justify-center text-center relative z-10 border border-luxury-border">
          <FolderOpen size={48} className="text-luxury-text-secondary opacity-30 mb-4" />
          <h3 className="font-display font-bold text-xl text-white">No Collections Found</h3>
          <p className="text-luxury-text-secondary text-sm mt-1 max-w-sm px-4">
            No unique collections matched your current search parameter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Left panel: List of Categories */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-luxury-text-secondary uppercase">
              Collection Portfolios
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCategories.map((cat, index) => {
                const isSelected = selectedCategory?.name === cat.name;
                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedCategory(cat)}
                    className={`glass-card p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'border-luxury-gold shadow-gold bg-luxury-gold/[0.02]' 
                        : 'border-luxury-border hover:border-luxury-gold/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
                          <Layers size={18} />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-white/5 border border-luxury-border rounded-lg text-luxury-text-secondary">
                          {cat.productCount} Items
                        </span>
                      </div>

                      <h4 className="text-xl font-display font-bold text-white group-hover:text-luxury-gold transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-[10px] text-luxury-text-secondary uppercase tracking-widest mt-1">
                        Luxury Product Line
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-luxury-border/50 flex justify-between items-center text-xs">
                      <div>
                        <p className="text-[9px] text-luxury-text-secondary uppercase tracking-wider">Average Price</p>
                        <p className="font-bold text-white mt-0.5">₹{cat.avgPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-luxury-text-secondary uppercase tracking-wider">Stock Valuation</p>
                        <p className="font-bold text-luxury-gold mt-0.5">{cat.totalStock} Units</p>
                      </div>
                      <ArrowRight size={14} className="text-luxury-text-secondary" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Products inside selected category */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-luxury-text-secondary uppercase">
              Collection Details
            </h3>

            <AnimatePresence mode="wait">
              {selectedCategory ? (
                <motion.div
                  key={selectedCategory.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="glass-card p-6 border border-luxury-gold/30 bg-white/[0.01]"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-luxury-gold flex items-center justify-center text-black">
                      <FolderOpen size={16} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-white">{selectedCategory.name}</h4>
                      <p className="text-[9px] text-luxury-gold font-bold uppercase tracking-widest">Selected Collection</p>
                    </div>
                  </div>

                  {/* Quick stats on selected */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/[0.02] border border-luxury-border/50 p-3 rounded-xl text-center">
                      <p className="text-[9px] text-luxury-text-secondary uppercase">Products</p>
                      <p className="text-lg font-bold text-white mt-1">{selectedCategory.productCount}</p>
                    </div>
                    <div className="bg-white/[0.02] border border-luxury-border/50 p-3 rounded-xl text-center">
                      <p className="text-[9px] text-luxury-text-secondary uppercase">Avg Price</p>
                      <p className="text-lg font-bold text-luxury-gold mt-1">₹{selectedCategory.avgPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* List of items */}
                  <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-hide">
                    {selectedCategory.products.map(prod => (
                      <div 
                        key={prod._id}
                        onClick={() => navigate(`/products/${prod._id}`)}
                        className="flex items-center justify-between gap-3 p-2 bg-white/[0.01] hover:bg-white/[0.03] border border-luxury-border/50 hover:border-luxury-gold/30 rounded-xl transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg overflow-hidden border border-luxury-border shrink-0">
                            <img 
                              src={prod.images && prod.images.length > 0 ? prod.images[0] : 'https://placehold.co/100x100?text=Aura'} 
                              alt={prod.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate group-hover:text-luxury-gold transition-colors">{prod.name}</p>
                            <p className="text-[9px] text-luxury-text-secondary uppercase font-mono tracking-wider mt-0.5">
                              {prod.countInStock} Units Left
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">₹{prod.price.toLocaleString()}</span>
                          <ArrowUpRight size={12} className="text-luxury-text-secondary group-hover:text-luxury-gold transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="glass-card p-8 border border-dashed border-luxury-border text-center flex flex-col items-center justify-center py-20 text-luxury-text-secondary">
                  <FolderOpen size={36} className="opacity-30 mb-3" />
                  <p className="text-xs font-bold tracking-widest uppercase">Select Collection</p>
                  <p className="text-[10px] mt-1 max-w-[200px]">
                    Select any collection portfolio to inspect individual catalog assets and inventory details.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
