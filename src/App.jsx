import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetail from './pages/CollectionDetail';
import SharedCollection from './pages/SharedCollection';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import CategoryPage from './pages/Category-page';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: '1.2rem' }}>
        ✦ Loading GlowWear...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c' }}>
        ✦ Loading...
      </div>
    );
  }
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/c/:shareId" element={<SharedCollection />} />
            <Route path="/glowwear/collection/:shareId" element={<SharedCollection />} />
            <Route path="/category/:category" element={<CategoryPage />} />

            {/* Protected */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collections"
              element={
                <ProtectedRoute>
                  <CollectionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collection/:id"
              element={
                <ProtectedRoute>
                  <CollectionDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;