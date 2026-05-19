import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { formatImageUrl } from '../../utils/formatImageUrl';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, "M", "Black");
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.countInStock === 0 || product.isHidden) return;
    navigate('/checkout', { 
      state: { 
        instantBuyProduct: { ...product, quantity: 1, selectedSize: "M", selectedColor: "Black" } 
      } 
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/product/${product._id || product.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on AURA L'ÉLITE`,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden"
    >
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id || product.id}`} className="block overflow-hidden relative">
          <div className="aspect-3/4 overflow-hidden bg-luxury-dark">
            <img
              src={formatImageUrl(product.image || (product.images && product.images[0]))}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNewProduct && (
              <span className="bg-primary text-luxury-black text-[10px] px-2 py-1 font-bold tracking-widest uppercase shadow-lg">New</span>
            )}
            {product.isTrending && (
              <span className="bg-luxury-gold text-white text-[10px] px-2 py-1 font-bold tracking-widest uppercase shadow-lg">Trending</span>
            )}
          </div>

          {/* Sold Out / Archived Badge */}
          {product.isHidden ? (
            <div className="absolute top-4 right-4">
              <span className="bg-red-900/80 backdrop-blur-md text-white border border-red-500/30 text-[10px] px-3 py-1.5 font-bold tracking-[0.2em] uppercase shadow-xl">
                Archived
              </span>
            </div>
          ) : product.countInStock === 0 && (
            <div className="absolute top-4 right-4">
              <span className="bg-red-900/80 backdrop-blur-md text-white border border-red-500/30 text-[10px] px-3 py-1.5 font-bold tracking-[0.2em] uppercase shadow-xl">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        {/* Quick Actions (Always visible on mobile/touch, hover-animated on desktop) */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10 transition-all duration-300 translate-y-0 opacity-100 lg:translate-y-12 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-primary text-luxury-black flex items-center justify-center hover:bg-luxury-gold hover:text-white transition-all duration-300 shadow-xl"
            title="Share Piece"
          >
            <Share2 size={16} />
          </button>
          <button
            onClick={handleWishlist}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
              isInWishlist(product._id || product.id || '') ? "bg-luxury-gold text-white" : "bg-primary text-luxury-black hover:bg-luxury-gold hover:text-white"
            )}
            title="Add to Vault"
          >
            <Heart size={16} fill={isInWishlist(product._id || product.id || '') ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0 || product.isHidden}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl",
              (product.countInStock === 0 || product.isHidden)
                ? "bg-[#2A2A2A] text-gray-500 cursor-not-allowed" 
                : "bg-primary text-luxury-black hover:bg-luxury-gold hover:text-white"
            )}
            title={product.isHidden ? "Archived" : (product.countInStock === 0 ? "Out of Stock" : "Add to Bag")}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>


      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-display tracking-widest mb-1 group-hover:text-luxury-gold transition-colors">
            {product.name}
          </h3>
          <p className="text-secondary text-xs uppercase tracking-tighter">{product.category}</p>
        </div>
        <p className="text-sm font-medium tracking-wide">₹{product.price.toLocaleString()}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-primary/5 flex gap-2">
        <button
          onClick={handleBuyNow}
          disabled={product.countInStock === 0 || product.isHidden}
          className={cn(
            "w-full py-2.5 px-4 bg-transparent hover:bg-luxury-gold border border-luxury-gold/50 hover:border-luxury-gold text-luxury-gold hover:text-black text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 rounded-sm flex items-center justify-center gap-2 group/buy shadow-[0_0_15px_rgba(212,175,55,0.05)]",
            (product.countInStock === 0 || product.isHidden) && "opacity-50 cursor-not-allowed border-gray-600 text-gray-500 hover:bg-transparent hover:text-gray-500 hover:border-gray-600"
          )}
        >
          {product.isHidden ? 'ARCHIVED' : (product.countInStock === 0 ? 'Sold Out' : 'BUY NOW')}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
