import { useEffect } from 'react';
import type { Tour } from '../../types/tour.types';
import { useReviews } from '../../hooks/useReviews';
import ReviewCard from './ReviewCard';
import Alert from '../common/Alert';

interface TourReviewsProps {
  tour: Tour;
}

const TourReviews = ({ tour }: TourReviewsProps) => {
  // 🎣 Use reviews hook
  const {
    getTourReviews,
    loadTourReviews,
    isLoading,
    error,
    clearError
  } = useReviews();

  // Get reviews for this tour
  const reviews = getTourReviews(tour.id);

  // Load reviews when component mounts or tour changes
  useEffect(() => {
    loadTourReviews(tour.id);
  }, [tour.id, loadTourReviews]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  return (
    <section className="tour-reviews">
      <div className="relative z-10 skew-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10 mt-4">
          What Our Guests Say
        </h2>

        {/* Error Alert */}
        {error && (
          <div className="px-4 mb-6">
            <Alert
              type="error"
              message={error}
              onClose={clearError}
            />
          </div>
        )}

       {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span className="ml-3 text-white">Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white text-lg">No reviews yet for this tour.</p>
          </div>
        ) : (
          <>
            {/* Wide Screen: Horizontal Scroll */}
            <div className="hidden md:block">
              <div className="overflow-x-auto mb-4">
                <div className="flex space-x-6 px-4 min-w-max">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile: Vertical Layout */}
            <div className="md:hidden">
              <div className="px-2 space-y-6 mb-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};  

export default TourReviews;