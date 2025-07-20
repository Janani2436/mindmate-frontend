// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MoodHistoryPage from './pages/MoodHistoryPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import VideoChat from './components/VideoChat/VideoChat';
import Navbar from './components/Navbar';
import EmotionDetector from './components/EmotionDetector';

function App() {
  return (
    <Router>
      <AuthProvider>
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
          <Route path="*" element={<h2 className="text-center mt-8 text-red-500 text-xl">404 - Page Not Found</h2>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
