import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import NotFound from './pages/NotFound';
import ProfilePage from './pages/ProfilePage';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BrowseProducts from './pages/buyer/BrowseProducts';
import ProductDetailPage from './pages/buyer/ProductDetailPage';
import MyOrders from './pages/buyer/MyOrders';
import OrderDetails from './pages/buyer/OrderDetails';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MyProducts from './pages/farmer/MyProducts';
import AddProduct from './pages/farmer/AddProduct';
import EditProduct from './pages/farmer/EditProduct';
import ReceivedOrders from './pages/farmer/ReceivedOrders';
import SalesHistory from './pages/farmer/SalesHistory';
import FarmerOrderDetails from './pages/farmer/OrderDetails';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/products" element={<BrowseProducts />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />

              {/* Profile Route - Protected for both roles */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Buyer Routes */}
              <Route
                path="/buyer/dashboard"
                element={
                  <ProtectedRoute requiredRole="BUYER">
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/orders"
                element={
                  <ProtectedRoute requiredRole="BUYER">
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/orders/:id"
                element={
                  <ProtectedRoute requiredRole="BUYER">
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />

              {/* Farmer Routes */}
              <Route
                path="/farmer/dashboard"
                element={
                  <ProtectedRoute requiredRole="FARMER">
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/products"
                element={
                  <ProtectedRoute requiredRole="FARMER">
                    <MyProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/products/add"
                element={
                  <ProtectedRoute requiredRole="FARMER">
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/products/edit/:id"
                element={
                  <ProtectedRoute requiredRole="FARMER">
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/orders"
                element={
                  <ProtectedRoute requiredRole="FARMER">
                    <ReceivedOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/orders/:id"
                element={
                  <ProtectedRoute requiredRole="FARMER">
                    <FarmerOrderDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/sales"
                element={
                  <ProtectedRoute requiredRole="FARMER">
                    <SalesHistory />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;