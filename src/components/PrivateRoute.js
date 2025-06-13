// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token } = useAuthContext();
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
