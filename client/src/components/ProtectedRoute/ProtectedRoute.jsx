import React from 'react';
import { Navigate } from 'react-router-dom';
import apiService from '../../services/api';

const ProtectedRoute = ({ children, requiredRole = 'ROLE_МЕТОДИСТ' }) => {
  const user = apiService.getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;