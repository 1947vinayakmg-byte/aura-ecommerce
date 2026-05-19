import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';

const Cart = () => {
  const { cart, totalPrice } = useCart();

  return (
    <main className="pt-12 pb-24 px-6 md:px-12 bg-luxury-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-primary/5 pb-12">
          <div>
            <h1 className="text-4xl md:text-7xl font-display mb-4 tracking-[0.1em]">THE BAG</h1>
            <p className="text-secondary text-sm tracking-[0.3em] uppercase italic">A selection of your future acquisitions</p>
          </div>
          <Link to="/shop" className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-luxury-gold pb-2 hover:text-luxury-gold transition-colors">
            Continue Selecting
          </Link>
        </header>

        {cart.length === 0 ? (
          <EmptyState 
            icon={ShoppingBag}
            title="The Bag is Vacant"
            description="Your personal collection is currently empty. Explore our latest volumes to find pieces that define your presence."
            actionLabel="Explore Collections"
            actionPath="/shop"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <CartItem key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="relative">
              <CartSummary totalPrice={totalPrice} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
