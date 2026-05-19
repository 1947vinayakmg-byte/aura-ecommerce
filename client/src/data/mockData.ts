import { Product, Collection } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'SILK DUSK BLAZER',
    description: 'A masterpiece of tailoring, the Silk Dusk Blazer features a relaxed yet structured silhouette with peak lapels and discrete pockets.',
    price: 1250,
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['#000000', '#2C3E50'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviewsCount: 24,
    isTrending: true,
    isNew: true
  },
  {
    id: '2',
    name: 'VELVET MIDNIGHT GOWN',
    description: 'Breathtaking floor-length gown in Italian midnight velvet with a plunging neckline and thigh-high slit.',
    price: 2800,
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1539008835279-43469df069cc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['#000033', '#000000'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 5.0,
    reviewsCount: 12,
    isTrending: true
  },
  {
    id: '3',
    name: 'OBSIDIAN OVERSIZED HOODIE',
    description: 'Heavyweight premium cotton fleece with a dropped shoulder and structured hood. The quintessential streetwear piece.',
    price: 450,
    category: 'Streetwear',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['#000000', '#333333'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    rating: 4.8,
    reviewsCount: 56,
    isTrending: true,
    isNew: true
  },
  {
    id: '4',
    name: 'CASHMERE ESSENTIAL TEE',
    description: 'Ultra-soft cashmere blend t-shirt with a precision collar and seamless hem.',
    price: 320,
    category: 'Essentials',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['#FFFFFF', '#E6E6E6', '#000000'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.7,
    reviewsCount: 89,
    isNew: true
  },
  {
    id: '5',
    name: 'SLATE WOOL TROUSERS',
    description: 'Wide-leg architectural trousers in virgin wool with deep pleats and high-rise fit.',
    price: 890,
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['#2F4F4F', '#000000'],
    sizes: ['30', '32', '34', '36'],
    rating: 4.9,
    reviewsCount: 15
  },
  {
    id: '6',
    name: 'EMERALD SATIN SLIP',
    description: 'Italian emerald green satin bias-cut slip dress. Minimalist luxury at its finest.',
    price: 1100,
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?auto=format&fit=crop&q=80&w=800'
    ],
    colors: ['#0E5E4E', '#000000'],
    sizes: ['XS', 'S', 'M'],
    rating: 5.0,
    reviewsCount: 8,
    isNew: true
  }
];

export const collections: Collection[] = [
  {
    id: 'men',
    title: 'THE MODERN MAN',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800',
    path: '/shop?category=Men'
  },
  {
    id: 'women',
    title: 'ETHEREAL ELEGANCE',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    path: '/shop?category=Women'
  },
  {
    id: 'streetwear',
    title: 'STREET COUTURE',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
    path: '/shop?category=Streetwear'
  },
  {
    id: 'essentials',
    title: 'PREMIUM BASICS',
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=800',
    path: '/shop?category=Essentials'
  }
];
