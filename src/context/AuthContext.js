import { createContext, useState, useEffect, useContext, useMemo } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setUser({ token }); // In a real app, decode or fetch user info here
    }
    setLoading(false);
  }, [token]);

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, login, logout, loading }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
