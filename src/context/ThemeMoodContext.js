import React, { createContext, useContext, useEffect, useState } from 'react';
import moodThemes from '../constants/moodThemes';

const ThemeMoodContext = createContext();

export const ThemeMoodProvider = ({ children }) => {
  const [mood, setMoodState] = useState('neutral');

  useEffect(() => {
    const stored = localStorage.getItem('latestMood');
    if (stored && moodThemes[stored]) setMoodState(stored);
  }, []);

  useEffect(() => {
    const theme = moodThemes[mood] || moodThemes.neutral;
    document.body.setAttribute('data-mood', mood);
    document.body.style.setProperty('--bg', theme.bg);
    document.body.style.setProperty('--primary', theme.primary);
    document.body.style.setProperty('--accent', theme.accent);
    localStorage.setItem('latestMood', mood);
  }, [mood]);

  const setMood = (newMood) => {
    setMoodState(moodThemes[newMood] ? newMood : 'neutral');
  };

  return (
    <ThemeMoodContext.Provider value={{ mood, setMood, theme: moodThemes[mood] || moodThemes.neutral }}>
      {children}
    </ThemeMoodContext.Provider>
  );
};

export const useThemeMood = () => useContext(ThemeMoodContext);
