// Simple function to get API base URL from environment
export const getApiBaseURL = (): string => {
  console.log('🔧 Environment variables check:');
  // Use environment variable if available
  if (import.meta.env.VITE_API_URL) {
    console.log('✅ Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Environment-based fallbacks only when env var is not set
  const fallbackUrl = import.meta.env.MODE === 'production' 
    ? 'https://13.211.205.235/api/v1'
    : 'http://localhost:3000/api/v1';

  console.log('⚠️ Using fallback URL:', fallbackUrl);
  return fallbackUrl;
};

// Get timeout from environment or use default
export const getApiTimeout = (): number => {
  const envTimeout = import.meta.env.VITE_API_TIMEOUT;
  if (envTimeout) {
    return Number(envTimeout);
  }
  
  // Default timeouts based on environment
  return import.meta.env.MODE === 'production' ? 15000 : 10000;
};

// Check if mock mode is enabled
export const isMockEnabled = (): boolean => {
  return import.meta.env.VITE_USE_MOCK === 'true';
};

// Simple retry configuration
export const getRetryConfig = () => ({
  maxRetries: Number(import.meta.env.VITE_MAX_RETRIES) || 3,
  baseDelay: Number(import.meta.env.VITE_RETRY_DELAY) || 1000,
});

// Log current configuration in all environments for debugging
console.log('🔧 Current API Configuration:', {
  baseURL: getApiBaseURL(),
  timeout: getApiTimeout(),
  mockEnabled: isMockEnabled(),
  environment: import.meta.env.MODE,
  allEnvVars: {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT,
    VITE_USE_MOCK: import.meta.env.VITE_USE_MOCK,
  }
});