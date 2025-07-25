// MindMate frontend - MoodForm.js
import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';

const MoodForm = () => {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    setShowReflection(["sad", "anxious", "angry"].includes(mood));
  }, [mood]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // sends mood note to backend
      const res = await axios.post('/api/mood', { mood, note });
      setMessage('Mood saved successfully!');
      setMood('');
      setNote('');
    } catch (err) {
      setMessage('Something went wrong. Try again!');
    }
  };

  const handleReflectionSave = () => {
    alert("Reflection saved. Thank you for sharing!");
    setShowReflection(false);
    setReflection('');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>How are you feeling today?</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mood:</label>
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginBottom: 16 }}
          />
        </div>
        <div>
          <label>Note:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 16 }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Save Mood</button>
      </form>
      {message && <p>{message}</p>}

      {showReflection && (
        <div style={{ background: '#ffe0b2', padding: 14, borderRadius: 10, marginTop: 16 }}>
          <h4>Want to talk about it?</h4>
          <textarea
            placeholder="Write what's bothering you..."
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            rows={4}
            style={{ width: '95%', borderRadius: 8, border: '1px solid #ccc' }}
          />
          <button onClick={handleReflectionSave} style={{
            marginTop: 8,
            background: '#eee',
            padding: '7px 15px',
            borderRadius: 20,
            border: 'none',
          }}>
            Save Reflection
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodForm;
