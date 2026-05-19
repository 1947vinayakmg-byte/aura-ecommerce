import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Table, THead, TBody, TR, TH, TD } from '../common/Tables';
import { cn } from '../../utils/cn';
import { orderService } from '../../services/orderService';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const statusStyles: Record<string, string> = {
  delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
  processing: 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20',
  shipped: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const RecentOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        // Show only the 5 most recent orders
        setOrders(data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch recent orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="glass-card">
      <div className="p-8 flex items-center justify-between border-b border-luxury-border">
        <h3 className="text-xl font-display font-bold text-white">Recent Orders</h3>
        <Link to="/orders" className="text-xs font-bold text-luxury-gold hover:underline uppercase tracking-widest">
          VIEW ALL ORDERS
        </Link>
      </div>

      <div className="overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-luxury-text-secondary italic">
            No orders found in the collection.
          </div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Customer</TH>
                <TH>Order ID</TH>
                <TH>Date</TH>
                <TH>Amount</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {orders.map((order, index) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <TD>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold font-display font-bold text-xs">
                        {(order.user?.name || 'G').charAt(0)}
                      </div>
                      <span className="font-medium text-white group-hover:text-luxury-gold transition-colors">{order.user?.name || 'Guest User'}</span>
                    </div>
                  </TD>
                  <TD className="text-luxury-text-secondary font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</TD>
                  <TD className="text-luxury-text-secondary">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TD>
                  <TD className="font-bold text-white">₹{order.totalPrice?.toLocaleString()}</TD>
                  <TD>
                    <select
                      value={order.status || 'Pending'}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={cn(
                        "bg-transparent border-none text-[10px] font-bold tracking-wider uppercase focus:ring-0 cursor-pointer p-0 outline-none",
                        order.status?.toLowerCase() === 'delivered' ? "text-green-500" :
                        order.status?.toLowerCase() === 'shipped' ? "text-blue-400" :
                        order.status?.toLowerCase() === 'processing' ? "text-luxury-gold" :
                        order.status?.toLowerCase() === 'cancelled' ? "text-red-500" : "text-amber-500"
                      )}
                    >
                      <option value="Pending" className="bg-[#121212] text-amber-500">Pending</option>
                      <option value="Processing" className="bg-[#121212] text-luxury-gold">Processing</option>
                      <option value="Shipped" className="bg-[#121212] text-blue-400">Shipped</option>
                      <option value="Delivered" className="bg-[#121212] text-green-500">Delivered</option>
                      <option value="Cancelled" className="bg-[#121212] text-red-500">Cancelled</option>
                    </select>
                  </TD>
                </motion.tr>
              ))}
            </TBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
