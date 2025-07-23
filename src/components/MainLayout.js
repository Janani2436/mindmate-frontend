import React from 'react';
import { useThemeMood } from '../context/ThemeMoodContext';
import AdaptiveVisual from './AdaptiveVisual';

const MainLayout = ({ children }) => {
  const { theme } = useThemeMood();

  return (
    <div style={{ position: 'relative' }}>
      <AdaptiveVisual visualKey={theme.visual} />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'var(--bg)',
          minHeight: '100vh',
          padding: '2rem 1.5rem',
          boxSizing: 'border-box',
          transition: 'background 0.4s ease-in-out',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
