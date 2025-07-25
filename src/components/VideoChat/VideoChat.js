// MinsdMate frontend - VideoChat.js
import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import animationData from './aiAnimation.json';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useAuthContext } from '../../context/AuthContext';
import axios from '../../utils/axiosInstance';
import './VideoChat.css'; // enhancement 

const LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  hi: 'Hindi',
  zh: 'Chinese',
  ar: 'Arabic',
  ja: 'Japanese',
};

function AnimatedAvatar({ isSpeaking }) {
  const lottieRef = useRef();

  useEffect(() => {
    isSpeaking ? lottieRef.current?.play() : lottieRef.current?.stop();
  }, [isSpeaking]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop
      autoplay={false}
      className="lottie-avatar"
    />
  );
}

const VideoChat = () => {
  const [aiReply, setAiReply] = useState('');
  const [message, setMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAiReplying, setIsAiReplying] = useState(false);

  const videoRef = useRef(null);
  const { token } = useAuthContext();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // webcam is connected
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
  }, []);

  // updates text from speech
  useEffect(() => {
    if (!listening && transcript) setMessage(transcript);
  }, [listening, transcript]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsAiReplying(true);
    setAiReply('');

    try {
      const res = await axios.post(
        '/api/ai/videochat',
        { prompt: message, language: selectedLanguage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reply = res.data?.response || '🤖 AI didn’t reply.';
      setAiReply(reply);
      speakReply(reply);
    } catch (err) {
      const errorText =
        err.code === 'ECONNABORTED'
          ? '⏱ The AI is taking too long. Please try again.'
          : '❌ AI failed to respond.';
      setAiReply(errorText);
      setIsSpeaking(false);
    } finally {
      setIsAiReplying(false);
      setMessage('');
      resetTranscript();
    }
  };

  const speakReply = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = selectedLanguage;
    utter.pitch = 1.1;
    utter.rate = 1;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.cancel(); // overlapping is prevented
    window.speechSynthesis.speak(utter);
  };

  const handleStartSpeech = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: selectedLanguage });
  };

  return (
    <div className="video-chat-wrapper">
      <div className="video-chat-content">
        <div className="video-box">
          <div className="user-section">
            <video ref={videoRef} autoPlay muted playsInline className="user-video" />
            <p className="label">👤 You</p>
          </div>
          <div className="ai-section">
            <AnimatedAvatar isSpeaking={isSpeaking || isAiReplying} />
            <p className="label">🤖 MindMate AI</p>
          </div>
        </div>

        <div className="chat-section">
          <div className="ai-response">
            <strong>AI:</strong> {isAiReplying ? 'Typing...' : aiReply || 'Waiting...'}
          </div>

          <textarea
            className="chat-input"
            placeholder="Type or speak your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={listening || isAiReplying}
          />

          <div className="language-mic-bar">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={listening}
              className="language-select"
            >
              {Object.entries(LANGUAGES).map(([code, label]) => (
                <option key={code} value={code}>
                  🌐 {label}
                </option>
              ))}
            </select>

            <button
              onClick={handleStartSpeech}
              disabled={isAiReplying}
              className="speech-btn"
            >
              🎤 {listening ? 'Listening...' : 'Speak'}
            </button>

            <button onClick={handleSend} disabled={isAiReplying} className="send-btn">
              📩 Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
