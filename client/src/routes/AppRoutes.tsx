import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Pages
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Checkout from '../pages/Checkout';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import About from '../pages/About';
import Contact from '../pages/Contact';
import InfoPage from '../pages/InfoPage';
import MyOrders from '../pages/MyOrders';
import OrderSuccess from '../pages/OrderSuccess';
import CodSuccess from '../pages/CodSuccess';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/:slug" element={<InfoPage />} />
      </Route>

      {/* Protected Routes with DashboardLayout */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Checkout Protection (Single Page, but needs ProtectedRoute) */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Checkout />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MyOrders />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-success/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OrderSuccess />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cod-success/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CodSuccess />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/*" element={<div className="pt-48 text-center uppercase tracking-widest font-black">Admin Nexus - Access Granted</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
