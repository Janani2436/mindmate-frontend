import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const EmotionDetector = () => {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState('');

  // Load models
  const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
  };

  // Start webcam
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
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Emotion Detector</h2>
      <video ref={videoRef} autoPlay muted width="480" height="360" style={{ borderRadius: '10px' }} />
      <h3>Detected Emotion: {emotion || 'No face detected'}</h3>
    </div>
  );
};

export default EmotionDetector;
