import React from 'react';
import { useThemeMood } from '../context/ThemeMoodContext';
import AdaptiveVisual from './AdaptiveVisual';
import BackgroundFilterOverlay from './BackgroundFilterOverlay';
import './MainLayout.css'; // base layout styling

const MainLayout = ({ children }) => {
  const { theme } = useThemeMood();

  return (
    <div className="layout-container">
      <AdaptiveVisual visualKey={theme.visual} />

      {/* 🎨 Mood-based color overlay */}
      <BackgroundFilterOverlay />

      <main className="layout-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
