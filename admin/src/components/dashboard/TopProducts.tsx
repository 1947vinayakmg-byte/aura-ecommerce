import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ShoppingBag, Eye } from 'lucide-react';
import { getProducts } from '../../services/productService';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  totalSold: number;
  totalRevenue: number;
  image?: string;
  images?: string[];
}

const TopProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const data = await getProducts('', 1);
        const allProducts = data.products || [];
        
        // Sort products by total units sold descending
        const sorted = [...allProducts].sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0));
        
        // Take the top 4 best sellers
        setProducts(sorted.slice(0, 4));
      } catch (error) {
        console.error('Failed to load best selling products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-8 flex items-center justify-between border-b border-luxury-border">
        <h3 className="text-xl font-display font-bold text-white">Best Selling Masterpieces</h3>
        <button 
          onClick={() => navigate('/products')}
          className="text-xs font-bold text-luxury-gold hover:underline uppercase tracking-widest"
        >
          VIEW ALL
        </button>
      </div>
      
      <div className="divide-y divide-luxury-border">
        {products.length === 0 ? (
          <div className="p-8 text-center text-luxury-text-secondary italic text-sm">
            No sales recorded yet.
          </div>
        ) : (
          products.map((product, index) => {
            const productImg = product.images && product.images.length > 0 
              ? product.images[0] 
              : product.image || 'https://placehold.co/200x200?text=Aura';
              
            return (
              <motion.div 
                key={product._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/products/${product._id}`)}
                className="p-6 flex items-center gap-6 hover:bg-white/5 transition-colors group cursor-pointer"
              >
                {/* Product Thumbnail */}
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-luxury-border group-hover:border-luxury-gold transition-colors">
                  <img 
                    src={productImg} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-luxury-gold transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-luxury-text-secondary mt-1 uppercase tracking-wider">
                    {product.category}
                  </p>
                </div>
                
                {/* Sales stats */}
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white">₹{(product.totalRevenue || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-luxury-text-secondary mt-1">{(product.totalSold || 0)} Units Sold</p>
                </div>
                
                <div className="p-2 text-luxury-text-secondary group-hover:text-white">
                  <Eye size={16} />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TopProducts;
