import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
