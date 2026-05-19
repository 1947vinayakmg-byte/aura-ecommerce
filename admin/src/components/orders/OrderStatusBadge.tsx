import React from 'react';
import { OrderStatus } from '../../types/order';
import { cn } from '../../utils/cn';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const styles: Record<OrderStatus, string> = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    processing: 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20',
    shipped: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
    refunded: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] border backdrop-blur-sm",
      styles[status]
    )}>
      {status}
    </span>
  );
};

export default OrderStatusBadge;
