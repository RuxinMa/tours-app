import axios from 'axios';
import { getApiBaseURL, getApiTimeout } from './utils/config';
import { handleApiError, handleAuthError, logError } from './utils/errorHandler';

// Create API instance with clean configuration
const api = axios.create({
  baseURL: getApiBaseURL(),
  timeout: getApiTimeout(),
  withCredentials: true, // Include cookies for cross-origin requests
});

// Request interceptor - clean logging
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.MODE === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request failed:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - focus on error handling only
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.MODE === 'development') {
      console.log(`✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Process errors using error handler
    const apiError = handleApiError(error);
    logError(apiError, error);
    
    // 🔧 Smart auth error handling - only redirect for protected routes
    if (apiError.isAuthError) {
      const currentPath = window.location.pathname;
      
      // Only redirect if accessing protected routes
      if (currentPath.startsWith('/me') && currentPath !== '/login') {
        console.warn('🔐 Accessing protected route without auth - redirecting to login');
        handleAuthError();
      }
    }
    
    return Promise.reject(apiError);
  }
);

export default api;