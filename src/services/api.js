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
    // Try multiple sources for the token
    let token = null;
    
    // 1. Try shellContext from props (passed through components)
    const shellContext = window.shellContext;
    if (shellContext?.token) {
      token = shellContext.token;
      console.log('Using token from window.shellContext');
    }
    
    // 2. Try localStorage as fallback
    if (!token) {
      token = localStorage.getItem('auth_token');
      if (token) {
        console.log('Using token from localStorage');
      }
    }
    
    // 3. Debug log
    console.log('API request:', {
      url: config.url,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'no token'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found for API request!');
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
