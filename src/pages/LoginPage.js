import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance'; // ✅ Use custom axios

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { username, password });

      localStorage.setItem('token', res.data.token);
      setMessage('✅ Login successful!');
      setUsername('');
      setPassword('');

      setTimeout(() => {
        navigate('/chat');
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#fefefe',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🔐 Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#6c63ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {message && (
        <p style={{
          marginTop: '1rem',
          color: message.includes('✅') ? 'green' : 'red',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoginPage;
