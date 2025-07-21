import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import animationData from './aiAnimation.json';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useAuthContext } from '../../context/AuthContext';
import axios from '../../utils/axiosInstance';
import './VideoChat.css';

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

// --- Animated Avatar with Play/Stop Logic ---
function AnimatedAvatar({ isSpeaking }) {
  const lottieRef = useRef();
  useEffect(() => {
    const l = lottieRef.current;
    if (!l) return;
    if (isSpeaking) l.play();
    else l.stop();
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

  useEffect(() => {
    const getUserVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('❌ Error accessing webcam:', err);
      }
    };
    getUserVideo();
  }, []);

  useEffect(() => {
    if (!listening && transcript) setMessage(transcript);
  }, [listening, transcript]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsAiReplying(true);

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
      console.error('❌ AI Error:', err.message);
      setAiReply('❌ AI failed to respond.');
      setIsSpeaking(false);
    } finally {
      setIsAiReplying(false);
      setMessage('');
      resetTranscript();
    }
  };

  // Sync speaking state to avatar animation
  const speakReply = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage;
    utterance.pitch = 1.2;
    utterance.rate = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStartSpeech = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: selectedLanguage });
  };

  return (
    <div className="video-chat-container">
      <h2 className="video-chat-heading">💬 Real-Time Multilingual AI Video Chat</h2>
      <div className="language-selector">
        🌍 Language:
        <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>
      <div className="video-call-box">
        <div className="user-video-box">
          <video ref={videoRef} autoPlay muted playsInline />
          <p className="video-label">👤 You</p>
        </div>
        <div className="ai-video-box">
          <AnimatedAvatar isSpeaking={isSpeaking || isAiReplying} />
          <p className="video-label">🤖 MindMate AI</p>
        </div>
      </div>
      <div className="chat-box">
        <strong>AI:</strong> {isAiReplying ? 'Typing...' : aiReply || 'Waiting...'}
      </div>
      <div className="chat-box">
        <textarea
          placeholder="Type or speak your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={listening}
        />
        <div className="btn-group">
          <button className="speak-btn" onClick={handleStartSpeech}>
            🎤 {listening ? 'Listening...' : 'Speak'}
          </button>
          <button className="send-btn" onClick={handleSend}>
            📨 Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
