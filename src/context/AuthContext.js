import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let logoutTimer;

    const checkToken = () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;

          if (decoded.exp < now) {
            console.warn('⏰ Token expired. Logging out...');
            logout();
          } else {
            const timeout = (decoded.exp - now) * 1000;
            logoutTimer = setTimeout(logout, timeout);
          }
        } catch (err) {
          console.error('❌ Invalid token. Logging out...', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkToken();

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
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

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
