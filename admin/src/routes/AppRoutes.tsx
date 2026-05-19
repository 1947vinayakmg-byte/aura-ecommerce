import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// Lazy load pages for performance
const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard'));
const Products = React.lazy(() => import('../pages/products/Products'));
const AddProduct = React.lazy(() => import('../pages/products/AddProduct'));
const EditProduct = React.lazy(() => import('../pages/products/EditProduct'));
const ProductDetails = React.lazy(() => import('../pages/products/ProductDetails'));
const AIInsights = React.lazy(() => import('../pages/AIInsights'));
const Analytics = React.lazy(() => import('../pages/analytics/Analytics'));
const Users = React.lazy(() => import('../pages/users/Users'));
const Settings = React.lazy(() => import('../pages/settings/Settings'));
const Login = React.lazy(() => import('../pages/auth/Login'));
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/auth/ResetPassword'));
const Orders = React.lazy(() => import('../pages/orders/Orders'));
const OrderDetails = React.lazy(() => import('../pages/orders/OrderDetails'));
const Coupons = React.lazy(() => import('../pages/coupons/Coupons'));
const Reviews = React.lazy(() => import('../pages/reviews/Reviews'));
const Inventory = React.lazy(() => import('../pages/inventory/Inventory'));
const Categories = React.lazy(() => import('../pages/categories/Categories'));
const Reports = React.lazy(() => import('../pages/reports/Reports'));
const DeletedProducts = React.lazy(() => import('../pages/inventory/DeletedProducts'));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected Admin Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="ai-insights" element={<AIInsights />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="deleted-products" element={<DeletedProducts />} />
        <Route path="categories" element={<Categories />} />
        <Route path="reports" element={<Reports />} />
        <Route path="customers" element={<Users />} />
        <Route path="settings" element={<Settings />} />
        
        {/* Fallback for within layout */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Global Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
