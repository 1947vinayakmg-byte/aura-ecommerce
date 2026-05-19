import React from 'react';
import { Order } from '../../types/order';
import Modal from '../common/Modal';
import Button from '../common/Button';
import OrderStatusBadge from './OrderStatusBadge';
import { Package, Truck, MapPin, CreditCard, Printer, Mail } from 'lucide-react';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${order.id}`} maxWidth="2xl">
      <div className="space-y-8">
        {/* Status & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/5 rounded-2xl border border-luxury-border">
          <div className="flex items-center gap-4">
            <OrderStatusBadge status={order.status} />
            <span className="text-xs text-luxury-text-secondary uppercase tracking-widest">
              Placed on {order.createdAt}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Printer size={14} /> Print
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
              <Mail size={14} /> Contact
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-luxury-gold uppercase tracking-[0.2em] flex items-center gap-2">
              <Package size={14} /> Customer Details
            </h4>
            <div className="glass-card p-5 bg-white/[0.02]">
              <p className="font-bold text-white text-lg">{order.customerName}</p>
              <p className="text-sm text-luxury-text-secondary mt-1">{order.customerEmail}</p>
              <div className="mt-4 pt-4 border-t border-luxury-border space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="text-luxury-gold mt-0.5 shrink-0" />
                  <span className="text-luxury-text-secondary leading-relaxed">
                    {order.shippingAddress.street}, {order.shippingAddress.city}<br />
                    {order.shippingAddress.state}, {order.shippingAddress.zip}, {order.shippingAddress.country}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-luxury-gold uppercase tracking-[0.2em] flex items-center gap-2">
              <CreditCard size={14} /> Payment Information
            </h4>
            <div className="glass-card p-5 bg-white/[0.02] space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-luxury-text-secondary">Payment Method</span>
                <span className="text-sm font-bold text-white">Credit Card (Visa)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-luxury-text-secondary">Status</span>
                <span className={`text-xs font-bold uppercase ₹{order.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="pt-4 border-t border-luxury-border flex justify-between items-center">
                <span className="text-sm text-luxury-text-secondary">Total Amount</span>
                <span className="text-xl font-bold text-luxury-gold">₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-luxury-gold uppercase tracking-[0.2em] flex items-center gap-2">
            <Truck size={14} /> Order Items
          </h4>
          <div className="glass-card overflow-hidden bg-white/[0.02]">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-luxury-border">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest">Product</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest">Price</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest text-center">Qty</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-luxury-text-secondary uppercase tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-border/50">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} className="w-10 h-10 rounded-lg object-cover border border-luxury-border" alt="" />
                        <span className="text-sm font-medium text-white">{item.productName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-luxury-text-secondary">₹{item.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-luxury-text-secondary text-center">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm font-bold text-white text-right">₹{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
