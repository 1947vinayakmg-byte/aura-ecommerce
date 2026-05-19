import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import API from '../../services/api';
import toast from 'react-hot-toast';

interface ProductImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({ 
  images, 
  onChange, 
  maxImages = 4 
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await API.post('/upload', formData, config);
      
      // Update parent state
      onChange([...images, data.imageUrl]);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative aspect-square rounded-xl overflow-hidden border border-luxury-border group"
            >
              <img src={img.startsWith('http') ? img : `http://localhost:5000${img}`} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {images.length < maxImages && (
          <label className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-luxury-border rounded-xl hover:border-luxury-gold/50 hover:bg-luxury-gold/5 transition-all cursor-pointer group relative overflow-hidden">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 size={24} className="text-luxury-gold animate-spin" />
                <span className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest">Uploading...</span>
              </div>
            ) : (
              <>
                <div className="p-3 bg-white/5 rounded-full group-hover:bg-luxury-gold/10 transition-colors">
                  <Upload size={20} className="text-luxury-text-secondary group-hover:text-luxury-gold transition-colors" />
                </div>
                <span className="text-[10px] font-bold text-luxury-text-secondary group-hover:text-luxury-gold uppercase tracking-widest">
                  Upload
                </span>
              </>
            )}
            <input 
              type="file" 
              className="hidden" 
              onChange={uploadFileHandler}
              accept="image/*" 
              disabled={uploading}
            />
          </label>
        )}
      </div>
      
      <p className="text-[10px] text-luxury-text-secondary leading-relaxed px-1">
        Supports JPG, PNG, WebP up to 5MB. Recommended size: 1000x1000px.
      </p>
    </div>
  );
};

export default ProductImageUpload;

