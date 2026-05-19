import { motion, AnimatePresence } from 'motion/react';
import ProductCard from './ProductCard';
import { Product } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductGridProps {
  products: Product[];
  viewCols?: 2 | 3;
}

const ProductGrid = ({ products, viewCols = 3 }: ProductGridProps) => {
  return (
    <div className={cn(
      "grid gap-x-8 gap-y-16 transition-all duration-700",
      viewCols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    )}>
      <AnimatePresence mode="popLayout">
        {products.map((product, idx) => (
          <motion.div
            key={product._id || product.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: 0.8, 
              delay: idx * 0.05,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProductGrid;
