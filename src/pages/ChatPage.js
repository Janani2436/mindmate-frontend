import React, { useState, useRef, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import EmojiPicker from 'emoji-picker-react';
import './ChatPage.css'; // ✅ Use enhanced stylesheet
import { useAuthContext } from '../context/AuthContext';
import { useThemeMood } from '../context/ThemeMoodContext';
import MainLayout from '../components/MainLayout';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);
  const { token } = useAuthContext();
  const { setMood } = useThemeMood();
  const navigate = useNavigate();

  // Supported languages
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ta', label: 'Tamil' },
    { code: 'te', label: 'Telugu' },
    { code: 'ar', label: 'Arabic' },
    { code: 'zh', label: 'Chinese' },
  ];

  const getEmotionLabel = (emotion) => {
    switch (emotion) {
      case 'happy': return '😊 Happy';
      case 'sad': return '😢 Sad';
      case 'angry': return '😠 Angry';
      case 'anxious': return '😰 Anxious';
      case 'lonely': return '🤗 Lonely';
      case 'confused': return '😵 Confused';
      case 'excited': return '🤩 Excited';
      default: return '🤖 Neutral';
    }
  };

  // Fetch chat history
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const localMessages = JSON.parse(localStorage.getItem('mindmate_messages')) || [];
        let backendMessages = [];

        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('/api/chat/history');
        backendMessages = res.data.flatMap((chat) =>
          chat.messages.map((msg) => ({
            sender: msg.role === 'user' ? 'user' : 'bot',
            text: msg.content,
            emotion: msg.emotion || null,
            time: new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }))
        );

        setMessages([...backendMessages, ...localMessages]);
      } catch (err) {
        console.error('Failed to load messages:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    loadMessages();
  }, [token, navigate]);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('mindmate_messages', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  // Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = selectedLanguage;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => prev + ' ' + transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, [selectedLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    isListening ? recognitionRef.current.stop() : recognitionRef.current.start();
    setIsListening((prev) => !prev);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedMessages = [...messages, { sender: 'user', text: input, time: userTime }];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);
    setShowEmojiPicker(false);

    try {
      const res = await axios.post('/api/chat', {
        message: input,
        language: selectedLanguage,
      });

      const { reply, emotion } = res.data;
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (emotion) {
        setMood(emotion);
        localStorage.setItem('latestMood', emotion);
      }

      setMessages([
        ...updatedMessages,
        { sender: 'bot', text: reply, time: botTime, emotion },
      ]);

      speak(reply);
    } catch (err) {
      const errorMsg = '⚠️ Sorry, something went wrong.';
      setMessages([...updatedMessages, { sender: 'bot', text: errorMsg, time: userTime }]);
      speak(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('mindmate_messages');
  };

  return (
    <MainLayout>
      <div className="chat-container">
        <h2 className="chat-heading">💬 Talk to MindMate</h2>

        <div className="language-selector">
          🌐 Language:&nbsp;
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              <div className="message-header">
                <strong>{msg.sender === 'user' ? 'You' : 'MindMate'}</strong>
                <span className="timestamp">{msg.time}</span>
              </div>
              {msg.sender === 'bot' && msg.emotion && (
                <div className="emotion-tag">
                  {getEmotionLabel(msg.emotion)}
                </div>
              )}
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              <em>MindMate is typing...</em>
            </div>
          )}
        </div>

        <div className="chat-input-wrapper">
          <button
            className="emoji-btn"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            title="Insert emoji"
          >
            😊
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
          />
          <button
            className={`mic-btn ${isListening ? 'active' : ''}`}
            onClick={toggleListening}
            title="Voice input"
          >
            {isListening ? '🛑' : '🎤'}
          </button>
          <button onClick={handleSend} title="Send message">📤 Send</button>
        </div>

        {showEmojiPicker && (
          <div className="emoji-picker-wrapper">
            <EmojiPicker onEmojiClick={handleEmojiClick} height={300} />
          </div>
        )}

        <button onClick={handleClearChat} className="clear-chat-btn" title="Clear Conversation History">
          🧹 Clear Chat
        </button>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
