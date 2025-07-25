// MindMate frontend - videoChatAPI.js
import axios from 'axios';

export const analyzeEmotion = async (imageBlob) => {
  const formData = new FormData();
  formData.append('image', imageBlob);

  try {
    const response = await axios.post('/api/emotion/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // emotions 
  } catch (error) {
    console.error('Emotion analysis failed:', error);
    throw new Error('Failed to analyze emotion');
  }
};
