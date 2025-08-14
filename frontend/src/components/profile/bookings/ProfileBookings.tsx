import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar } from 'react-icons/fi';
import Empty from '../../../assets/profile-empty.svg';
import type { Booking } from '../../../types/booking';
import type { ReviewSubmitData } from '../../common/ReviewModal';
import { mockBookings } from '../../../dev-data/mockBookings';

// Components
import { FormTitle } from '../../layout/SettingsForm';
import Button from '../../common/Button';
import BookingHistoryCard from './BookingHistoryCard';
import ReviewModal from '../../common/ReviewModal';

const ProfileBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  // State for adding review modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleAddReview = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (data: ReviewSubmitData) => {
    if (selectedBooking) {
      // Update booking status to reviewed
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === selectedBooking.id 
            ? {
                ...booking,
                status: 'reviewed' as const,
                review: {
                  id: `review-${Date.now()}`, // Unique ID for the review
                  rating: data.rating,
                  review: data.review
                }
              }
            : booking
        )
      );
      
      setIsReviewModalOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleReviewCancel = () => {
    setIsReviewModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="container p-6 md:p-8">
      <FormTitle title="My Bookings" icon={<FiCalendar />} />

      {bookings.length === 0 ? (
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
        <BookingHistoryCard bookings={bookings} onAddReview={handleAddReview} />
      )}

      {/* Add Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleReviewCancel}
        mode="create"
        tourInfo={{
          id: selectedBooking?.tour.id || '',
          name: selectedBooking?.tour.name || '',
          slug: selectedBooking?.tour.slug
        }}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default ProfileBookings;