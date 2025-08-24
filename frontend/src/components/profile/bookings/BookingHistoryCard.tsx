import { useNavigate } from 'react-router-dom';
import type { BookingDisplayData } from '../../../types/booking';
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import { getBookingStatusText, getBookingStatusStyle } from '../menuItem';

interface BookingHistoryCardProps {
  bookings: BookingDisplayData[];
  onAddReview: (booking: BookingDisplayData) => void;
}

const BookingHistoryCard = ({ bookings, onAddReview }: BookingHistoryCardProps) => {
  const navigate = useNavigate();

  // Handle button click based on booking status
  const handleButtonClick = (booking: BookingDisplayData) => {
    switch (booking.status) {
      case 'planned':
        navigate(`/tour/${booking.tourSlug}`);
        break;
      case 'pending-review':
        onAddReview(booking); // Open review modal
        break;
      case 'reviewed':
        navigate(`/me#reviews`);
        break;
    }
  };

  return (
    <div className="grid gap-6">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/tour/${booking.tourSlug}`)}
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Cover */}
            <div className="md:w-48 h-36 md:h-auto flex-shrink-0">
              <img
                src={booking.imageCover}
                alt={booking.tourName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {booking.tourName}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-2 md:mb-4">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" />
                      <span>
                        {new Date(booking.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <FiMapPin className="mr-2" />
                      <span>{booking.startLocation}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <FiClock className="mr-2" />
                      <span>{booking.duration} days</span>
                    </div>
                  </div>

                  <div className="text-lg font-bold text-emerald-500">
                    ${booking.price}
                  </div>
                </div>

                {/* Button */}
                <div className="mt-4 md:mt-0 md:ml-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleButtonClick(booking);
                    }}
                    className={`${getBookingStatusStyle(booking.status)}
                      px-4 py-3 font-semibold md:text-base rounded-lg text-sm transition-colors`}
                  >
                    {getBookingStatusText(booking.status)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingHistoryCard;