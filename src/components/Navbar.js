import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        background: '#f5f5f5',
        borderBottom: '1px solid #ddd',
      }}
    >
      {token && (
        <>
          <Link to="/">Mood Form</Link>
          <Link to="/history">History</Link>
          <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>
            Logout
          </button>
        </>
      )}
      {!token && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
