// src/services/api.js
import axios from 'axios';

// Get API URL - hardcoded for production
const API_URL = 'https://api.gcc.conship.ai/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (where the shell stores it)
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API request with token:', {
        url: config.url,
        hasToken: true,
        tokenPreview: token.substring(0, 20) + '...'
      });
    } else {
      console.warn('No token found in localStorage for API request:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API response success:', response.config.url);
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        message: error.response.data?.message || error.message,
        url: error.config?.url
      });
      
      if (error.response.status === 401) {
        console.error('Authentication failed - token may be invalid or expired');
        // Optionally, redirect to login
        // window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('Network error - no response received');
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
