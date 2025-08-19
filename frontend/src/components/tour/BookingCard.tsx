import { useState } from 'react';
import type { Tour } from '../../types/tour.types';
import type { User } from '../../types/user';
import { FiCalendar, FiCreditCard, FiShield } from 'react-icons/fi';
import { useBookings } from '../../hooks/useBookings';
import Button from '../common/Button';

interface BookingCardProps {
  tour: Tour;
  user: User | null;
}

const PricingSummary =({
  subtitle,
  value,
} : {
  subtitle: string,
  value: string | number,
}) => {
  return (
    <div className='flex justify-between md:text-base text-sm'>
      <span className="text-gray-600">{subtitle}</span>
      <span className="font-medium">${value}</span>
    </div>
  );
};

const BookingCard = ({ tour, user }: BookingCardProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { 
    createCheckoutSession, 
    isSubmitting, 
    error: bookingError,
    clearError: clearBookingError,
  } = useBookings();

  const getAvailableDates = () => {
    if (!tour.startDates) return [];
    const now = new Date();

    return tour.startDates
      .map(dateStr => new Date(dateStr))
      .filter(date => date > now)
      .sort((a, b) => a.getTime() - b.getTime())
      .slice(0, 3); // Show only the first 3 available dates
  };

  const availableDates = getAvailableDates(); // Get available dates for the tour

  // 🔄 Handle booking with useBookings hook
  const handleBooking = async () => {
    // Clear any previous errors
    if (bookingError) {
      clearBookingError();
    }

    // Validation
    if (!selectedDate) {
      alert('Please select a date first!');
      return;
    }

    try {
      const result = await createCheckoutSession(tour.id);
      
      if (result.success) {
        console.log('✅ BookingCard: Checkout session created successfully');
        // The hook will automatically redirect to Stripe checkout
      } else {
        alert(result.error || 'Failed to create checkout session. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    }
  };

  const isButtonDisabled = !selectedDate || isSubmitting || availableDates.length === 0;

  const getButtonText = () => {
    if (isSubmitting) return 'Creating Checkout...';
    if (availableDates.length === 0) return 'No Dates Available';
    return 'Book Tour Now';
  };


  return (
    <div>
      {/* 🔄 Show booking error if exists */}
      {bookingError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{bookingError}</p>
          <button 
            onClick={clearBookingError}
            className="text-red-500 text-xs underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 md:gap-8">
        {/* Left Side: Booking Information */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Book Your Adventure
          </h3>

          {/* Date Selection */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-medium text-gray-500 mb-3">
              <FiCalendar className="mr-2" />
              Select Date
            </label>
            <div className="space-y-2">
              {availableDates.length > 0 ? (
                availableDates.map((date) => {
                  const dateString = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                  return (
                    <label key={dateString} className="flex items-center">
                      <input
                        type="radio"
                        name="tourDate"
                        value={dateString}
                        checked={selectedDate === dateString}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="mr-3 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-gray-700">{dateString}</span>
                    </label>
                  );
                })
              ) : (
                <p className="text-gray-500 italic">No upcoming dates available</p>
              )}
            </div>
          </div>

          {/* User Information Confirmation */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
            <p className="text-sm text-gray-600 mb-1">Name: {user?.name}</p>
            <p className="text-sm text-gray-600 mb-1">Email: {user?.email}</p>
          </div>
        </div>

        {/* Right Side: Pricing and Payment */}
        <div>
          <div className="bg-green-50 rounded-lg p-6 mb-4">
            <h4 className="font-semibold text-gray-900 mb-4">Pricing Summary</h4>
            <div className="space-y-2">
              <PricingSummary subtitle={tour.name} value={tour.price} />
              <PricingSummary subtitle="Duration" value={`${tour.duration} days`} />
              <PricingSummary subtitle="Group Size" value={`Max ${tour.maxGroupSize} people`} />
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-green-600">${tour.price}</span>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="flex items-start space-x-3 mb-6 text-sm text-gray-600">
            <FiShield className="text-green-500 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">Secure Payment</p>
              <p>Your payment information is secure and encrypted</p>
            </div>
          </div>

          {/* Booking Button */}
          <Button
            variant={isButtonDisabled ? 'secondary' : 'primary'}
            onClick={handleBooking}
            disabled={isButtonDisabled}
            fullWidth={true}
          >
            <div className="flex items-center justify-center space-x-3">
              <FiCreditCard />
              <span>{getButtonText()}</span>
            </div>
          </Button>
        </div>
      </div>
    </div>

  );
};

export default BookingCard;