// MindMate frontend - AdaptiveVisual.jsq
import React from 'react';
import Lottie from 'lottie-react';

import confetti from '../assets/confetti.json';
import waves from '../assets/waves.json';
import rain from '../assets/rain.json';
import orb from '../assets/orb.json';

const visuals = {
  confetti,
  waves,
  gentleRain: rain,
  breathingOrb: orb,
};

const AdaptiveVisual = ({ visualKey }) => {
  const animation = visuals[visualKey];
  if (!animation) return null;

  return (
    <Lottie
      animationData={animation}
      loop
      autoplay
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        opacity: 0.15,
        zIndex: 0,
      }}
    />
  );
};

export default AdaptiveVisual;
