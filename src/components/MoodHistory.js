// client/src/components/MoodHistory.js
import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';

const MoodHistory = () => {
  const [moods, setMoods] = useState([]);
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await axios.get('/api/mood');  // ✅ Fixed
        setMoods(res.data);
      } catch (err) {
        console.error('Error fetching moods:', err);
      }
    };

    fetchMoods();
  }, []);

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    if (!mood.trim()) return;

    try {
      const res = await axios.post('/api/mood', { mood, note });  // ✅ Fixed
      setMoods([res.data, ...moods]);
      setMood('');
      setNote('');
    } catch (err) {
      console.error('Error saving mood:', err);
    }
  };

  const deleteMood = async (id) => {
    if (window.confirm('Are you sure you want to delete this mood?')) {
      try {
        await axios.delete(`/api/mood/${id}`);  // ✅ Fixed
        setMoods(moods.filter((m) => m._id !== id));
      } catch (err) {
        console.error('Error deleting mood:', err);
      }
    }
  };

  const sortedMoods = [...moods].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>📝 Log Your Mood</h2>
      <form onSubmit={handleMoodSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Your mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button type="submit">Save</button>
      </form>

      <h3>Your Mood History</h3>
      {sortedMoods.length === 0 ? (
        <p>No moods saved yet. Try logging one above!</p>
      ) : (
        sortedMoods.map((mood) => (
          <div
            key={mood._id}
            style={{
              marginBottom: '1rem',
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '10px',
            }}
          >
            <p>
              <strong>Mood:</strong> {mood.mood} <br />
              <strong>Note:</strong> {mood.note || '—'} <br />
              <small>{new Date(mood.createdAt).toLocaleString()}</small>
            </p>
            <button
              onClick={() => deleteMood(mood._id)}
              style={{
                marginTop: '0.5rem',
                background: '#ff4d4f',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MoodHistory;
