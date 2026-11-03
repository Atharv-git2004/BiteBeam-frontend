import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import OrderTrackingPage from './pages/OrderTrackingPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-white">
              <Navbar />
              {/* pb-16 md:pb-0 ensures content isn't hidden behind the mobile bottom nav */}
              <main className="flex-1 pb-16 md:pb-0">
                <Routes>
                  {/* Public & Customer Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/orders" element={<OrdersPage />} />

                  {/* Order Tracking (customer after placing order) */}
                  <Route
                    path="/track/:orderId"
                    element={
                      <ProtectedRoute allowedRoles={['user', 'admin', 'delivery']}>
                        <OrderTrackingPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Seller Portal */}
                  <Route
                    path="/seller"
                    element={
                      <ProtectedRoute allowedRoles={['seller', 'admin']}>
                        <SellerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Admin Portal */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Delivery Partner Portal */}
                  <Route
                    path="/delivery/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['delivery', 'admin']}>
                        <DeliveryDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
              {/* Mobile Bottom Navigation — hidden on md+ screens */}
              <BottomNav />
            </div>
          </BrowserRouter>
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
