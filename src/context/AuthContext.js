import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


// 1. Create the Auth Context
const AuthContext = createContext();

// 2. AuthProvider to wrap the app
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;

          if (decoded.exp < now) {
            // Token already expired
            logout();
          } else {
            // Auto logout when token expires
            const timeout = (decoded.exp - now) * 1000;
            const timer = setTimeout(() => {
              logout();
            }, timeout);

            return () => clearTimeout(timer);
          }
        } catch (err) {
          console.error('❌ Invalid token. Logging out...', err);
          logout();
        }
      }
    };

    checkToken();
    setLoading(false);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const value = useMemo(() => ({
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  }), [token, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
