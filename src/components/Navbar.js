import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return null; // Avoid flickering

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f0f4ff' }}>
      <Link to="/">Home</Link>{" | "}
      {!isAuthenticated ? (
        <>
          <Link to="/login">Login</Link>{" | "}
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <Link to="/history">Mood History</Link>{" | "}
          <Link to="/chat">Chat</Link>{" | "}
          <Link to="/videochat">Video Chat</Link>{" | "}
          <Link to="/detect">Emotion Detector</Link>{" | "}
          <LogoutButton />
        </>
      )}
    </nav>
  );
};

export default Navbar;
