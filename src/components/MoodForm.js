import React, { useState } from 'react';
import axios from '../utils/axiosInstance';

const MoodForm = () => {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/mood', {
        mood,
        note,
      });

      setMessage('Mood saved successfully!');
      setMood('');
      setNote('');
    } catch (err) {
      setMessage('Something went wrong. Try again!');
      console.error(err);
    }
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
            style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label>Note:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
          ></textarea>
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>
          Save Mood
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default MoodForm;
