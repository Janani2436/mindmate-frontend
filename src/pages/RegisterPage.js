import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { useAuthContext } from '../context/AuthContext';
import './Auth.css'; // ✅ new shared style file for login & register

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/register', { username, password });

      const res = await axios.post('/api/auth/login', { username, password });
      login(res.data.token);

      setMessage('✅ Registered and logged in! Redirecting...');
      setUsername('');
      setPassword('');
      setTimeout(() => navigate('/chat'), 1500);
    } catch (err) {
      console.error(err);
      setMessage('❌ Registration failed. Username might already exist.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-box">
      <h2>📝 Register for MindMate</h2>
      <form onSubmit={handleRegister}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Enter a unique username"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Choose a strong password"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        {message && (
          <div
            className={`auth-msg ${message.includes('✅') ? 'success' : 'error'}`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterPage;
