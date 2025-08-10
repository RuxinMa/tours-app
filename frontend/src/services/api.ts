import axios from 'axios';
import { getApiBaseURL, getApiTimeout, isMockEnabled } from './utils/config';
import { handleApiError, handleAuthError, logError } from './utils/errorHandler';

// Create API instance with clean configuration
const api = axios.create({
  baseURL: getApiBaseURL(),
  timeout: getApiTimeout(),
  withCredentials: true, // Essential for cookie-based auth
});

// Simple request interceptor - just logging
api.interceptors.request.use(
  (config) => {
    // Clean development logging
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

  api.interceptors.response.use(
    (response) => {
      // Success logging in development
      if (import.meta.env.MODE === 'development') {
        console.log(`✅ ${response.status} ${response.config.url}`);
      }
      return response;
    },
    (error) => {
      // Handle mock success responses FIRST
      if (error.__mock_success) {
        console.log('🎭 Processing mock success response');
        return Promise.resolve(error.response);
      }
      
      // Process other errors using our simple error handler
      const apiError = handleApiError(error);
      
      // Log error details in development
      logError(apiError, error);
      
      // Handle auth errors specifically
      if (apiError.isAuthError) {
        handleAuthError();
      }
      
      // Always reject with our custom error
      return Promise.reject(apiError);
    }
  );

// Debug mock configuration
console.log('🔧 Mock Configuration Check:', {
  mockEnabled: isMockEnabled(),
  envVar: import.meta.env.VITE_USE_MOCK,
  allEnvVars: import.meta.env
});

// Keep your existing mock logic for learning
if (isMockEnabled()) {
  console.log('🎭 Mock mode enabled for development');
  
  // Your existing mock interceptor (with better debugging)
  api.interceptors.request.use((config) => {
    console.log('🎭 Mock interceptor checking request:', config.url, config.method);
    
    // Handle GET /users/me
    if (config.url === '/users/me' && config.method === 'get') {
      console.log('🎭 Mock /users/me - returning fake user data');
      
      return Promise.reject({
        response: {
          status: 200,
          data: {
            status: 'success',
            data: {
              doc: {
                id: 'test-user-123',
                name: 'Test User',
                email: 'admin@tours.io',
                role: 'user'
              }
            }
          }
        },
        __mock_success: true
      });
    }
    
    // Handle POST /users/login
    if (config.url === '/users/login' && config.data) {
      const { email, password } = config.data;
      console.log('🎭 Login attempt:', { email, password });
      
      if (email === 'admin@tours.io' && password === 'test1234') {
        console.log('🎭 Mock login success - returning fake response');
        
        // Return mock success immediately
        return Promise.reject({
          response: {
            status: 200,
            data: {
              status: 'success',
              data: {
                doc: {
                  id: 'test-user-123',
                  name: 'Test User',
                  email: 'admin@tours.io',
                  role: 'user'
                }
              }
            }
          },
          __mock_success: true
        });
      } else {
        console.log('🎭 Mock login failed - wrong credentials');
      }
    }
    
    return config;
  });
}

export default api;
export type { ApiError } from './utils/errorHandler';