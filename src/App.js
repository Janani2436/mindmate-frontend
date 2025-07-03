import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MoodHistoryPage from './pages/MoodHistoryPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LogoutButton from './components/LogoutButton';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ padding: '1rem' }}>
          <nav style={{ marginBottom: '1rem' }}>
            <Link to="/">Home</Link>{' '}
            <Link to="/login">Login</Link>{' '}
            <Link to="/register">Register</Link>{' '}
            <Link to="/history">Mood History</Link>{' '}
            <Link to="/chat">Chat</Link>{' '}
            <LogoutButton />
          </nav>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
