// src/api/axios.js
import axios from 'axios';

// All calls to "/api/..." in the client will be proxied to http://localhost:5000/api/...
const api = axios.create({
  baseURL: '/api',
});

// Request interceptor to add the Authorization header if a token exists
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  error => Promise.reject(error)
);

// (Optional) Response interceptor to handle global errors
api.interceptors.response.use(
  response => response,
  error => {
    // e.g. auto-logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // you might redirect to login here
    }
    return Promise.reject(error);
  }
);

export default api;
