import React from 'react';
import { Product } from '../../types/product';
import Input from '../common/Input';
import Button from '../common/Button';
import ProductImageUpload from './ProductImageUpload';
import { Package, Tag, IndianRupee, Layers, Hash } from 'lucide-react';

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, isLoading }) => {
  return (
    <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onSubmit({}); }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - General Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 space-y-6">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
              <Package className="text-luxury-gold" size={24} />
              General Information
            </h3>
            
            <Input
              label="Product Name"
              placeholder="e.g. Royal Sapphire Chronograph"
              defaultValue={initialData?.name}
              required
            />
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-luxury-text-secondary uppercase tracking-wider ml-1">
                Description
              </label>
              <textarea
                className="w-full bg-luxury-secondary-bg border border-luxury-border text-white text-sm rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:border-luxury-gold/50 focus:ring-4 focus:ring-luxury-gold/5 placeholder:text-luxury-text-secondary/50 min-h-[150px]"
                placeholder="Describe the luxury and features of this product..."
                defaultValue={initialData?.description}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Brand"
                placeholder="e.g. Vacheron Constantin"
                defaultValue={initialData?.brand}
                icon={<Tag size={18} />}
              />
              <Input
                label="SKU"
                placeholder="e.g. VC-7281-W"
                defaultValue={initialData?.sku}
                icon={<Hash size={18} />}
              />
            </div>
          </div>

          <div className="glass-card p-8 space-y-6">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
              <IndianRupee className="text-luxury-gold" size={24} />
              Pricing & Inventory
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Price (₹)"
                type="number"
                placeholder="0.00"
                defaultValue={initialData?.price}
                icon={<IndianRupee size={18} />}
              />
              <Input
                label="Stock Quantity"
                type="number"
                placeholder="0"
                defaultValue={initialData?.stock}
                icon={<Package size={18} />}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Media & Status */}
        <div className="space-y-6">
          <div className="glass-card p-8">
            <h3 className="text-xl font-display font-bold text-white mb-6">Product Status</h3>
            <div className="space-y-4">
              {['Active', 'Draft', 'Archived'].map((status) => (
                <label key={status} className="flex items-center gap-3 p-4 bg-white/5 border border-luxury-border rounded-xl cursor-pointer hover:bg-white/10 transition-colors group">
                  <input type="radio" name="status" value={status.toLowerCase()} className="w-4 h-4 accent-luxury-gold" defaultChecked={initialData?.status === status.toLowerCase()} />
                  <span className="text-sm font-medium text-white">{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
              <Layers className="text-luxury-gold" size={24} />
              Category
            </h3>
            <select className="w-full bg-luxury-secondary-bg border border-luxury-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-luxury-gold/50 appearance-none">
              <option value="watches">Watches</option>
              <option value="apparel">Apparel</option>
              <option value="jewelry">Jewelry</option>
              <option value="accessories">Accessories</option>
              <option value="fragrance">Fragrance</option>
            </select>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-display font-bold text-white mb-6">Media</h3>
            <ProductImageUpload 
              images={initialData?.images || []} 
              onChange={(newImages) => {/* Handle change if needed */}} 
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t border-luxury-border">
        <Button variant="ghost" type="button">Cancel</Button>
        <Button variant="primary" type="submit" isLoading={isLoading} className="px-12">
          {initialData ? 'Update Product' : 'Publish Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
