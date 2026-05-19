import api from './api';
import { Order, OrderStatus } from '../types/order';

export const orderService = {
  getAllOrders: async () => {
    const { data } = await api.get('/orders/all');
    return data;
  },

  getOrder: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  deliverOrder: async (id: string) => {
    const response = await api.put(`/orders/${id}/deliver`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};

