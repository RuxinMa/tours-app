import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          className={`h-5 w-5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReviewCard = ({ review }: { review: any }) => {
  return (
    <div className="bg-white md:p-8 p-5 rounded-lg shadow-md mb-6 md:h-64 md:w-96 w-full">
      <div className="flex flex-col gap-2">
        {/* User Info */}
        <div className="flex items-center mb-2 gap-4">
          {review.user.photo && (
            <img 
              src={review.user.photo} 
              alt={`${review.user.name}'s photo`} 
              className="avatar" 
            />
          )}
          <p className="text-gray-400 font-light md:text-base text-sm">{review.user.name}</p>
        </div>

        {/* Review Content */}
        <p className='text-gray-600 md:text-base text-sm'>{review.review}</p>

        {/* Star Rating */}
        <div className="mt-2">
          <StarRating rating={review.rating} />
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;