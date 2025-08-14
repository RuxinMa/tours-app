import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import Empty from '../../../assets/profile-empty.svg';
import type { Review } from '../../../types/review';
import type { ReviewSubmitData } from '../../common/ReviewModal';
import { mockReviews } from '../../../dev-data/mockReviews';

// Components
import ReviewCard from './ReviewHistoryCard';
import { FormTitle } from '../../layout/SettingsForm';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import ReviewModal from '../../common/ReviewModal';

const ProfileReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  // ✏️ State for editing review
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);

  // 🗑️ State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  const handleEditReview = (review: Review) => {
    setReviewToEdit(review);
    setIsEditingModalOpen(true);
  };

  const handleDeleteReview = (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      setReviewToDelete(review);
      setIsDeleteModalOpen(true);
    }
  };

  const handleEditSubmit = (data: ReviewSubmitData) => {
    if (reviewToEdit && data.reviewId) {
      // 🎯 Update Review
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === data.reviewId 
            ? {
                ...review,
                rating: data.rating,
                review: data.review,
                updatedAt: new Date().toISOString() // 🎯 Edit time
              }
            : review
        )
      );
      // Close modal
      setIsEditingModalOpen(false);
      setReviewToEdit(null);
    }
  };

  const handleEditCancel = () => {
    setIsEditingModalOpen(false);
    setReviewToEdit(null);
  };

  const confirmDeleteReview = () => {
    if (reviewToDelete) {
      setReviews(prevReviews => 
        prevReviews.filter(review => review.id !== reviewToDelete.id)
      );
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
    }
  };

  const cancelDeleteReview = () => {
    setIsDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  return (
    <div className="container p-6 md:p-8">
      <FormTitle title="My Reviews" icon={<FiStar />} />

      {reviews.length === 0 ? (
        <div className="text-center p-10">
          <div className="text-gray-400 mb-4 flex flex-col justify-center items-center gap-2">
            <img 
              src={Empty} 
              alt="No Reviews" 
              className="mx-auto w-64 md:w-96 h-auto mb-8" 
            />
            <h3 className="text-xl font-semibold text-gray-900">No reviews yet</h3>
            <p className="text-gray-600 mb-8">Book a tour to leave a review!</p>
            <Button variant='primary' onClick={() => navigate('/')} fullWidth={true}>Browse Tours</Button>
          </div>
        </div>
      ) : (
        <ReviewCard 
          reviews={reviews}
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
        />
      )}
      {/* Edit Review Modal */}
      <ReviewModal
        isOpen={isEditingModalOpen}
        onClose={handleEditCancel}
        mode="edit"
        tourInfo={{
          id: reviewToEdit?.tour.id || '',
          name: reviewToEdit?.tour.name || '',
          slug: reviewToEdit?.tour.slug
        }}
        existingReview={reviewToEdit ? {
          id: reviewToEdit.id,
          rating: reviewToEdit.rating,
          review: reviewToEdit.review
        } : undefined}
        onSubmit={handleEditSubmit}
      />
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={cancelDeleteReview}
        title="Delete Review"
        size="md"
      >
        <div className="text-center flex flex-col items-center gap-3">
          <h3 className="md:text-2xl text-xl font-medium text-gray-900 mb-2">
            Are you sure?
          </h3>
          <p className="text-gray-600 text-base">
            You are about to delete your review for{' '}
            <span className="font-bold italic text-emerald-500">{reviewToDelete?.tour.name}</span>.
            This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-8 mt-6">
            <Button variant="danger" onClick={confirmDeleteReview}>Delete</Button>
            <Button variant="secondary" onClick={cancelDeleteReview}> Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileReviews;