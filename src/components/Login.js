// MindMate frontend - Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from '../utils/axiosInstance';
import { useAuthContext } from '../context/AuthContext';
import '../pages/Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate(); // ✅

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      login(res.data.token);   // sets tokesn
      setMessage('✅ Login successful!');
      setUsername('');
      setPassword('');
      setTimeout(() => navigate('/chat'), 800); // redirects to chat
    } catch (err) {
      console.error(err);
      setMessage('❌ Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="auth-box">
      <h2>🔐 Login to MindMate</h2>
      <form onSubmit={handleLogin}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Enter your username"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {message && (
          <div className={`auth-msg ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>

      <p className="auth-alt-link">
        Don’t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
