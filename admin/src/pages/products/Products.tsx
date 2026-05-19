import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { getProducts, deleteProduct } from '../../services/productService';
import ProductTable from '../../components/products/ProductTable';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(search, page);
      setProducts(data.products || []);
      setPage(data.page || 1);
      setPages(data.pages || 1);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this masterpiece from the catalog?')) {
      const toastId = toast.loading('Removing product...');
      try {
        await deleteProduct(id);
        toast.success('Product removed successfully', { id: toastId });
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error('Failed to remove product', { id: toastId });
      }
    }
  };

  const handleEditProduct = (product: any) => {
    navigate(`/products/edit/${product._id}`);
  };

  const handleViewProduct = (product: any) => {
    navigate(`/products/${product._id || product.id}`);
  };

  // filteredProducts is no longer needed as we use server-side search

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Products Management</h1>
          <p className="text-luxury-text-secondary mt-1">Manage and curate your global product catalog.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white/[0.03] border border-luxury-border px-4 py-2.5 rounded-xl text-sm font-luxury font-bold hover:bg-white/[0.05] transition-all">
            <Download size={16} />
            EXPORT CATALOG
          </button>
          <button 
            onClick={() => navigate('/products/add')}
            className="flex items-center gap-2 bg-luxury-gold text-black px-6 py-2.5 rounded-xl text-sm font-luxury font-bold hover:bg-luxury-gold-hover transition-all shadow-lg"
          >
            ADD NEW PRODUCT
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white/[0.02] border border-luxury-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Filter by product name, ID, or category..."
            className="w-full bg-white/[0.03] border border-luxury-border rounded-xl py-2 pl-12 pr-4 text-sm focus:outline-none focus:border-luxury-gold/30"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset page to 1 when searching
            }}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-luxury-border rounded-xl text-xs font-bold">
            <Filter size={14} />
            CATEGORIES
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-luxury-border rounded-xl text-xs font-bold">
            PRICE RANGE
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-luxury-border rounded-xl text-xs font-bold">
            STOCK STATUS
          </button>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-20">
          <Loader />
        </div>
      ) : (
        <div className="space-y-4">
          <ProductTable 
            products={products} 
            onDelete={handleDeleteProduct}
            onEdit={handleEditProduct}
            onView={handleViewProduct}
          />
          
          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button 
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-luxury-border rounded-xl text-sm font-bold bg-white/[0.02] hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm font-bold text-luxury-text-secondary">
                Page {page} of {pages}
              </span>
              <button 
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-4 py-2 border border-luxury-border rounded-xl text-sm font-bold bg-white/[0.02] hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

