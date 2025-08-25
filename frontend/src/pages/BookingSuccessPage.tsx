import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import { useBookings } from '../hooks/useBookings';
import Button from '../components/common/Button';

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  // Custom hook to refresh user bookings
  const { refreshUserBookings } = useBookings();

  const sessionId = searchParams.get('session_id');
  const tourId = searchParams.get('tour');
  const userId = searchParams.get('user');

  useEffect(() => {
    if (sessionId && tourId && userId) {
      refreshUserBookings().then(() => {
        setTimeout(() => setIsLoading(false), 1500);
      });
    } else {
      navigate('/'); // Redirect to home if not successful
    }
  }, [sessionId, tourId, userId, refreshUserBookings, navigate]);


  if (isLoading) {
    return (
      <div className="page-background-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Processing your payment...
          </h2>
          <p className="text-gray-600">Please wait while we confirm your booking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-background-main flex items-center justify-center py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <FiCheckCircle className="h-8 w-8 text-green-500" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-6">
          {`Your booking has been confirmed. You will receive a confirmation email shortly.`}
        </p>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center text-blue-800 mb-2">
            <FiClock className="mr-2" />
            <span className="font-medium">What's Next?</span>
          </div>
          <ul className="text-sm text-blue-700 text-left space-y-1">
            <li>• Check your email for booking confirmation</li>
            <li>• View your booking in your profile</li>
            <li>• Prepare for your amazing adventure!</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={() => navigate('/me#bookings')}
            fullWidth={true}
          >
            <FiArrowRight className="mr-2" />
            View My Bookings
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            fullWidth={true}
          >
            Browse More Tours
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;