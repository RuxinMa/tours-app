import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { FiUser } from 'react-icons/fi';
import type { Tour } from '../../types/tour.types';

import BookingCard from './BookingCard';
import Button from '../common/Button';

interface TourBookingProps {
  tour: Tour;
}

const TourBooking = ({ tour }: TourBookingProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Image Cover */}
          <div className="relative h-48 md:h-64">
            <img
              src={tour.imageCover}
              alt={`${tour.name} booking`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                What are you waiting for?
              </h2>
              <p className="text-white/90 text-lg">
                {tour.duration} days. 1 adventure. Infinite memories. Make it yours today!
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8">
            {/* User Not Authenticated */}
            {!isAuthenticated ? (
              <div className="text-center">
                <div className="mb-6">
                  <FiUser size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Sign in to book this tour
                  </h3>
                  <p className="text-gray-600">
                    Please log in to your account to proceed with booking
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={handleLoginRedirect}
                  fullWidth={true}
                >
                  Log in to book tour
                </Button>
              </div>
            ) : (
              user ? (
                <BookingCard tour={tour} user={user} /> // Pass user data to BookingCard
              ) : null
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourBooking;