import API from './api';
import { Product } from '../types';

export const productService = {
  /**
   * Fetches all products.
   */
  getAllProducts: async (): Promise<Product[]> => {
    const { data } = await API.get('/products');
    return data.products;
  },

  /**
   * Fetches a single product by ID.
   */
  getProductById: async (id: string): Promise<Product | undefined> => {
    const { data } = await API.get(`/products/${id}`);
    return data;
  },

  /**
   * Fetches products by category.
   */
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const { data } = await API.get(`/products?category=${category}`);
    return data.products;
  },

  /**
   * Searches for products.
   */
  searchProducts: async (query: string): Promise<Product[]> => {
    const { data } = await API.get(`/products?keyword=${query}`);
    return data.products;
  }
};

