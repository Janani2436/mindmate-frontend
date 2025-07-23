import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import MoodHistory from '../components/MoodHistory';
import MoodGraph from '../components/MoodGraph';
import MoodStreak from '../components/MoodStreak';
import MainLayout from '../components/MainLayout';
import { useThemeMood } from '../context/ThemeMoodContext';
import './MoodHistoryPage.css'; // ✅ We'll build this next

const MoodHistoryPage = () => {
  const [moods, setMoods] = useState([]);
  const [showBreath, setShowBreath] = useState(false);
  const { mood } = useThemeMood();

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await axios.get('/api/mood');
        setMoods(res.data);
      } catch (error) {
        console.error('Error fetching moods:', error);
      }
    };

    fetchMoods();
  }, []);

  const deleteMood = async (id) => {
    try {
      await axios.delete(`/api/mood/${id}`);
      setMoods((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error('Error deleting mood:', error);
    }
  };

  return (
    <MainLayout>
      <div className="mood-history-container">
        <h1 className="heading">📝 Your Mood Journal</h1>

        <MoodStreak />
        <MoodGraph />

        {/* 🌬️ Wellness card shown for intense emotions */}
        {['sad', 'anxious', 'angry'].includes(mood) && (
          <div className="wellness-card">
            <h4>🌬️ Take a Moment</h4>
            <button
              onClick={() => setShowBreath((prev) => !prev)}
              className="breathe-btn"
            >
              {showBreath ? 'Hide Exercise' : 'Start Breathing Exercise'}
            </button>
            {showBreath && (
              <iframe
                title="Breathing Exercise"
                src="https://www.youtube.com/embed/SEfs5TJZ6Nk?autoplay=1&controls=0"
                allow="autoplay"
                className="breathing-video"
              ></iframe>
            )}
            <p>Inhale... Exhale... You got this. 💜</p>
          </div>
        )}

        {/* 🌿 Happy mood message */}
        {mood === 'happy' && (
          <div className="wellness-card happy">
            <h4>🌱 Spread the Good!</h4>
            <p>Gratitude challenge: Who or what made you smile today?</p>
            <button
              className="gratitude-btn"
              onClick={() => alert("Gratitude saved! You're awesome. 💚")}
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
