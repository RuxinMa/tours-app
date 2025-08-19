import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import Modal from './Modal';
import Button from './Button';

export interface ReviewSubmitData {
  rating: number;
  review: string;
  reviewId?: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  tourInfo: {
    id: string;
    name: string;
    slug?: string;
  };
  existingReview?: {
    id: string;
    rating: number;
    review: string;
  };
  onSubmit: (data: ReviewSubmitData) => void;
  isLoading?: boolean;
}

const ReviewModal = ({
  isOpen,
  onClose,
  mode,
  tourInfo,
  existingReview,
  onSubmit,
  isLoading = false
}: ReviewModalProps) => {
  // State Management
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [errors, setErrors] = useState<{rating?: string; review?: string}>({});

  // Effect to reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if(mode === 'edit' && existingReview) {
        setRating(existingReview.rating);
        setReviewText(existingReview.review);
      } else {
        setRating(0);
        setReviewText('');
      }
      setErrors({}); // Reset errors
    }
  }, [isOpen, mode, existingReview]);

  // Star click handler
  const handleStarClick = (starValue: number) => {
    if (isLoading) return;
    setRating(starValue);
    setErrors(prev => ({ ...prev, rating: '' }));
  };

  // Content change handler
  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isLoading) return; 
    const newValue = e.target.value;
    if (newValue.length <= 300) {  // Limit to 300 characters
      setReviewText(newValue);
      setErrors(prev => ({ ...prev, review: '' }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: {rating?: string; review?: string} = {};
    if (rating <= 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (reviewText.trim().length < 10) {
      newErrors.review = 'Review must be at least 10 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = () => {
    if (isLoading) return;

    if (validateForm()) {
      const submitData: ReviewSubmitData = {
        rating,
        review: reviewText.trim(),
      };
      if (mode === 'edit' && existingReview) {
        submitData.reviewId = existingReview.id;
      }
      onSubmit(submitData);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  // Render stars
  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            disabled={isLoading} 
            className="focus:outline-none hover:scale-110 transition-transform"
          >
            <FiStar
              className={`w-6 h-6 cursor-pointer transition-colors ${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? 'Write a Review' : 'Edit Review'}
      size="lg"
    >
      <div className="md:space-y-6 space-y-4">
        {/* Tour */}
        <div>
          <h3 className="text-lg font-semibold text-emerald-500 mb-4">
            {tourInfo.name}
          </h3>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          {renderStars()}
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={reviewText}
            onChange={handleReviewChange}
            disabled={isLoading}
            onPaste={(e) => {e.stopPropagation();}} 
            onCopy={(e) => {e.stopPropagation();}}
            onCut={(e) => {e.stopPropagation();}} // Prevent copy/cut/paste
            placeholder="Share your experience..."
            rows={5}
            className="w-full md:text-base text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
          />
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500">
              {reviewText.length}/300 characters
            </span>
            {errors.review && (
              <p className="text-red-500 text-sm">{errors.review}</p>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-between md:space-x-16 space-x-4 md:pt-4 md:px-2">
          <Button 
            variant="secondary" 
            onClick={onClose} 
            disabled={isLoading}
            className='md:text-base text-sm w-1/3 md:w-full'
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={isLoading}
            className='md:text-base text-sm w-1/2 md:w-full'
          >
            {isLoading ? 'Submitting...' : mode === 'create' ? 'Submit Review' : 'Update Review'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewModal;