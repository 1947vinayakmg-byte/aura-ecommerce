import React from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Eye, MoreVertical, Package } from 'lucide-react';
import { Product } from '../../types/product';
import { cn } from '../../utils/cn';
import Button from '../common/Button';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onView }) => {
  const statusColors = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    draft: 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20',
    archived: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card group overflow-hidden flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-white/5">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1581555129602-039d91ee2c59?q=80&w=400&auto=format&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button variant="icon" size="sm" onClick={() => onView?.(product)} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white text-black">
            <Eye size={18} />
          </Button>
          <Button variant="icon" size="sm" onClick={() => onEdit?.(product)} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-luxury-gold text-black">
            <Edit size={18} />
          </Button>
        </div>
        
        <div className={cn(
          "absolute top-4 left-4 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md",
          statusColors[product.status]
        )}>
          {product.status}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.2em] mb-1">
              {product.category}
            </p>
            <h3 className="text-lg font-display font-bold text-white truncate group-hover:text-luxury-gold transition-colors">
              {product.name}
            </h3>
          </div>
          <button className="text-luxury-text-secondary hover:text-white transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>

        <p className="text-sm text-luxury-text-secondary mt-2 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto pt-5 flex items-center justify-between border-t border-luxury-border/50">
          <div className="flex flex-col">
            <span className="text-xs text-luxury-text-secondary uppercase tracking-wider">Price</span>
            <span className="text-xl font-bold text-white">₹{product.price.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-luxury-text-secondary">
            <Package size={16} />
            <span className={cn("text-xs font-bold", product.stock < 10 ? "text-red-400" : "text-luxury-text-secondary")}>
              {product.stock} in stock
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
