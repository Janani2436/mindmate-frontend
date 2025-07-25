// MindMate frontend - MoodHistory.js
import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import './MoodHistory.css'; 

const MoodHistory = () => {
  const [moods, setMoods] = useState([]);
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await axios.get('/api/mood');
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
      const res = await axios.post('/api/mood', { mood, note });
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
        await axios.delete(`/api/mood/${id}`);
        setMoods((moods) => moods.filter((m) => m._id !== id));
      } catch (err) {
        console.error('Error deleting mood:', err);
      }
    }
  };

  const sortedMoods = [...moods].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="mood-logger-wrapper">
      <h2 className="logger-title">📝 Log Your Mood</h2>

      <form onSubmit={handleMoodSubmit} className="mood-form">
        <input
          type="text"
          placeholder="Your mood (e.g. happy, sad)"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <input
          type="text"
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit">Save</button>
      </form>

      <h3 className="history-title">📅 Mood History</h3>

      {sortedMoods.length === 0 ? (
        <p className="empty-note">No moods saved yet. Try logging one above!</p>
      ) : (
        <div className="mood-list">
          {sortedMoods.map((m) => (
            <div className="mood-card" key={m._id}>
              <div className="mood-card-body">
                <div><strong>Mood:</strong> {m.mood}</div>
                <div><strong>Note:</strong> {m.note || '—'}</div>
                <div className="mood-date">
                  {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>
              <button className="delete-btn" onClick={() => deleteMood(m._id)}>
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodHistory;
