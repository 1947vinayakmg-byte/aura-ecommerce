import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ChevronRight, Lock, CreditCard, Wallet, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}
const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const instantBuyProduct = location.state?.instantBuyProduct;

  const checkoutItems = instantBuyProduct ? [instantBuyProduct] : cart;
  const checkoutTotal = instantBuyProduct ? (instantBuyProduct.price * instantBuyProduct.quantity) : totalPrice;
  
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });

  const [coupon, setCoupon] = useState("");
  const [couponStatus, setCouponStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [couponMessage, setCouponMessage] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'COD'>('Razorpay');

  useEffect(() => {
    if (!coupon.trim()) {
      setDiscount(0);
      setCouponStatus('idle');
      setCouponMessage("");
      return;
    }

    setCouponStatus('validating');

    const delayDebounce = setTimeout(async () => {
      try {
        const { data } = await API.post("/coupons/apply", { code: coupon.trim().toUpperCase() });
        setDiscount(data.discount);
        setCouponStatus('success');
        setCouponMessage(`Discount of ₹${data.discount.toLocaleString()} applied successfully.`);
      } catch (error) {
        setDiscount(0);
        setCouponStatus('error');
        setCouponMessage("Invalid or expired coupon code");
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(delayDebounce);
  }, [coupon]);

  const finalTotal = Math.max(0, checkoutTotal + (checkoutTotal > 1000 ? 0 : 50) - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to place an order");
      navigate('/login');
      return;
    }

    // Validation
    const pinRegex = /^[1-9]\d{5}$/;
    if (!pinRegex.test(shippingAddress.postalCode)) {
      alert("Please enter a valid 6-digit Indian Pin Code.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(shippingAddress.phone)) {
      alert("Please enter a valid 10-digit Indian phone number (starting with 6-9).");
      return;
    }

    try {
      setLoading(true);

      // CASH ON DELIVERY (COD) FLOW
      if (paymentMethod === 'COD') {
        const shippingPrice = checkoutTotal > 1000 ? 0 : 50;
        const taxPrice = 0;
        const itemsPrice = checkoutTotal;

        const { data: newOrder } = await API.post("/orders", {
          orderItems: checkoutItems.map((item: any) => ({
            name: item.name,
            qty: item.quantity,
            image: item.image || (item.images && item.images[0]),
            price: item.price,
            product: item._id || item.id,
          })),

          shippingAddress,

          paymentMethod: "COD",
          paymentResult: {
            id: `cod_${Date.now()}`,
            status: "pending",
            update_time: new Date().toISOString(),
            email_address: user.email
          },

          itemsPrice,
          taxPrice,
          shippingPrice,
          discount,
          totalPrice: finalTotal,
          isPaid: false,
          status: "Pending",
        });

        if (!instantBuyProduct) {
          clearCart();
        }
        navigate(`/cod-success/${newOrder._id}`, { state: { order: newOrder } });
        return;
      }

      // PREPAID (RAZORPAY) FLOW
      // 1. Create Razorpay Order on Backend
      const { data: rpOrder } = await API.post('/payment/order', {
        amount: finalTotal,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      });

     
      const options = {
  key: rpOrder.key,
  amount: rpOrder.amount,
  currency: rpOrder.currency,
  name: "AURA L'ÉLITE",
  description: "Exquisite Fashion Transaction",
  image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=100&auto=format&fit=crop",
  order_id: rpOrder.id,
  handler: async (response: any) => {
    try {
      setLoading(true);
      // Verify payment
      await API.post('/payment/verify', {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });

      // Create order in DB
      const shippingPrice = checkoutTotal > 1000 ? 0 : 50;
      const taxPrice = 0; // tax is not yet included in payment total
      const itemsPrice = checkoutTotal;

      const { data: newOrder } = await API.post("/orders", {
        orderItems: checkoutItems.map((item: any) => ({
          name: item.name,
          qty: item.quantity,
          image: item.image || (item.images && item.images[0]),
          price: item.price,
          product: item._id || item.id,
        })),

        shippingAddress,

        paymentMethod: "Razorpay",
        paymentResult: {
          id: response.razorpay_payment_id,
          status: "succeeded",
          update_time: new Date().toISOString(),
          email_address: user.email
        },

        itemsPrice,
        taxPrice,
        shippingPrice,
        discount,
        totalPrice: finalTotal,
        isPaid: true,
        paidAt: new Date(),
        status: "Pending",
      });

      if (!instantBuyProduct) {
        clearCart();
      }
      navigate(`/order-success/${newOrder._id}`, { state: { order: newOrder } });
    } catch (err) {
      console.error("Verification failed", err);
      alert("Payment verification failed.");
      setLoading(false);
    }
  },
  prefill: {
    name: user.name,
    email: user.email,
    contact: `+91${shippingAddress.phone}`,
  },
  theme: { color: "#D4AF37" },
};

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error("Checkout error", error);
      alert(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  return (
    <main className="pt-12 pb-20 px-6 md:px-12 bg-luxury-black min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-display mb-8 tracking-[0.2em]">ELITE CHECKOUT</h1>
          <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.4em] font-bold">
            <span className="text-luxury-gold">Shipping</span>
            <ChevronRight size={14} className="text-primary/10" />
            <span className="text-primary/20">Payment</span>
            <ChevronRight size={14} className="text-primary/10" />
            <span className="text-primary/20">Confirmation</span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-luxury-card p-10 glass rounded-sm"
            >
              <h2 className="text-xs uppercase tracking-[0.4em] font-bold mb-8 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full border border-luxury-gold flex items-center justify-center text-[10px]">1</span> 
                SHIPPING DETAILS
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name}
                      readOnly
                      className="bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-luxury-gold text-xs tracking-widest uppercase opacity-50 cursor-not-allowed" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary">Email</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email}
                      readOnly
                      className="bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-luxury-gold text-xs tracking-widest uppercase opacity-50 cursor-not-allowed" 
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-secondary">Address</label>
                  <input 
                    type="text" 
                    name="address"
                    required
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    className="bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-luxury-gold text-xs tracking-widest uppercase" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary">City</label>
                    <input 
                      type="text" 
                      name="city"
                      required
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-luxury-gold text-xs tracking-widest uppercase" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-secondary">City Pin Code</label>
                    <input 
                      type="text" 
                      name="postalCode"
                      required
                      maxLength={6}
                      placeholder="400001"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-luxury-gold text-xs tracking-widest uppercase" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-secondary">Country</label>
                  <input 
                    type="text" 
                    name="country"
                    required
                    readOnly
                    value="India"
                    className="bg-transparent border-b border-primary/10 py-3 focus:outline-none focus:border-luxury-gold text-xs tracking-widest uppercase opacity-60 cursor-not-allowed" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-secondary">Phone Number (Indian Only)</label>
                  <div className="flex items-center gap-2 border-b border-primary/10 focus-within:border-luxury-gold transition-colors">
                    <span className="text-xs text-secondary tracking-widest py-3">+91</span>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      className="bg-transparent py-3 focus:outline-none text-xs tracking-widest uppercase w-full" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-luxury-card p-10 glass rounded-sm"
            >
               <h2 className="text-xs uppercase tracking-[0.4em] font-bold mb-8 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full border border-luxury-gold flex items-center justify-center text-[10px]">2</span> 
                PAYMENT METHOD
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Razorpay Option */}
                 <button 
                   type="button"
                   onClick={() => setPaymentMethod('Razorpay')}
                   className={`p-6 border rounded-sm flex items-center justify-between cursor-pointer transition-all duration-500 ${
                     paymentMethod === 'Razorpay' 
                       ? 'border-luxury-gold bg-luxury-gold/5' 
                       : 'border-primary/10 hover:border-luxury-gold/40 bg-transparent'
                   }`}
                 >
                    <div className="flex items-center gap-4">
                      <CreditCard size={20} strokeWidth={1.5} className={paymentMethod === 'Razorpay' ? 'text-luxury-gold' : 'text-secondary'} />
                      <span className="text-[10px] tracking-widest uppercase font-bold text-primary">Prepaid (Card/UPI)</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'Razorpay' ? 'border-luxury-gold' : 'border-primary/20'
                    }`}>
                      {paymentMethod === 'Razorpay' && <div className="w-2 h-2 rounded-full bg-luxury-gold" />}
                    </div>
                 </button>

                 {/* COD Option */}
                 <button 
                   type="button"
                   onClick={() => setPaymentMethod('COD')}
                   className={`p-6 border rounded-sm flex items-center justify-between cursor-pointer transition-all duration-500 ${
                     paymentMethod === 'COD' 
                       ? 'border-luxury-gold bg-luxury-gold/5' 
                       : 'border-primary/10 hover:border-luxury-gold/40 bg-transparent'
                   }`}
                 >
                    <div className="flex items-center gap-4">
                      <Wallet size={20} strokeWidth={1.5} className={paymentMethod === 'COD' ? 'text-luxury-gold' : 'text-secondary'} />
                      <span className="text-[10px] tracking-widest uppercase font-bold text-primary">Cash on Delivery (COD)</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'COD' ? 'border-luxury-gold' : 'border-primary/20'
                    }`}>
                      {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-luxury-gold" />}
                    </div>
                 </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-8">
            <div className="bg-luxury-card p-10 glass rounded-sm sticky top-12">
              <h3 className="text-xs uppercase tracking-[0.4em] font-black mb-8 border-b border-primary/10 pb-6">ORDER SUMMARY</h3>
              
              <div className="flex flex-col gap-2 mb-8 border-b border-primary/10 pb-8">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="ENTER COUPON CODE" 
                    className={`w-full bg-transparent border px-4 py-3 text-xs tracking-widest uppercase focus:outline-none transition-colors placeholder:text-primary/30 ${
                      couponStatus === 'success' ? 'border-green-500/50 focus:border-green-500' :
                      couponStatus === 'error' ? 'border-red-500/50 focus:border-red-500' :
                      'border-primary/20 focus:border-luxury-gold'
                    }`}
                  />
                  {couponStatus === 'validating' && (
                    <div className="absolute right-4 animate-spin rounded-full h-4 w-4 border-2 border-luxury-gold border-t-transparent" />
                  )}
                </div>
                {couponMessage && (
                  <span className={`text-[10px] tracking-wider uppercase font-bold pt-1 ${
                    couponStatus === 'success' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {couponStatus === 'success' ? `✓ ${couponMessage}` : `✗ ${couponMessage}`}
                  </span>
                )}
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-xs tracking-[0.2em] uppercase">
                  <span className="text-secondary">SUBTOTAL</span>
                  <span>₹{checkoutTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs tracking-[0.2em] uppercase">
                  <span className="text-secondary">SHIPPING</span>
                  <span>{checkoutTotal > 1000 ? 'FREE' : '₹50.00'}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs tracking-[0.2em] uppercase text-luxury-gold">
                    <span>DISCOUNT</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-end border-t border-primary/10 pt-8 mb-12">
                <span className="text-[10px] uppercase tracking-[0.6em] font-black">TOTAL</span>
                <span className="text-3xl md:text-4xl font-display tracking-widest text-luxury-gold">₹{finalTotal.toLocaleString()}</span>
              </div>

              <button 
                type="submit"
                disabled={loading || checkoutItems.length === 0}
                className="w-full bg-primary text-luxury-black py-6 rounded-sm text-[10px] uppercase tracking-[0.4em] font-black flex items-center justify-center gap-3 hover:bg-luxury-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all gold-glow mb-6"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : <Lock size={14} />} 
                {loading 
                  ? 'PROCESSING TRANSACTION...' 
                  : paymentMethod === 'COD' 
                    ? 'PLACE ORDER (CASH ON DELIVERY)' 
                    : 'AUTHORIZE TRANSACTION'}
              </button>

              <div className="flex items-center justify-center gap-3 text-secondary text-[10px] uppercase tracking-widest px-8 text-center leading-loose">
                 <ShieldCheck size={14} className="text-luxury-gold" />
                 Encrypted with 256-bit security. 
              </div>
            </div>
            
            <Link to="/cart" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-secondary hover:text-primary transition-colors">
              EDIT COLLECTION
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
