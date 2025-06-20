// client/src/pages/MoodHistoryPage.js
import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import MoodHistory from '../components/MoodHistory';
import { useNavigate } from 'react-router-dom';

const MoodHistoryPage = () => {
  const [moods, setMoods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchMoods();
    }
  }, [navigate]);

  const fetchMoods = async () => {
    try {
      const res = await axios.get('/mood'); // ✅ Removed /api
      setMoods(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMood = async (id) => {
    try {
      await axios.delete(`/mood/${id}`); // ✅ Removed /api
      setMoods((prev) => prev.filter((mood) => mood._id !== id));
    } catch (err) {
      console.error(err);
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
