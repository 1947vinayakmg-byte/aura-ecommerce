import React from 'react';
import { Search, Filter, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { cn } from '../../utils/cn';

interface ProductFiltersProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSearchChange: (value: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ viewMode, onViewModeChange, onSearchChange }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
      <div className="flex-1 w-full">
        <Input
          placeholder="Search products by name, SKU, or category..."
          icon={<Search size={18} />}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-white/[0.02]"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex items-center p-1 bg-white/[0.03] border border-luxury-border rounded-xl">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "p-2 rounded-lg transition-all",
              viewMode === 'grid' ? "bg-luxury-gold text-black shadow-lg" : "text-luxury-text-secondary hover:text-white"
            )}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              "p-2 rounded-lg transition-all",
              viewMode === 'list' ? "bg-luxury-gold text-black shadow-lg" : "text-luxury-text-secondary hover:text-white"
            )}
          >
            <List size={18} />
          </button>
        </div>

        <Button variant="secondary" className="gap-2 py-3">
          <Filter size={18} />
          Filter
        </Button>
        
        <Button variant="secondary" className="gap-2 py-3 hidden sm:flex">
          <SlidersHorizontal size={18} />
          Sort
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;
