// MindMate frontend - Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/register', { username, password });

      if (res?.data?.token) {
        localStorage.setItem('token', res.data.token);
      }

      setMessage('✅ Registered and logged in! Redirecting...');
      setUsername('');
      setPassword('');

      setTimeout(() => navigate('/chat'), 1000); // redirects to chat page
    } catch (err) {
      console.error('Registration Error:', err);
      setMessage(
        err.response?.data?.message || '❌ Registration failed. Try again.'
      );
    }
    setLoading(false);
  };

  return (
    <div className="auth-box">
      <h2>📝 Create an Account</h2>
      <form onSubmit={handleRegister}>
        <label>Username</label>
        <input
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Your secure password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        {message && (
          <div className={`auth-msg ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>

      <p className="auth-alt-link">
        Already have an account? <a href="/login">Login instead</a>
      </p>
    </div>
  );
};

export default Register;
