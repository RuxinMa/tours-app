/* eslint-disable react-refresh/only-export-components */
/**
 * 🖼️ Image URL utilities
 * Handles image path resolution for tours, users, etc.
 */

// 图片基础路径配置
const getImageBaseUrl = (): string => {
  // 开发环境：使用后端的静态文件路径
  if (import.meta.env.DEV) {
    return 'http://localhost:8000/img';
  }
  
  // 生产环境：使用部署的后端路径
  return 'https://toursapp-production.up.railway.app/img';
};

/**
 * 获取 Tour 封面图片的完整 URL
 */
export const getTourImageUrl = (imageName: string): string => {
  if (!imageName) return './pub'; // 默认图片
  
  // 如果已经是完整 URL，直接返回
  if (imageName.startsWith('http')) {
    return imageName;
  }
  
  // 构建完整的图片 URL
  return `${getImageBaseUrl()}/tours/${imageName}`;
};

/**
 * 获取用户头像的完整 URL
 */
export const getUserImageUrl = (imageName: string): string => {
  if (!imageName || imageName === 'default.jpg') {
    return '/img/users/default.jpg'; // 🔧 修改为正确的路径
  }
  
  // 如果已经是完整 URL，直接返回
  if (imageName.startsWith('http') || imageName.startsWith('/img/')) {
    return imageName;
  }
  
  // 构建完整的图片 URL
  return `${getImageBaseUrl()}/users/${imageName}`;
};
/**
 * 获取 Tour 图片集的完整 URL 数组
 */
export const getTourImagesUrls = (imageNames: string[]): string[] => {
  return imageNames.map(imageName => getTourImageUrl(imageName));
};

/**
 * 图片加载错误处理
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget;
  
  // 设置默认图片
  if (img.src.includes('/tours/')) {
    img.src = '/images/default-tour.jpg';
  } else if (img.src.includes('/users/')) {
    img.src = '/images/default-user.jpg';
  }
};

/**
 * 图片组件的 props 接口
 */
export interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * 通用图片组件
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