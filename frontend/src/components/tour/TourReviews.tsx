import type { Tour } from '../../types/tour.types';
import ReviewCard from './ReviewCard';

interface TourReviewsProps {
  tour: Tour;
}

const TourReviews = ({ tour }: TourReviewsProps) => {
  return (
    <section className="tour-reviews">
      <div className="relative z-10 skew-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10 mt-4">
            What Our Guests Say
          </h2>

        {/* Wide Screen: Horizontal Scroll */}
        <div className="hidden md:block">
          <div className="overflow-x-auto mb-4">
            <div className="flex space-x-6 px-4 min-w-max">
              {tour.reviews?.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Layout */}
        <div className="md:hidden">
          <div className="px-2 space-y-6 mb-4">
            {tour.reviews?.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};  

export default TourReviews;