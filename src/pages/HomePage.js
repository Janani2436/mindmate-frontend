// client/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // ⬅️ we'll define styles here

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="white-box">
        <h1>
          Welcome to <span className="highlight">MindMate</span> 🧠💬
        </h1>
        <p>Your personal space to reflect, track your emotions, and grow emotionally.</p>

        <div className="button-group">
          <Link to="/login" className="home-btn login">🔒 Login</Link>
          <Link to="/register" className="home-btn register">📝 Register</Link>
          <Link to="/chat" className="home-btn chat">💬 Chat</Link>
          <Link to="/videochat" className="home-btn videochat">🤖 Video Chat</Link>
          <Link to="/detect" className="home-btn detect">😄 Emotion Detector</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
