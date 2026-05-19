export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
  isAdmin?: boolean;
}

export interface Product {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  numReviews?: number;
  reviewsCount?: number;
  countInStock?: number;
  isNewProduct?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  isHidden?: boolean;
  reviews?: Review[];
}


export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Collection {
  id: string;
  title: string;
  image: string;
  path: string;
}
