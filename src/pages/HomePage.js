import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="hero-box">
        <h1 className="hero-title">
          Welcome to <span className="brand">MindMate</span> 🧠
        </h1>
        <p className="hero-subtitle">
          Your smart companion to track moods, reflect, and grow emotionally.
        </p>

        <div className="button-grid">
          <Link to="/login" className="home-btn login">🔒 Login</Link>
          <Link to="/register" className="home-btn register">📝 Register</Link>
          <Link to="/chat" className="home-btn chat">💬 AI Chat</Link>
          <Link to="/videochat" className="home-btn videochat">🤖 Video Chat</Link>
          <Link to="/detect" className="home-btn detect">🎯 Emotion Detector</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
