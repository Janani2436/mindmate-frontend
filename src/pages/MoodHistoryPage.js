import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import MoodHistory from '../components/MoodHistory';
import MoodGraph from '../components/MoodGraph';

const MoodHistoryPage = () => {
  const [moods, setMoods] = useState([]);

  const fetchMoods = async () => {
    try {
      const res = await axios.get('/api/mood');
      setMoods(res.data);
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const deleteMood = async (id) => {
    try {
      await axios.delete(`/api/mood/${id}`);
      setMoods((prev) => prev.filter((mood) => mood._id !== id));
    } catch (error) {
      console.error('Error deleting mood:', error);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '1rem 0' }}>📝 Your Mood Journal</h1>
      <MoodGraph />
      <MoodHistory moods={moods} deleteMood={deleteMood} />
    </div>
  );
};

export default MoodHistoryPage;
