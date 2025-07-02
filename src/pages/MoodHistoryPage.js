// client/src/pages/MoodHistoryPage.js
import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import MoodHistory from '../components/MoodHistory';

const MoodHistoryPage = () => {
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const res = await axios.get('/mood');
      setMoods(res.data);
    } catch (err) {
      console.error('Error fetching moods:', err);
    }
  };

  const deleteMood = async (id) => {
    try {
      await axios.delete(`/mood/${id}`);
      setMoods((prev) => prev.filter((mood) => mood._id !== id));
    } catch (err) {
      console.error('Error deleting mood:', err);
    }
  };

  return (
    <div>
      <h1>Your Mood Journal</h1>
      <MoodHistory moods={moods} deleteMood={deleteMood} />
    </div>
  );
};

export default MoodHistoryPage;
