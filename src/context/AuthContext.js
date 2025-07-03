import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import jwtDecode from 'jwt-decode'; // ✅ Make sure this works with v3.1.2 or default export

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;

          if (decoded.exp < now) {
            logout();
          } else {
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
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
