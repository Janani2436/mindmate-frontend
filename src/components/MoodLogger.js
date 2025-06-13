// client/src/components/MoodLogger.js
import React, { useState } from 'react';

const MoodLogger = () => {
  const [mood, setMood] = useState('');

  const handleMoodSubmit = (e) => {
    e.preventDefault();
    if (!mood.trim()) return;

    const newMood = {
      mood,
      date: new Date().toLocaleString(),
    };

    const existingMoods = JSON.parse(localStorage.getItem('moods')) || [];
    const updatedMoods = [newMood, ...existingMoods];
    localStorage.setItem('moods', JSON.stringify(updatedMoods));
    setMood('');
    alert('Mood saved ✅');
  };

  return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <h2>📝 Log Your Mood</h2>
      <form onSubmit={handleMoodSubmit}>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="How are you feeling?"
          style={{ padding: '10px', width: '60%', borderRadius: '8px', marginRight: '1rem' }}
        />
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px' }}>
          Save
        </button>
      </form>
    </div>
  );
};

export default MoodLogger;
