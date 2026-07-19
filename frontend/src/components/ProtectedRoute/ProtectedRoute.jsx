import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/authContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-finance-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-finance-gold border-finance-navy rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Redirect to home and append query to open login modal automatically
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
