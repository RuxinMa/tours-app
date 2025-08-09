import { AxiosError } from 'axios';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isAuthError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Utility function to get a user-friendly error message based on status code
const getErrorMessage = (status: number): string => {
  switch (status) {
   case 401:
      return '😊 Please log in to continue';
    case 403:
      return '😫 You do not have permission to access this resource';
    case 404:
      return '🥵 Resource not found';
    case 422:
      return '⚠️ Please check your input and try again';
    case 429:
      return '⏳ Too many requests. Please wait a moment';
    case 500:
      return '🫨 Server error. Please try again later';
    case 502:
      return '🔧 Service temporarily unavailable';
    case 503:
      return '🚧 Service under maintenance';
    default:
      return '🥲 Something went wrong. Please try again';
  }
};

// Main error handler - simple and clear
export const handleApiError = (error: AxiosError): ApiError => {
  // Network error (no response)
  if (!error.response) {
    return new ApiError('🌐 Network error. Please check your connection and try again.');
  }

  // HTTP error (response with error status)
  const { status } = error.response;
  const message = getErrorMessage(status);
  const isAuthError = status === 401;

  return new ApiError(message, status, isAuthError);
};

// Handle authentication errors
export const handleAuthError = () => {
  console.warn('🔐 Authentication failed - redirecting to login');
  
  if (window.location.pathname !== '/login') {
    console.warn('🔐 Redirecting to login page...');
    window.location.href = '/login';
  }
};

// Simple development logging
export const logError = (error: ApiError, originalError: AxiosError) => {
  if (import.meta.env.MODE === 'development') {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.statusCode,
      url: originalError.config?.url,
      method: originalError.config?.method,
      responseData: originalError.response?.data,
      responseStatus: originalError.response?.status,
      requestHeaders: originalError.config?.headers,
    });
  }
};