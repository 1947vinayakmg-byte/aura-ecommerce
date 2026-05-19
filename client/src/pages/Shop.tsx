import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid2X2, Grid3X3, PackageOpen, Search, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import API from "../services/api";
import ProductGrid from '../components/product/ProductGrid';
import EmptyState from '../components/common/EmptyState';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('Newest');
  const [viewCols, setViewCols] = useState(3);
  const [sortOpen, setSortOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState(1);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [hideOutOfStock, setHideOutOfStock] = useState(true);

  const activeCategory = searchParams.get('category') || 'All';
  const search = searchParams.get('keyword') || searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryQuery = activeCategory === 'All' ? '' : activeCategory;
        const { data } = await API.get(
          `/products?keyword=${search}&category=${categoryQuery}&pageNumber=${page}`
        );

        setProducts(data.products || []);
        setPages(data.pages || 1);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, search, page]);


  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Price filtering
    if (minPrice !== '') {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter(p => p.price <= Number(maxPrice));
    }
    
    // Auto hide out of stock
    if (hideOutOfStock) {
      result = result.filter(p => p.countInStock > 0);
    }

    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Best Selling') {
      result.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
    } else if (sortBy === 'Trending') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'Newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, activeCategory, sortBy, minPrice, maxPrice, hideOutOfStock]);

  const inStockProducts = filteredProducts.filter((p) => p.countInStock > 0);

  const categories = ['All', 'Men', 'Women', 'Streetwear', 'Essentials'];

  return (
    <main className="pt-12 pb-20 px-6 md:px-12 bg-luxury-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-display mb-4 tracking-0.1em">THE SHOP</h1>
              <p className="text-secondary text-sm tracking-widest uppercase italic font-light">Showing {filteredProducts.length} meticulously curated pieces</p>
            </div>

            <div className="flex items-center gap-8 border-t border-primary/5 pt-6 w-full md:w-auto">
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 text-[10px] tracking-widest uppercase cursor-pointer hover:text-luxury-gold transition-colors font-bold pb-2"
                >
                  <SlidersHorizontal size={14} />
                  <span>Sort By: {sortBy}</span>
                </button>
                {sortOpen && (
                  <div className="absolute top-full left-0 w-48 bg-luxury-card border border-primary/10 rounded shadow-xl z-50">
                    {['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Selling', 'Trending'].map(option => (
                      <button 
                        key={option}
                        onClick={() => { setSortBy(option); setSortOpen(false); }}
                        className={cn(
                          "w-full text-left px-4 py-3 text-[10px] tracking-widest uppercase hover:bg-primary/5 transition-colors",
                          sortBy === option ? "text-luxury-gold font-bold" : "text-primary/70"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="hidden lg:flex items-center gap-4 border-l border-primary/10 pl-8">
                <button onClick={() => setViewCols(2)} className={cn("transition-colors", viewCols === 2 ? "text-luxury-gold" : "text-primary/40")}>
                  <Grid2X2 size={20} />
                </button>
                <button onClick={() => setViewCols(3)} className={cn("transition-colors", viewCols === 3 ? "text-luxury-gold" : "text-primary/40")}>
                  <Grid3X3 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Filters, Search & Price Range */}
          <div className="flex flex-col gap-8 pb-8 border-b border-primary/5">
            
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-4 md:gap-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    updateSearchParams({ 
                      category: cat === 'All' ? null : cat,
                      page: '1' 
                    });
                  }}
                  className={cn(
                    "text-[10px] md:text-xs tracking-[0.4em] uppercase font-black py-2 transition-all relative",
                    activeCategory === cat ? "text-luxury-gold after:content-[''] after:absolute after:-bottom-8 after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 after:bg-luxury-gold after:rounded-full" : "text-primary/50 hover:text-primary"
                  )}
                >
                  {cat}
                </button>
              ))}
              </div>

              {/* Search UI */}
              <div className="relative w-full lg:w-64">
                <input 
                  type="text" 
                  placeholder="SEARCH PIECES..." 
                  defaultValue={search}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateSearchParams({ keyword: e.currentTarget.value || null, page: '1' });
                    }
                  }}
                  className="w-full bg-transparent border-b border-primary/20 pb-2 pl-8 text-[10px] md:text-xs tracking-widest text-primary focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-primary/30"
                />
                <Search size={14} className="absolute left-0 top-0 text-primary/40" />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Price Filter UI */}
              <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase">
                 <span className="text-primary/50 font-bold">Price Range:</span>
                 <div className="flex items-center gap-2">
                   <span className="text-primary/30">₹</span>
                   <input 
                     type="number" 
                     value={minPrice} 
                     onChange={(e) => setMinPrice(e.target.value)} 
                     className="w-16 md:w-20 bg-transparent border-b border-primary/20 pb-1 text-center focus:outline-none focus:border-luxury-gold text-primary transition-colors placeholder:text-primary/20" 
                     placeholder="MIN"
                   />
                 </div>
                 <span className="text-primary/30">—</span>
                 <div className="flex items-center gap-2">
                   <span className="text-primary/30">₹</span>
                   <input 
                     type="number" 
                     value={maxPrice} 
                     onChange={(e) => setMaxPrice(e.target.value)} 
                     className="w-16 md:w-20 bg-transparent border-b border-primary/20 pb-1 text-center focus:outline-none focus:border-luxury-gold text-primary transition-colors placeholder:text-primary/20" 
                     placeholder="MAX"
                   />
                 </div>
              </div>

              {/* Hide Out of Stock Toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={hideOutOfStock}
                    onChange={(e) => setHideOutOfStock(e.target.checked)}
                  />
                  <div className={cn(
                    "w-8 h-4 rounded-full transition-colors",
                    hideOutOfStock ? "bg-luxury-gold" : "bg-primary/20"
                  )}></div>
                  <div className={cn(
                    "absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform",
                    hideOutOfStock ? "translate-x-4" : "translate-x-0"
                  )}></div>
                </div>
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/70 group-hover:text-luxury-gold transition-colors">
                  Hide Out of Stock
                </span>
              </label>
            </div>

          </div>
        </header>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[3/4] bg-neutral-900 border border-white/5 rounded-sm relative overflow-hidden" />
                <div className="flex justify-between items-start pt-2">
                  <div className="space-y-2 w-2/3">
                    <div className="h-4 bg-neutral-900 rounded w-full" />
                    <div className="h-3 bg-neutral-900 rounded w-1/2" />
                  </div>
                  <div className="h-4 bg-neutral-900 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState 
            icon={PackageOpen}
            title="Category Archive Empty"
            description="Our curators are currently sourcing new pieces for this category. Explore our other active volumes."
            actionLabel="View All Pieces"
            actionPath="/shop"
          />
        ) : (
          <ProductGrid products={filteredProducts} viewCols={viewCols as 2 | 3} />
        )}

        {/* Pagination Controls */}
        {pages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-primary/5">
            <button 
              onClick={() => updateSearchParams({ page: Math.max(1, page - 1).toString() })}
              disabled={page === 1}
              className="text-[10px] uppercase tracking-[0.2em] font-bold px-6 py-3 border border-primary/10 hover:border-luxury-gold transition-colors disabled:opacity-30 disabled:hover:border-primary/10"
            >
              Previous
            </button>
            <span className="text-[10px] uppercase tracking-widest text-secondary">
              Page {page} of {pages}
            </span>
            <button 
              onClick={() => updateSearchParams({ page: Math.min(pages, page + 1).toString() })}
              disabled={page === pages}
              className="text-[10px] uppercase tracking-[0.2em] font-bold px-6 py-3 border border-primary/10 hover:border-luxury-gold transition-colors disabled:opacity-30 disabled:hover:border-primary/10"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Shop;
