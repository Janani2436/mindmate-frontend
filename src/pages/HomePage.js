// client/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
 

const HomePage = () => {
  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#6c63ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  };

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '4rem',
      padding: '2rem',
      background: '#f9f9f9',
      borderRadius: '12px',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Welcome to <span style={{ color: '#6c63ff' }}>MindMate</span> 🧠💬
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Your personal space to reflect, track your emotions, and grow emotionally.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/login">
          <button style={buttonStyle}>
            Login
          </button>
        </Link>

        <Link to="/register">
          <button style={{ ...buttonStyle, backgroundColor: '#ff6b6b' }}>
            Register
          </button>
        </Link>

        <Link to="/chat">
          <button style={{ ...buttonStyle, backgroundColor: '#00b894' }}>
            Chat 💬
          </button>
        </Link>
      </div>

      {/* 📸 Show the selfie capture feature here */}
      
    </div>
  );
};

export default HomePage;
