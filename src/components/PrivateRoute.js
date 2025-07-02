// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuthContext();

  // Wait until AuthContext finishes loading
  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
