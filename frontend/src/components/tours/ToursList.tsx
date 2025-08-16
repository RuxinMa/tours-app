import { useEffect } from 'react';
import { useTours } from '../../hooks/useTours';
import { useToursUrlSync } from '../../hooks/useToursUrlSync';
//  Components
import TourCard from './TourCard';
import TourCardSkeleton from './TourCardSkeleton';
import ToursError from './ToursError';
import EmptyTours from './EmptyTours';
import ToursFilter from './ToursFilter';

const ToursList = () => {
  // Custom hooks
  const { tours, allTours, isLoading, error, loadAllTours, refreshTours, clearError, getFilterOptions } = useTours();
  const { applyFiltersWithUrl, clearFiltersWithUrl, currentFilters } = useToursUrlSync();

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

  // Empty state - no tours at all
  if (!allTours.length) {
    return (
      <div className="tour-container">
        <EmptyTours />
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
        resultsCount={tours.length}
        totalCount={allTours.length}
      />

      {/* Results */}
      {tours.length > 0 ? (
        <div className="tour-grid">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tours found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
          <button
            onClick={clearFiltersWithUrl}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ToursList;