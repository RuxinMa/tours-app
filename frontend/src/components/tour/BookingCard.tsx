import { useState } from 'react';
import type { Tour } from '../../types/tour.types';
import type { User } from '../../types/user';
import { FiCalendar, FiCreditCard, FiShield } from 'react-icons/fi';
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
}; // PricingSummary component to display pricing details

const BookingCard = ({ tour, user }: BookingCardProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);

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

  // 💢 Handle booking (simulate Stripe integration)
  const handleBooking = async () => {
    if (!selectedDate) {
      alert('Please select a date first!');
      return;
    }
    setIsBooking(true);
    // Simulate API call and Stripe processing
    try {
      console.log('Processing booking...', {
        tourId: tour.id,
        userId: user?.id,
        date: selectedDate,
        amount: tour.price
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Booking successful! You've booked ${tour.name} for ${selectedDate}`);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const isReadyToBook = !selectedDate || isBooking || availableDates.length === 0;

  return (
    <div>
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
            variant={isReadyToBook ? 'secondary' : 'primary'}
            onClick={handleBooking}
            disabled={isReadyToBook}
            fullWidth={true}
          >
            <div className="flex items-center justify-center space-x-3">
              <FiCreditCard />
              <span>
                {isBooking ? 'Processing...' : 'Book Tour Now'}
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>

  );
};

export default BookingCard;