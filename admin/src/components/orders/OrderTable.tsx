import React from 'react';
import { motion } from 'motion/react';
import { Eye, Download, MoreHorizontal, User, Calendar, CreditCard } from 'lucide-react';
import { Order } from '../../types/order';
import { Table, THead, TBody, TR, TH, TD } from '../common/Tables';
import OrderStatusBadge from './OrderStatusBadge';
import { cn } from '../../utils/cn';
import Button from '../common/Button';

interface OrderTableProps {
  orders: Order[];
  onView?: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onView }) => {
  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <THead>
          <TR>
            <TH>Order ID</TH>
            <TH>Customer</TH>
            <TH>Date</TH>
            <TH>Total</TH>
            <TH>Payment</TH>
            <TH>Status</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {orders.map((order, index) => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group hover:bg-white/[0.02] transition-colors"
            >
              <TD>
                <span className="font-mono text-sm text-luxury-gold font-bold">#{order.id}</span>
              </TD>
              <TD>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-luxury-border flex items-center justify-center text-luxury-text-secondary group-hover:border-luxury-gold/50 transition-colors">
                    <User size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{order.customerName}</div>
                    <div className="text-[10px] text-luxury-text-secondary uppercase tracking-wider">{order.customerEmail}</div>
                  </div>
                </div>
              </TD>
              <TD>
                <div className="flex items-center gap-2 text-luxury-text-secondary">
                  <Calendar size={14} />
                  <span className="text-sm">{order.createdAt}</span>
                </div>
              </TD>
              <TD className="font-bold text-white">₹{order.totalAmount.toLocaleString()}</TD>
              <TD>
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className={order.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'} />
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    order.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'
                  )}>
                    {order.paymentStatus}
                  </span>
                </div>
              </TD>
              <TD>
                <OrderStatusBadge status={order.status} />
              </TD>
              <TD className="text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => onView?.(order)} className="w-8 h-8">
                    <Eye size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Download size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreHorizontal size={16} />
                  </Button>
                </div>
              </TD>
            </motion.tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default OrderTable;
