import { Link } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

interface CartSummaryProps {
  totalPrice: number;
}

const CartSummary = ({ totalPrice }: CartSummaryProps) => {
  const shipping = totalPrice > 1000 ? 0 : 50;
  const total = totalPrice + shipping;

  return (
    <div className="bg-luxury-card p-10 glass rounded-sm sticky top-12">
      <h3 className="text-xs uppercase tracking-[0.4em] font-black mb-10 border-b border-primary/10 pb-6">ACQUISITION SUMMARY</h3>
      
      <div className="space-y-6 mb-12">
        <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase">
          <span className="text-secondary font-medium">ESTATE SUBTOTAL</span>
          <span className="font-mono">₹{totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase">
          <span className="text-secondary font-medium">GLOBAL LOGISTICS</span>
          <span className="font-mono">{shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}.00`}</span>
        </div>
      </div>

      <div className="flex justify-between items-end border-t border-primary/10 pt-10 mb-12">
        <span className="text-[10px] uppercase tracking-[0.6em] font-black">TOTAL INVESTMENT</span>
        <span className="text-3xl font-display tracking-widest text-luxury-gold">₹{total.toLocaleString()}</span>
      </div>

      <Link to="/checkout" className="block w-full mb-8">
        <Button variant="gold" size="lg" className="w-full py-6" icon={<Lock size={14} />}>
          PROCEED TO SECURE CHECKOUT
        </Button>
      </Link>

      <div className="flex items-center justify-center gap-3 text-secondary text-[9px] uppercase tracking-widest px-8 text-center leading-loose opacity-60">
        <ShieldCheck size={12} className="text-luxury-gold" />
        Transaction secured with 256-bit military-grade encryption.
      </div>
    </div>
  );
};

export default CartSummary;
