// chatAPI.js
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
export const fetchChatHistory = async (token) => {
  const res = await axios.get('/api/chat/history', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
