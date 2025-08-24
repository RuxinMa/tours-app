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

  const { status, data } = error.response;
  const isAuthError = status === 401;

  // 🔧 添加详细调试信息
  console.log('🔧 handleApiError - Full error object:', error);
  console.log('🔧 handleApiError - Response status:', status);
  console.log('🔧 handleApiError - Response data:', data);
  console.log('🔧 handleApiError - Data type:', typeof data);
  
  if (data && typeof data === 'object') {
    console.log('🔧 handleApiError - Data keys:', Object.keys(data));
    console.log('🔧 handleApiError - data.message:', (data as any).message);
    console.log('🔧 handleApiError - data.error:', (data as any).error);
  }

  let message: string;
  
  if (data && typeof data === 'object') {
    message = (data as any).message || 
              (data as any).error?.message || 
              (data as any).msg ||
              getErrorMessage(status);
  } else {
    message = getErrorMessage(status);
  }

  console.log('🔧 handleApiError - Final message:', message);
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

export const transformErrorMessage = (errorMessage: string): string => {
  if (errorMessage.includes('E11000') && errorMessage.includes('email')) {
    return 'This email address is already registered. Please use a different email or try logging in.';
  }
  
  if (errorMessage.includes('password') && errorMessage.includes('shorter than the minimum')) {
    return 'Password must be at least 8 characters long.';
  }
  
  if (errorMessage.includes('email') && errorMessage.includes('valid email')) {
    return 'Please enter a valid email address.';
  }
  
  if (errorMessage.includes('name') && errorMessage.includes('required')) {
    return 'Name is required.';
  }
  
  if (errorMessage.includes('passwordConfirm') || errorMessage.includes('Passwords do not match')) {
    return 'Passwords do not match. Please try again.';
  }
  
  if (errorMessage.includes('User validation failed')) {
    const validationMatch = errorMessage.match(/Path `(\w+)` .+? is (required|shorter than|longer than)/);
    if (validationMatch) {
      const field = validationMatch[1];
      const issue = validationMatch[2];
      
      switch (field) {
        case 'password':
          return issue.includes('shorter') ? 'Password must be at least 8 characters long.' : 'Password is invalid.';
        case 'email':
          return 'Please enter a valid email address.';
        case 'name':
          return 'Name is required and must be valid.';
        default:
          return `${field.charAt(0).toUpperCase() + field.slice(1)} is ${issue}.`;
      }
    }
    
    return 'Please check your input and try again.';
  }
  
  return errorMessage;
};