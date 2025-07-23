import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import './Navbar.css'; // ✅ Styling moved to dedicated file

const Navbar = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const location = useLocation();

  if (loading) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">🧠 MindMate</Link>
        </div>

        <div className="navbar-right">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className={isActive('/login') ? 'nav-link active' : 'nav-link'}>Login</Link>
              <Link to="/register" className={isActive('/register') ? 'nav-link active' : 'nav-link'}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/history" className={isActive('/history') ? 'nav-link active' : 'nav-link'}>Journal</Link>
              <Link to="/chat" className={isActive('/chat') ? 'nav-link active' : 'nav-link'}>AI Chat</Link>
              <Link to="/videochat" className={isActive('/videochat') ? 'nav-link active' : 'nav-link'}>Video Chat</Link>
              <Link to="/detect" className={isActive('/detect') ? 'nav-link active' : 'nav-link'}>Face Mood</Link>
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
