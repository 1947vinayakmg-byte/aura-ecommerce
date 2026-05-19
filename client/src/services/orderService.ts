import api from './api';

export const orderService = {
  /**
   * Fetches order history for the logged in user.
   */
  getMyOrders: async (): Promise<any[]> => {
    const response = await api.get('/orders/myorders');
    return response.data;
  },

  /**
   * Fetches details for a specific order.
   */
  getOrderDetails: async (id: string): Promise<any> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
};
