import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MoodHistoryPage from './pages/MoodHistoryPage';
import ChatPage from './pages/ChatPage';
import VideoChat from './components/VideoChat/VideoChat';
import EmotionDetector from './components/EmotionDetector';

import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

import { ThemeMoodProvider } from './context/ThemeMoodContext';
import { AuthProvider } from './context/AuthContext';

import './App.css'; // Global CSS (includes mood variables, fonts, etc.)

function App() {
  return (
    <ThemeMoodProvider>
      <AuthProvider>
        <Router>
          {/* ✅ Navbar should have access to both Theme + Auth */}
          <Navbar />

          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/detect" element={<EmotionDetector />} />

            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <MoodHistoryPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/videochat"
              element={
                <PrivateRoute>
                  <VideoChat />
                </PrivateRoute>
              }
            />

            {/* 🌐 404 Fallback */}
            <Route
              path="*"
              element={
                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <h2 style={{ color: '#d32f2f', fontSize: '1.8rem' }}>
                    🚫 404 - Page Not Found
                  </h2>
                  <p style={{ fontSize: '1rem', color: '#777', marginTop: '1rem' }}>
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                </div>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeMoodProvider>
  );
}

export default App;
