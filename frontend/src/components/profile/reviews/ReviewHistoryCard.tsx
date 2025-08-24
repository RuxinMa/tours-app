import { useNavigate } from 'react-router-dom';
import { FiStar, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';
import type { ReviewWithTourInfo } from '../../../types/review';
import Button from '../../common/Button';

interface ReviewCardProps {
  reviews: ReviewWithTourInfo[];
  onEdit: (review: ReviewWithTourInfo) => void;
  onDelete: (reviewId: string) => void;
}

const ReviewCard = ({ reviews, onEdit, onDelete }: ReviewCardProps) => {
  const navigate = useNavigate();
  
  // Filter out reviews without tour information
  const validReviews = reviews.filter(review => 
    review.tour && 
    review.tour.name && 
    review.tour.slug
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleTourClick = (tour: ReviewWithTourInfo['tour']) => {
    if (tour?.slug) {
      navigate(`/tour/${tour.slug}`);
    }
  };
  
  // If no valid reviews, show a message
  if (validReviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews available for active tours.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {validReviews.map((review) => (
        <div
          key={review.id}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col md:flex-row">
            {/* Tour Image */}
            <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
              <img
                src={`/img/tours/${review.tour.imageCover}`}
                alt={review.tour.name}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handleTourClick(review.tour)}
                onError={(e) => {
                  // If image fails to load, use default image
                  (e.target as HTMLImageElement).src = '/img/tours/default-tour.jpg';
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-1">
                  {/* Tour Name - Clickable */}
                  <h3 
                    className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-emerald-600 transition-colors"
                    onClick={() => handleTourClick(review.tour)}
                  >
                    {review.tour.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="mb-3">
                    {renderStars(review.rating)}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-gray-700 mb-4 leading-relaxed md:text-base text-sm">
                    {review.review}
                  </p>

                  {/* Date */}
                  <div className="flex items-center text-xs md:text-sm text-gray-500">
                    <FiCalendar className="mr-2" />
                    <span>Reviewed on {formatDate(review.createdAt)}</span>
                    {review.updatedAt && review.updatedAt !== review.createdAt && (
                      <span className="ml-2">(Updated {formatDate(review.updatedAt)})</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="md:ml-4 flex md:flex-col mt-4 flex-row gap-5">
                  <Button
                    variant='edit'
                    onClick={() => onEdit(review)}
                  >
                    <FiEdit2 className="mr-2" size={14} />
                    Edit
                  </Button>

                  <Button
                    variant='delete'
                    onClick={() => onDelete(review.id)}
                  >
                    <FiTrash2 className="mr-2" size={14} />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewCard;