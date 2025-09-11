import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar } from 'react-icons/fi';
import Empty from '../../../assets/profile-empty.svg';
import type { BookingDisplayData } from '../../../types/booking';
import type { ReviewSubmitData } from '../../common/ReviewModal';
import { useBookings } from '../../../hooks/useBookings';
import { useReviews } from '../../../hooks/useReviews';

// Components
import { FormTitle } from '../../layout/SettingsForm';
import Button from '../../common/Button';
import Alert from '../../common/Alert';
import BookingHistoryCard from './BookingHistoryCard';
import ReviewModal from '../../common/ReviewModal';

const ProfileBookings = () => {
  const navigate = useNavigate();

  const { 
    userBookings, 
    isLoading, 
    error: bookingError,
    loadUserBookings,
    clearError: clearBookingError,
  } = useBookings();

  const {
    createReview,
    isSubmitting: isReviewSubmitting,
    error: reviewError,
    clearError: clearReviewError,
  } = useReviews();

  // State for adding review modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDisplayData | null>(null);

  // 🔄 Load bookings when component mounts
  useEffect(() => {
    loadUserBookings();
  }, [loadUserBookings]);

  // 🔄 Handle add review - opens modal
  const handleAddReview = (booking: BookingDisplayData) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
    
    if (reviewError) {
      clearReviewError();
    }
  };

  // 🔄 Handle review submission
  const handleReviewSubmit = async (data: ReviewSubmitData) => {
    if (!selectedBooking) {
      console.error('❌ ProfileBookings: No booking selected for review');
      return;
    }

    try {
      // 🔄 Create review using hook (this will also update booking status)
      const result = await createReview({
        tour: selectedBooking.tourId,
        rating: data.rating,
        review: data.review
      });

      if (result.success) {
        // Close modal
        setIsReviewModalOpen(false);
        setSelectedBooking(null);
        loadUserBookings();

        // Show success message
        alert('Review added successfully!');
      } else {
        alert(result.error || 'Failed to add review. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    }
  };

  // Handle review modal close
  const handleReviewCancel = () => {
    setIsReviewModalOpen(false);
    setSelectedBooking(null);
    
    // Clear review errors when closing
    if (reviewError) {
      clearReviewError();
    }
  };

  // 🔄 Loading state
  if (isLoading && userBookings.length === 0) {
    return (
      <div className="container p-6 md:p-8">
        <FormTitle title="My Bookings" icon={<FiCalendar />} />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="ml-3 text-gray-600">Loading your bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6 md:p-8">
      <FormTitle title="My Bookings" icon={<FiCalendar />} />

      {/* Error Alert */}
      {bookingError && (
        <Alert
          type="error"
          message={bookingError}
          onClose={clearBookingError}
        />
      )}

      {userBookings.length === 0 ? (
        <div className="text-center p-10">
          <div className="text-gray-400 mb-4 flex flex-col justify-center items-center gap-2">
            <img 
              src={Empty} 
              alt="No Reviews" 
              className="mx-auto w-64 md:w-96 h-auto mb-8" 
            />
            <h3 className="text-xl font-semibold text-gray-900">No bookings yet</h3>
            <p className="text-gray-600 mb-8">Start exploring our amazing tours!</p>
            <Button
              variant='primary'
              onClick={() => navigate('/')}
              fullWidth={true}
            >
              Browse Tours
            </Button>
          </div>
        </div>
      ) : (
        <BookingHistoryCard bookings={userBookings} onAddReview={handleAddReview} />
      )}

      {/* Add Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleReviewCancel}
        mode="create"
        tourInfo={{
          id: selectedBooking?.tourId || '',
          name: selectedBooking?.tourName || '',
          slug: selectedBooking?.tourSlug || '',
        }}
        onSubmit={handleReviewSubmit}
        isLoading={isReviewSubmitting}
      />
    </div>
  );
};

export default ProfileBookings;