import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true, // Include cookies in requests
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.log('Unauthorized access - token may be expired');
    }
    
    return Promise.reject(error);
  }
);

export default api;