/* eslint-disable react-refresh/only-export-components */
/**
 * Image URL utilities
 * Handles image path resolution for tours, users, etc.
 */

// Image base path configuration
const getImageBaseUrl = (): string => {
  // Development environment: use backend static file path
  if (import.meta.env.DEV) {
    return 'http://localhost:8000/img';
  }
  
  // Production environment: use environment variable or fallback
  // For Vercel+Railway: VITE_API_BASE_URL=https://tours-app-backend-production.up.railway.app
  // For AWS: VITE_API_BASE_URL=https://toursapp.duckdns.org
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://toursapp.duckdns.org';
  
  // Remove /api/v1 suffix if present, then add /img
  const baseUrl = apiBaseUrl.replace('/api/v1', '');
  return `${baseUrl}/img`;
};

/**
 * Get full URL for Tour cover image
 */
export const getTourImageUrl = (imageName: string): string => {
  if (!imageName) return './pub'; // Default image
  
  // If already a complete URL, return directly
  if (imageName.startsWith('http')) {
    return imageName;
  }
  
  // Build complete image URL
  return `${getImageBaseUrl()}/tours/${imageName}`;
};

/**
 * Get full URL for user avatar
 */
export const getUserImageUrl = (imageName: string | null | undefined): string => {
  // Handle null/undefined/empty cases
  if (!imageName || imageName === 'default.jpg') {
    return `${getImageBaseUrl()}/users/default.jpg`;
  }
  
  // If already a complete URL, return directly
  if (imageName.startsWith('http')) {
    return imageName;
  }
  
  // If already has /img/ prefix, construct full URL
  if (imageName.startsWith('/img/')) {
    const baseUrl = import.meta.env.DEV ? 'http://localhost:8000' : 'https://toursapp-production.up.railway.app';
    return `${baseUrl}${imageName}`;
  }
  
  // If it's just a filename (newly uploaded format), build complete URL
  if (!imageName.includes('/')) {
    return `${getImageBaseUrl()}/users/${imageName}`;
  }
  
  // For other path formats, try to normalize
  const normalizedPath = imageName.startsWith('/') ? imageName : `/${imageName}`;
  const baseUrl = import.meta.env.DEV ? 'http://localhost:8000' : 'https://toursapp-production.up.railway.app';
  return `${baseUrl}${normalizedPath}`;
};

/**
 * Get full URL array for Tour image collection
 */
export const getTourImagesUrls = (imageNames: string[]): string[] => {
  return imageNames.map(imageName => getTourImageUrl(imageName));
};

/**
 * Image loading error handler
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget;
  
  // Set default image based on context
  if (img.src.includes('/tours/')) {
    img.src = '/images/default-tour.jpg';
  } else if (img.src.includes('/users/')) {
    img.src = `${getImageBaseUrl()}/users/default.jpg`;
  }
};

/**
 * Image component props interface
 */
export interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * Universal image component with error handling
 */
export const SafeImage: React.FC<ImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  onError = handleImageError,
  ...props 
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={onError}
      {...props}
    />
  );
};