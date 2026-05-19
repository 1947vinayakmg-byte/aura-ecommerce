import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { formatImageUrl } from '../../utils/formatImageUrl';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductGalleryProps {
  images: string[];
  name: string;
}

const ProductGallery = ({ images = [], name }: ProductGalleryProps) => {
  const [activeImage, setActiveImage] = useState(0);

  const displayImages = images.length > 0 ? images : ["https://via.placeholder.com/800"];

  const nextImage = () => setActiveImage((prev) => (prev + 1) % displayImages.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);


  return (
    <div className="relative group">
      <div className="aspect-[3/4] overflow-hidden bg-luxury-dark relative border border-white/5">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            src={formatImageUrl(displayImages[activeImage])}
            alt={name}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {displayImages.length > 1 && (
          <>
            <button 
              onClick={prevImage} 
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImage} 
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {displayImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={cn(
              "aspect-square overflow-hidden border-2 transition-all duration-500",
              activeImage === idx ? "border-luxury-gold scale-95" : "border-transparent opacity-40 hover:opacity-100"
            )}
          >
            <img src={formatImageUrl(img)} alt="" className="w-full h-full object-cover" />
          </button>
        ))}

      </div>
    </div>
  );
};

export default ProductGallery;
