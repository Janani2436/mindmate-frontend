import React, { useState, useRef, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import EmojiPicker from 'emoji-picker-react';
import './ChatPage.css';
import { useAuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
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
      default: return '🤖 Neutral';
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const localMessages = JSON.parse(localStorage.getItem('mindmate_messages')) || [];

        let backendMessages = [];
        if (token) {
          const res = await axios.get('/api/chat/history');
          backendMessages = res.data.flatMap(chat =>
            chat.messages.map(msg => ({
              sender: msg.role === 'user' ? 'user' : 'bot',
              text: msg.content,
              emotion: msg.emotion || null,
              time: new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }))
          );
        }

        setMessages([...backendMessages, ...localMessages]);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    loadMessages();
  }, [token]);

  useEffect(() => {
    localStorage.setItem('mindmate_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
    };

    recognition.onerror = (e) => {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [selectedLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    isListening ? recognitionRef.current.stop() : recognitionRef.current.start();
    setIsListening(prev => !prev);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage;
    window.speechSynthesis.speak(utterance);
  };

  const downloadChatAsTxt = () => {
    const content = messages.map(msg => {
      const time = `[${msg.time}]`;
      const sender = msg.sender === 'user' ? 'You' : 'MindMate';
      const emotionTag = msg.emotion ? ` (${getEmotionLabel(msg.emotion)})` : '';
      return `${time} ${sender}${emotionTag}: ${msg.text}`;
    }).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'mindmate_chat.txt';
    link.click();

    URL.revokeObjectURL(url);
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
        language: selectedLanguage
      });

      const { reply, emotion } = res.data;
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages([
        ...updatedMessages,
        { sender: 'bot', text: reply, time: botTime, emotion }
      ]);

      speak(reply);
    } catch (err) {
      const errorMsg = '⚠️ Sorry, something went wrong.';
      setMessages([
        ...updatedMessages,
        { sender: 'bot', text: errorMsg, time: userTime }
      ]);
      speak(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji);
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('mindmate_messages');
  };

  return (
    <div className="chat-container">
      <h2>💬 Talk to MindMate</h2>

      {/* Language Selector */}
      <div style={{ marginBottom: '10px' }}>
        🌐 <label htmlFor="language-select">Language:</label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          style={{ marginLeft: '8px', padding: '4px' }}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>
      </div>

      <button onClick={downloadChatAsTxt} className="download-button">
        📄 Download Chat
      </button>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <div className="message-header">
              <strong>{msg.sender === 'user' ? 'You' : 'MindMate'}</strong>
              <span className="timestamp">{msg.time}</span>
            </div>
            {msg.sender === 'bot' && msg.emotion && (
              <div className="emotion-tag">{getEmotionLabel(msg.emotion)}</div>
            )}
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
        {isTyping && <div className="typing-indicator"><em>MindMate is typing...</em></div>}
      </div>

      <div className="chat-input-wrapper">
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="emoji-button">😊</button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message or use voice..."
        />

        <button onClick={toggleListening} className="mic-button" type="button">
          {isListening ? '🛑' : '🎤'}
        </button>

        <button onClick={handleSend}>Send</button>

        {showEmojiPicker && (
          <div className="emoji-picker">
            <EmojiPicker onEmojiClick={handleEmojiClick} height={300} />
          </div>
        )}
      </div>

      <div className="chat-footer">
        <button onClick={handleClearChat} className="clear-button">🧹 Clear Chat</button>
      </div>
    </div>
  );
};

export default ChatPage;
