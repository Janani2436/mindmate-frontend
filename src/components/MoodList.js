// client/src/components/MoodList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MoodList = () => {
  const [moods, setMoods] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/mood');
        setMoods(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load moods');
      }
    };

    fetchMoods();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>📝 Your Mood History</h2>
      {error && <p>{error}</p>}
      {moods.length === 0 ? (
        <p>No moods saved yet.</p>
      ) : (
        <ul>
          {moods.map((mood) => (
            <li key={mood._id} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
              <strong>Mood:</strong> {mood.mood} <br />
              <strong>Note:</strong> {mood.note} <br />
              <small>{new Date(mood.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MoodList;
