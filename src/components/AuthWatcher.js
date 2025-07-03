// src/components/AuthWatcher.js
import { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthWatcher = () => {
  const { token, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !token) {
      navigate('/login');
    }
  }, [token, loading, navigate]);

  return null;
};

export default AuthWatcher;
