// MindMate frontend - MainLayout.js
import React from 'react';
import { useThemeMood } from '../context/ThemeMoodContext';
import AdaptiveVisual from './AdaptiveVisual';
import BackgroundFilterOverlay from './BackgroundFilterOverlay';
import './MainLayout.css'; 

const MainLayout = ({ children }) => {
  const { theme } = useThemeMood();

  return (
    <div className="layout-container">
      <AdaptiveVisual visualKey={theme.visual} />

      {/* background colour is changed based on emotions */}
      <BackgroundFilterOverlay />

      <main className="layout-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
