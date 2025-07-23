import React, { createContext, useContext, useEffect, useState } from 'react';
import moodThemes from '../constants/moodThemes';

const ThemeMoodContext = createContext();

export const ThemeMoodProvider = ({ children }) => {
  const [mood, setMoodState] = useState('neutral');

  // Load from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem('latestMood');
    if (stored && moodThemes[stored]) {
      setMoodState(stored);
    }
  }, []);

  // Apply mood-based styles
  useEffect(() => {
    const theme = moodThemes[mood] || moodThemes.neutral;
    const root = document.documentElement; // <html>

    if (root) {
      // Apply mood classes + attributes
      root.setAttribute('data-mood', mood);

      // Set CSS variables for --bg, --primary, --accent
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
