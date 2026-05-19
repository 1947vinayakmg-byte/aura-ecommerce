import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Upload, 
  Save, 
  X, 
  Info,
  IndianRupee,
  Package,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { getProduct, updateProduct } from '../../services/productService';
import { uploadImage, uploadMultipleImages } from '../../services/uploadService';
import { cn } from '../../utils/utils';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import ProductImageUpload from '../../components/products/ProductImageUpload';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  // Single image upload states (added as requested)
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    countInStock: '',
    sku: '',
    brand: '',
    sizes: '',
    colors: '',
    status: 'active' as 'active' | 'draft' | 'archived'
  });

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const product = await getProduct(id);
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          countInStock: (product.countInStock || product.stock || 0).toString(),
          sku: product.sku || '',
          brand: product.brand || '',
          sizes: product.sizes?.join(', ') || '',
          colors: product.colors?.join(', ') || '',
          status: product.status || 'active'
        });
        setImages(product.images || [product.image].filter(Boolean) || []);
      } catch (error) {
        console.error('Failed to fetch product', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const uploadMultipleFilesHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const toastId = toast.loading('Uploading images to cloud...');
    try {
      const imageUrls = await uploadMultipleImages(files);
      setImages(prev => [...prev, ...imageUrls]);
      toast.success(`${imageUrls.length} image(s) uploaded successfully!`, { id: toastId });
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Failed to upload images', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    const toastId = toast.loading('Updating product...');
    try {
      await updateProduct(id, {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: formData.colors ? formData.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
        image: images[0] || '',
        images
      });
      toast.success('Masterpiece refined successfully!', { id: toastId });
      navigate('/products');
    } catch (error: any) {
      console.error('Failed to update product', error.response?.data || error);
      const errorMessage = error.response?.data?.message || 'Failed to refine the masterpiece. Please try again.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <button 
            onClick={() => navigate(`/products/${id}`)}
            className="text-luxury-gold flex items-center gap-2 text-sm font-bold tracking-widest hover:translate-x-[-4px] transition-transform"
          >
            <ChevronLeft size={16} /> BACK TO PRODUCT
          </button>
          <h1 className="text-3xl font-display font-bold mt-2">Refine Masterpiece</h1>
          <p className="text-luxury-text-secondary text-sm">Editing {formData.name}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/products/${id}`)}
            className="px-6 py-3 text-sm font-bold text-luxury-text-secondary hover:text-white transition-colors"
          >
            CANCEL
          </button>
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="luxury-button-primary flex items-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : <Save size={18} />}
            SAVE CHANGES
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <div className="glass-card p-8 space-y-6">
            <h3 className="font-display font-bold text-xl flex items-center gap-2 border-b border-luxury-border pb-4">
              <Info size={20} className="text-luxury-gold" /> GENERAL INFORMATION
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Product Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  className="w-full luxury-input"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Description</label>
                <textarea 
                  name="description"
                  required
                  rows={6}
                  className="w-full luxury-input resize-none"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-luxury-border pb-4">
              <h3 className="font-display font-bold text-xl flex items-center gap-2">
                <ImageIcon size={20} className="text-luxury-gold" /> MEDIA ASSETS
              </h3>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={uploadMultipleFilesHandler}
                  disabled={uploading}
                  className="w-full luxury-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-luxury-gold file:text-black hover:file:bg-luxury-gold/80 cursor-pointer transition-all"
                />
              </div>

              {uploading && (
                <p className="text-luxury-gold text-sm font-bold animate-pulse">
                  Uploading images to cloud...
                </p>
              )}

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-luxury-border group">
                      <img
                        src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                        alt={`preview ₹{idx}`}
                        className="w-full h-full object-cover bg-black/20"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status and Pricing Sidebar */}
        <div className="space-y-8">
          {/* Organization */}
          <div className="glass-card p-8 space-y-6">
            <h3 className="font-display font-bold text-xl flex items-center gap-2 border-b border-luxury-border pb-4">
              <Layers size={20} className="text-luxury-gold" /> ORGANIZATION
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Status</label>
                <select 
                  name="status"
                  required
                  className="w-full luxury-input appearance-none bg-no-repeat bg-[right_1rem_center]"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active" className="bg-[#121212] text-white">Active</option>
                  <option value="draft" className="bg-[#121212] text-white">Draft</option>
                  <option value="archived" className="bg-[#121212] text-white">Archived</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Category</label>
                <select 
                  name="category"
                  required
                  className="w-full luxury-input appearance-none bg-no-repeat bg-[right_1rem_center]"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="apparel" className="bg-[#121212] text-white">Apparel</option>
                  <option value="accessories" className="bg-[#121212] text-white">Accessories</option>
                  <option value="jewelry" className="bg-[#121212] text-white">Jewelry</option>
                  <option value="footwear" className="bg-[#121212] text-white">Footwear</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">SKU</label>
                <input 
                  type="text" 
                  name="sku"
                  className="w-full luxury-input"
                  value={formData.sku}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Brand</label>
                <input 
                  type="text" 
                  name="brand"
                  required
                  placeholder="Aura L'Élite"
                  className="w-full luxury-input"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Sizes (Comma Separated)</label>
                <input 
                  type="text" 
                  name="sizes"
                  placeholder="e.g. S, M, L, XL"
                  className="w-full luxury-input"
                  value={formData.sizes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Colors (Comma Separated)</label>
                <input 
                  type="text" 
                  name="colors"
                  placeholder="e.g. Black, White, Gold"
                  className="w-full luxury-input"
                  value={formData.colors}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="glass-card p-8 space-y-6">
            <h3 className="font-display font-bold text-xl flex items-center gap-2 border-b border-luxury-border pb-4">
              <IndianRupee size={20} className="text-luxury-gold" /> PRICING & STOCK
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Price (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary" size={16} />
                  <input 
                    type="number" 
                    name="price"
                    required
                    className="w-full luxury-input pl-10"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-luxury-text-secondary tracking-widest uppercase pl-1">Stock Quantity</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text-secondary" size={16} />
                  <input 
                    type="number" 
                    name="countInStock"
                    required
                    className="w-full luxury-input pl-10"
                    value={formData.countInStock}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
