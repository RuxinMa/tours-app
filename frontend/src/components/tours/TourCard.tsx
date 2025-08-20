import type { Tour } from '../../types/tour.types';
import { Link } from 'react-router-dom';
import { FiClock, FiUsers, FiMapPin, FiCalendar } from 'react-icons/fi';
import { getTourImageUrl } from '../../services/utils/imageUtils';
import Button from '../common/Button';

// Format the start date to a more readable format
const formatStartDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    month: 'long', 
    year: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

const TourCard = ({ tour }: { tour: Tour }) => {
  return (
    <div className="tour-card">
      {/* Tour Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getTourImageUrl(tour.imageCover)}
          alt={tour.name}
          className="tour-image-cover"
        />
        {/* Difficulty Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
            tour.difficulty === 'easy' 
              ? 'bg-green-100 text-green-800'
              : tour.difficulty === 'medium'
              ? 'bg-yellow-100 text-yellow-800'  
              : 'bg-red-100 text-red-800'
          }`}>
            {tour.difficulty}
          </span>
        </div>
      </div>

      {/* Tour Content */}
      <div className="p-6">
        {/* Tour Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {tour.name}
        </h3>

        {/* Tour Summary */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {tour.summary}
        </p>

        {/* Tour Details */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-6">
          {/* Duration */}
          <div className="tour-details">
            <FiClock />
            <span>{tour.duration} days</span>
          </div>

          {/* Group Size */}
          <div className="tour-details">
            <FiUsers />
            <span>{tour.maxGroupSize} people</span>
          </div>

          {/* Start Location */}
          <div className="tour-details">
            <FiMapPin />
            <span>{tour.startLocation.description}</span>
          </div>

          {/* Start Date */}
          <div className="tour-details">
            <FiCalendar />
            <span>{formatStartDate(tour.startDates[0])}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Price and Ratings */}
          <div> 
            <div className="md:text-xl font-bold text-green-600">
              ${tour.price}
              <span className="text-details">per person</span>
            </div>
            {tour.ratingsAverage && (
              <div className="text-sm font-bold text-amber-500 mt-1">
                {tour.ratingsAverage} <span className="text-amber-500">★</span>
                <span className="text-details">({tour.ratingsQuantity} reviews)</span>
              </div>
            )}
          </div>
          <Button
            variant="primary"
            size="md"
            fullWidth={false}
          >
            <Link 
              to={`/tour/${tour.slug}`} 
              className="text-sm sm:text-base text-white"
            >
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;