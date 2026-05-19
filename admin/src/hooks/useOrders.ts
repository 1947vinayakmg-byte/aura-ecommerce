import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../types/order';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
      return true;
    } catch (err) {
      setError('Failed to update order status');
      return false;
    }
  };

  return {
    orders,
    loading,
    error,
    refresh: fetchOrders,
    updateStatus
  };
};
