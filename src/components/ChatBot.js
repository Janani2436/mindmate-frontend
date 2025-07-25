// MindMate frontend - ChatBot.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
        message: input,
      });

      // handles AI response
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: response.data.reply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: '😓 Sorry, something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const downloadChatAsTxt = () => {
    const formatted = messages.map(msg =>
      `${msg.sender === 'user' ? 'You' : 'MindMate'}: ${msg.text}`
    ).join('\n\n');

    const blob = new Blob([formatted], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'MindMate_Chat_History.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender === 'user' ? 'user' : 'ai'}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message ai">🧠 Thinking...</div>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your thoughts..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={downloadChatAsTxt} className="export-btn">📄 Export</button>
      </div>
    </div>
  );
};

export default ChatBot;
