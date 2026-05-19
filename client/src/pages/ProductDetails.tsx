import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ChevronRight, Star, ShieldCheck, Truck, RotateCcw, AlertTriangle } from 'lucide-react';
import API from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ProductGallery from '../components/product/ProductGallery';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button';


function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert('Please log in to submit a review.');
      return;
    }
    try {
      await API.post(`/products/${product?._id || product?.id}/reviews`, {
        rating,
        comment,
      });
      alert('Review Added');
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add review');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);

        // Also fetch all products for similar products section
        const allProducts = await API.get('/products');
        setProductsList(allProducts.data.products || []);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    addToCart(product, 1, selectedSize, selectedColor);
    setTimeout(() => setIsAdding(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    navigate('/checkout', { 
      state: { 
        instantBuyProduct: { ...product, quantity: 1, selectedSize, selectedColor } 
      } 
    });
  };

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return productsList.filter(p => p.category === product.category && (p._id || p.id) !== (product._id || product.id)).slice(0, 3);
  }, [product, productsList]);

  if (loading) {
    return (
      <main className="pt-12 pb-20 px-6 md:px-12 bg-luxury-black min-h-screen animate-pulse">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center gap-2 mb-12">
            <div className="h-3 bg-neutral-900 rounded w-16" />
            <div className="h-3 bg-neutral-900 rounded w-4" />
            <div className="h-3 bg-neutral-900 rounded w-16" />
            <div className="h-3 bg-neutral-900 rounded w-4" />
            <div className="h-3 bg-neutral-900 rounded w-24" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Gallery Skeleton */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-neutral-900 border border-white/5 rounded-sm" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-neutral-900 border border-white/5 rounded-sm" />
                ))}
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="flex flex-col space-y-8">
              <div className="space-y-4">
                <div className="h-4 bg-neutral-900 rounded w-1/4" />
                <div className="h-10 bg-neutral-900 rounded w-3/4" />
                <div className="h-8 bg-neutral-900 rounded w-1/3" />
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="h-3 bg-neutral-900 rounded w-full" />
                <div className="h-3 bg-neutral-900 rounded w-5/6" />
                <div className="h-3 bg-neutral-900 rounded w-4/5" />
              </div>

              {/* Sizes Skeleton */}
              <div className="space-y-3 pt-6">
                <div className="h-4 bg-neutral-900 rounded w-1/5" />
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 bg-neutral-900 border border-white/5 rounded-sm" />
                  ))}
                </div>
              </div>

              {/* Colors Skeleton */}
              <div className="space-y-3">
                <div className="h-4 bg-neutral-900 rounded w-1/5" />
                <div className="flex gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-neutral-900" />
                  ))}
                </div>
              </div>

              {/* Buttons Skeleton */}
              <div className="space-y-4 pt-8">
                <div className="flex gap-4">
                  <div className="h-16 bg-neutral-900 rounded-sm flex-1" />
                  <div className="w-20 h-16 bg-neutral-900 rounded-sm" />
                </div>
                <div className="h-16 bg-neutral-900 rounded-sm w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  if (!product) return <div className="pt-48 text-center uppercase tracking-widest">Product Not Found</div>;


  return (
    <main className="pt-12 pb-20 px-6 md:px-12 bg-luxury-black">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-secondary mb-12">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <Link to={`/shop?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight size={10} />
          <span className="text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <ProductGallery images={product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : [])} name={product.name} />

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              {product.isNewProduct && !product.isHidden && <span className="bg-primary text-luxury-black text-[10px] px-2 py-1 font-bold tracking-widest uppercase">New Release</span>}
              <div className="flex items-center gap-1 text-luxury-gold">
                <Star size={12} fill="currentColor" />
                <span className="text-[10px] font-bold tracking-widest">{product.rating}</span>
                <span className="text-secondary text-[10px]">({product.numReviews} Reviews)</span>
              </div>
            </div>

            {product.isHidden && (
              <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3">
                <AlertTriangle size={16} className="shrink-0" />
                <span>THIS MASTERPIECE HAS BEEN ARCHIVED AND IS NO LONGER AVAILABLE FOR ACQUISITION.</span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-display mb-6 tracking-[0.15em] leading-tight">{product.name}</h1>
            <p className="text-3xl font-light tracking-[0.1em] mb-12">₹{product.price.toLocaleString()}</p>

            <p className="text-secondary tracking-widest leading-loose text-sm mb-12 italic">
              {product.description}
            </p>

            {/* Selection */}
            <div className="space-y-12">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs uppercase tracking-[0.2em] font-medium text-secondary">Select Size</span>
                  <button className="text-[10px] uppercase tracking-[0.1em] border-b border-white/20 pb-1 hover:text-luxury-gold transition-colors">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes && product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-12 h-12 border transition-all text-xs flex items-center justify-center font-bold tracking-widest",
                        selectedSize === size ? "border-luxury-gold bg-luxury-gold text-black gold-glow" : "border-white/10 hover:border-white/40"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-secondary block mb-4">Select Color</span>
                <div className="flex gap-4">
                  {product.colors && product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all p-1",
                        selectedColor === color ? "border-luxury-gold" : "border-transparent"
                      )}
                    >
                      <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.countInStock === 0 || product.isHidden}
                    loading={isAdding}
                    variant={isAdding || product.countInStock === 0 || product.isHidden ? 'outline' : 'primary'}
                    className={cn("flex-1 py-6", (product.countInStock === 0 || product.isHidden) && "opacity-50 cursor-not-allowed")}
                    icon={isAdding ? <ShieldCheck size={18} /> : <ShoppingBag size={18} />}
                  >
                    {product.isHidden ? 'Archived' : (product.countInStock === 0 ? 'Out of Stock' : (isAdding ? 'Added to Bag' : 'Add to Bag'))}
                  </Button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={cn(
                      "w-full md:w-20 h-16 border rounded-sm flex items-center justify-center transition-all duration-300",
                      isInWishlist(product._id || product.id || '') ? "border-luxury-gold text-luxury-gold" : "border-primary/10 hover:border-primary/40 text-primary"
                    )}
                  >
                    <Heart size={20} fill={isInWishlist(product._id || product.id || '') ? "currentColor" : "none"} />
                  </button>
                </div>
                <Button
                  onClick={handleBuyNow}
                  disabled={product.countInStock === 0 || product.isHidden}
                  variant="luxury"
                  className={cn("w-full py-6 tracking-[0.4em]", (product.countInStock === 0 || product.isHidden) && "opacity-50 cursor-not-allowed")}
                >
                  {product.isHidden ? 'UNAVAILABLE FOR ACQUISITION' : (product.countInStock === 0 ? 'Out of Stock' : 'INSTANT ACQUISITION / BUY NOW')}
                </Button>
              </div>
            </div>


            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-primary/5">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-luxury-gold group-hover:text-luxury-black transition-colors">
                  <Truck size={18} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Global Express</span>
                  <span className="text-[10px] text-secondary tracking-widest">{product.price > 500 ? 'Complimentary' : '3-5 Days'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-luxury-gold group-hover:text-black transition-colors">
                  <RotateCcw size={18} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">30 Day Returns</span>
                  <span className="text-[10px] text-secondary tracking-widest">Hassle Free</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-luxury-gold group-hover:text-black transition-colors">
                  <ShieldCheck size={18} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Authentic</span>
                  <span className="text-[10px] text-secondary tracking-widest">Verified Luxury</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <section className="mt-32">
          <div className="text-center mb-16">
            <span className="text-luxury-gold text-xs tracking-[0.4em] mb-4 block uppercase font-bold">The Dialogue</span>
            <h2 className="text-2xl md:text-4xl font-display tracking-[0.2em]">COMPLETE THE LOOK</h2>
          </div>
          <ProductGrid products={similarProducts} />
        </section>

        {/* Customer Reviews */}
        <section className="mt-32 border-t border-white/10 pt-24">
          <div className="text-center mb-16">
            <span className="text-luxury-gold text-xs tracking-[0.4em] mb-4 block uppercase font-bold">Client Experience</span>
            <h2 className="text-2xl md:text-4xl font-display tracking-[0.2em]">CUSTOMER REVIEWS</h2>
          </div>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-white/10 bg-white/[0.02] p-8 relative group hover:border-luxury-gold/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-display tracking-widest text-lg text-primary">{review.name}</h3>
                      <span className="text-[10px] text-secondary tracking-widest uppercase">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-luxury-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-luxury-gold" : "text-white/20"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-secondary tracking-wide leading-relaxed italic text-sm mt-4">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-white/10 bg-white/[0.02] p-12 text-center mb-16">
              <p className="text-secondary tracking-[0.15em] uppercase text-sm">No reviews yet. Be the first to share your experience.</p>
            </div>
          )}

          {/* Write Review Form */}
          <div className="max-w-2xl mx-auto border border-white/10 bg-white/[0.02] p-8 md:p-12 mt-12">
            <h3 className="text-xl font-display tracking-[0.15em] uppercase mb-8 text-center">Write a Review</h3>
            {isAuthenticated ? (
              <form onSubmit={submitReview} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-medium text-secondary mb-3">
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-luxury-black border border-white/10 p-4 text-sm tracking-widest text-primary focus:border-luxury-gold outline-none transition-colors"
                  >
                    <option value={5}>5 - Flawless Perfection</option>
                    <option value={4}>4 - Exquisite Quality</option>
                    <option value={3}>3 - Satisfactory</option>
                    <option value={2}>2 - Below Expectations</option>
                    <option value={1}>1 - Disappointing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-medium text-secondary mb-3">
                    Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    placeholder="Share your thoughts on the craftsmanship, fit, and elegance..."
                    className="w-full bg-luxury-black border border-white/10 p-4 text-sm tracking-wide text-primary focus:border-luxury-gold outline-none transition-colors h-32 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-5 text-xs tracking-[0.2em]"
                >
                  SUBMIT REVIEW
                </Button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-6">
                <p className="text-secondary tracking-widest text-xs uppercase">Please authorize your identity to share your experience.</p>
                <Link
                  to="/login"
                  className="inline-block bg-primary text-luxury-black px-12 py-4 rounded-sm text-[10px] uppercase tracking-[0.4em] font-black hover:bg-luxury-gold transition-all gold-glow"
                >
                  AUTHORIZE / LOGIN
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;
