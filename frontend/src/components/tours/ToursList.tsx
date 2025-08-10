import { useEffect } from 'react';
import { useTours } from '../../hooks/useTours';
//  Components
import TourCard from './TourCard';
import TourCardSkeleton from './TourCardSkeleton';
import ToursError from './ToursError';
import EmptyTours from './EmptyTours';

const ToursList = () => {
  // Custom hook to manage tours state
  const { tours, isLoading, error, loadAllTours, refreshTours, clearError } = useTours();

  // Load tours on component mount
  useEffect(() => {
    loadAllTours();
  }, [loadAllTours]);

  // Handle retry
  const handleRetry = () => {
    clearError();
    refreshTours();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="tour-container">
        <div className="tour-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <TourCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="tour-container">
        <ToursError error={error} onRetry={handleRetry} />
      </div>
    );
  }

  // Empty state
  if (!tours.length) {
    return (
      <div className="tour-container">
        <EmptyTours />
      </div>
    );
  }

  // Success state
  return (
    <div className="tour-container">
      <div className="tour-grid">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
};

export default ToursList;