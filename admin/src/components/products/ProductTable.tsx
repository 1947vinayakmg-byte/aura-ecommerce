import React from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Eye, Package, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Product } from '../../types/product';
import { Table, THead, TBody, TR, TH, TD } from '../common/Tables';
import { cn } from '../../utils/cn';
import Button from '../common/Button';
import { Link } from 'react-router-dom';

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onView?: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete, onView }) => {
  const statusColors = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    draft: 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20',
    archived: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <THead>
          <TR>
            <TH className="w-16 text-center">Image</TH>
            <TH>Product Name</TH>
            <TH>Category</TH>
            <TH>Price</TH>
            <TH>Stock</TH>
            <TH>Units Sold</TH>
            <TH>Status</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {products.length === 0 ? (
            <TR>
              <TD colSpan={8} className="text-center py-10 text-luxury-text-secondary">
                No products found. Start by adding a new one.
              </TD>
            </TR>
          ) : (
            products.map((product, index) => (
              <motion.tr
                key={product._id || product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onView?.(product)}
                className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <TD>
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-luxury-border group-hover:border-luxury-gold/50 transition-colors mx-auto">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/100x100?text=Aura'} 
                      alt={product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </TD>
                <TD>
                  <div className="font-bold text-white group-hover:text-luxury-gold transition-colors">{product.name}</div>
                  <div className="text-xs text-luxury-text-secondary uppercase font-mono">{product.sku}</div>
                </TD>
                <TD>
                  <span className="px-2 py-1 bg-white/5 rounded-lg text-xs font-medium text-luxury-text-secondary border border-luxury-border capitalize">
                    {product.category}
                  </span>
                </TD>
                <TD className="font-bold text-white">₹{product.price.toLocaleString()}</TD>
                <TD>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        product.countInStock > 50 ? "bg-green-500" : product.countInStock > 10 ? "bg-luxury-gold" : "bg-red-500"
                      )} />
                      <span className="text-sm font-medium">{product.countInStock}</span>
                    </div>
                    {product.countInStock < 5 && (
                      <span className="text-red-500 text-[10px] font-bold tracking-widest uppercase pl-3">
                        Low Stock
                      </span>
                    )}
                  </div>
                </TD>
                <TD className="font-bold text-luxury-gold">
                  {product.totalSold || 0}
                </TD>
                <TD>
                  <span className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                    statusColors[product.status as keyof typeof statusColors] || statusColors.active
                  )}>
                    {product.status || 'active'}
                  </span>
                </TD>
                <TD className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); onView?.(product); }} 
                      className="w-8 h-8 rounded-lg opacity-40 hover:opacity-100 transition-opacity"
                    >
                      <Eye size={16} />
                    </Button>
                    <Link 
                      to={`/products/edit/${product._id || product.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-luxury-text-secondary hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-lg transition-all opacity-40 group-hover:opacity-100"
                    >
                      <Edit size={16} />
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); onDelete?.(product._id || product.id); }} 
                      className="w-8 h-8 rounded-lg hover:text-red-500 opacity-40 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TD>
              </motion.tr>
            ))
          )}
        </TBody>
      </Table>
    </div>
  );
};

export default ProductTable;
