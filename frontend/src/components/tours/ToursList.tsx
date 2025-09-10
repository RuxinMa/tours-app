import { useEffect, useState } from 'react';
import { useTours } from '../../hooks/useTours';
import { useToursUrlSync } from '../../hooks/useToursUrlSync';
//  Components
import TourCard from './TourCard';
import TourCardSkeleton from './TourCardSkeleton';
import ToursError from './ToursError';
import EmptyTours from './EmptyTours';
import ToursFilter from './ToursFilter';

const ToursList = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Hooks
  const { 
    tours, 
    allTours, 
    isLoading, 
    error, 
    loadAllTours, 
    refreshTours, 
    clearError, 
    getFilterOptions 
  } = useTours();
  const { applyFiltersWithUrl, clearFiltersWithUrl, currentFilters } = useToursUrlSync();

  // Load tours on component mount
  useEffect(() => {
    setIsInitialLoading(true);
    loadAllTours().finally(() => {
      setIsInitialLoading(false);
    });
  }, [loadAllTours]);

  // Handle retry
  const handleRetry = () => {
    clearError();
    refreshTours();
  };

  // Loading state
  if (isInitialLoading || isLoading) {
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

  // Empty state - no tours at all
  if (!allTours.length) {
    return (
      <div className="tour-container">
        <EmptyTours 
          title="No Tours Available" 
          message="Please check back later or explore other sections of the site." 
        />
      </div>
    );
  }

  // Success state - show filter and results
  return (
    <div className="tour-container">
      {/* Filter Component */}
      <ToursFilter
        currentFilters={currentFilters}
        filterOptions={getFilterOptions()}
        onApplyFilters={applyFiltersWithUrl}
        onClearFilters={clearFiltersWithUrl}
      />
      {/* Results */}
      {tours.length > 0 ? (
        <div className="tour-grid">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        // Empty state - no tours match filters
        <EmptyTours 
          title="No Tours Match Your Filters" 
          message="Try adjusting your filters or check back later." 
        />
      )}
    </div>
  );
};

export default ToursList;