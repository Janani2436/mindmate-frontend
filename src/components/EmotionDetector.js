// MindMate frontend - EmotionDetector.js
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import './EmotionDetector.css'; 

const EmotionDetector = () => {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState('');

  const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error('Camera error:', err));
  };

  useEffect(() => {
    loadModels().then(startVideo);

    const interval = setInterval(async () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === 4 &&
        faceapi.nets.tinyFaceDetector.params
      ) {
        const detections = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections && detections.expressions) {
          const sorted = Object.entries(detections.expressions).sort((a, b) => b[1] - a[1]);
          setEmotion(sorted[0][0]);
        } else {
          setEmotion('');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getEmoji = (emotion) => {
    const map = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      surprised: '😮',
      fearful: '😨',
      disgusted: '🤢',
      neutral: '😐',
    };
    return map[emotion] || '❓';
  };

  return (
    <div className="emotion-detector-container">
      <h2 className="title">🎥 Real-Time Emotion Detector</h2>
      <div className="camera-card">
        <video
          ref={videoRef}
          autoPlay
          muted
          width="100%"
          height="auto"
          className="camera-video"
        />
      </div>
      <div className="emotion-display">
        <h3>
          {emotion
            ? `${getEmoji(emotion)} Detected Emotion: ${emotion.toUpperCase()}`
            : '😶 No face detected'}
        </h3>
      </div>
    </div>
  );
};

export default EmotionDetector;
