import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import MoodHistory from '../components/MoodHistory';
import MoodGraph from '../components/MoodGraph';
import MainLayout from '../components/MainLayout';
import MoodStreak from '../components/MoodStreak';
import { useThemeMood } from '../context/ThemeMoodContext';

const MoodHistoryPage = () => {
  const [moods, setMoods] = useState([]);
  const { mood } = useThemeMood();
  const [showBreath, setShowBreath] = useState(false);

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
    <MainLayout>
      <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center', margin: '1rem 0' }}>📝 Your Mood Journal</h1>
        <MoodStreak />
        <MoodGraph />
        {['sad', 'anxious', 'angry'].includes(mood) && (
          <div className="wellness-card">
            <h4>🌬️ Take a Moment</h4>
            <button onClick={() => setShowBreath((val) => !val)} className="breathe-btn">
              {showBreath ? 'Hide Exercise' : 'Start Breathing Exercise'}
            </button>
            {showBreath && (
              <iframe
                title="Breathing Exercise"
                src="https://www.youtube.com/embed/SEfs5TJZ6Nk?autoplay=1&controls=0"
                allow="autoplay"
                style={{
                  width: '100%',
                  height: 180,
                  border: 'none',
                  borderRadius: 8,
                  marginTop: 8,
                }}
              ></iframe>
            )}
            <p>Inhale... Exhale... you got this!</p>
          </div>
        )}
        {mood === 'happy' && (
          <div className="wellness-card happy">
            <h4>🌱 Spread the Good!</h4>
            <p>Gratitude challenge: Who or what made you smile today?</p>
            <button
              onClick={() => alert("Gratitude saved! You're awesome. 💚")}
              className="gratitude-btn"
            >
              Log Gratitude
            </button>
          </div>
        )}
        <MoodHistory moods={moods} deleteMood={deleteMood} />
      </div>
    </MainLayout>
  );
};

export default MoodHistoryPage;
