import React from 'react';
import { motion } from 'motion/react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-8 py-10 border-b border-primary/5 group"
    >
      <div className="w-32 h-44 overflow-hidden bg-luxury-dark rounded-sm">
        <img
          src={item.image || (item.images && item.images[0]) || "https://via.placeholder.com/500"}
          alt={item.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between py-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-display tracking-[0.2em] mb-2 uppercase flex items-center gap-2">
              {item.name}
              {item.isHidden && <span className="bg-red-500/20 text-red-500 text-[8px] px-2 py-0.5 border border-red-500/30">ARCHIVED</span>}
            </h3>
            <p className="text-[10px] text-secondary uppercase tracking-widest mb-4">{item.category}</p>
            <div className="flex gap-6 text-[9px] uppercase tracking-widest font-bold">
              <span>Size: <span className="text-primary">{item.selectedSize}</span></span>
              <span>Color: <div className="inline-block w-2 h-2 rounded-full align-middle ml-1" style={{ backgroundColor: item.selectedColor }} /></span>
            </div>
          </div>
          <button
            onClick={() => removeFromCart(item._id || item.id || '', item.selectedSize, item.selectedColor)}
            className="text-secondary hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex justify-between items-end">
          {item.isHidden ? (
            <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold">UNAVAILABLE</p>
          ) : (
            <div className="flex items-center border border-primary/10 rounded-sm">
              <button
                onClick={() => updateQuantity(item._id || item.id || '', item.selectedSize, item.selectedColor, item.quantity - 1)}
                className="p-3 text-secondary hover:text-primary transition-colors disabled:opacity-20"
                disabled={item.quantity <= 1}
              >
                <Minus size={12} />
              </button>
              <span className="w-10 text-center text-[10px] font-bold font-mono tracking-widest">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id || item.id || '', item.selectedSize, item.selectedColor, item.quantity + 1)}
                className="p-3 text-secondary hover:text-primary transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
          )}
          <p className="text-sm font-mono tracking-widest">₹{((item.price || 0) * item.quantity).toLocaleString()}</p>

        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
