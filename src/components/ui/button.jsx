// MindMate frontend - button.jsx
import React from 'react';

export const Button = ({ children, onClick, className = '', ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
