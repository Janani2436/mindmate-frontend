// MindMate frontend - ThemeMoodContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import moodThemes from '../constants/moodThemes';

const ThemeMoodContext = createContext();

export const ThemeMoodProvider = ({ children }) => {
  const [mood, setMoodState] = useState('neutral');

  // sets initial mood as neutral
  useEffect(() => {
    const stored = localStorage.getItem('latestMood');
    if (stored && moodThemes[stored]) {
      setMoodState(stored);
    }
  }, []);

  // theme is changed based on the mood of user
  useEffect(() => {
    const theme = moodThemes[mood] || moodThemes.neutral;
    const root = document.documentElement; 

    if (root) {
      // sets data for mood
      root.setAttribute('data-mood', mood);

      
      root.style.setProperty('--bg', theme.bg);
      root.style.setProperty('--primary', theme.primary);
      root.style.setProperty('--accent', theme.accent);
    }

    localStorage.setItem('latestMood', mood);
  }, [mood]);

  const setMood = (newMood) => {
    if (moodThemes[newMood]) {
      setMoodState(newMood);
    } else {
      setMoodState('neutral');
    }
  };

  return (
    <ThemeMoodContext.Provider
      value={{ mood, setMood, theme: moodThemes[mood] || moodThemes.neutral }}
    >
      {children}
    </ThemeMoodContext.Provider>
  );
};

export const useThemeMood = () => {
  const context = useContext(ThemeMoodContext);
  if (!context) throw new Error('useThemeMood must be used within a ThemeMoodProvider');
  return context;
};
