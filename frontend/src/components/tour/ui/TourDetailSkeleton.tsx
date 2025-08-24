// 🎯 Loading Skeleton for Tour Detail
const TourDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="relative h-96 bg-gray-300">
        <div className="absolute bottom-8 left-8 right-8">
          <div className="h-12 bg-gray-400 rounded mb-4"></div>
          <div className="flex space-x-4">
            <div className="h-6 bg-gray-400 rounded w-32"></div>
            <div className="h-6 bg-gray-400 rounded w-40"></div>
          </div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-8 bg-gray-300 rounded w-48"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailSkeleton;