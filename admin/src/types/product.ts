export interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  countInStock: number;
  image: string;
  images: string[];
  status: 'active' | 'draft' | 'archived';
  sku: string;
  brand: string;
  rating: number;
  numReviews: number;
  newProducts: boolean;
  isTrending: boolean;
  createdAt: string;
  updatedAt: string;
  totalSold?: number;
  totalRevenue?: number;
  last30DaysSold?: number;
  recentOrders?: any[];
}

export interface ProductFilters {
  search: string;
  category: string;
  status: string;
  minPrice?: number;
  maxPrice?: number;
}
