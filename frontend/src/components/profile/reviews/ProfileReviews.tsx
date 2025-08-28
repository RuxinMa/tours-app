import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import Empty from '../../../assets/profile-empty.svg';
import type { ReviewWithTourInfo } from '../../../types/review';
import type { ReviewSubmitData } from '../../common/ReviewModal';
import { useReviews } from '../../../hooks/useReviews'; 
import { useTours } from '../../../hooks/useTours';

// Components
import ReviewCard from './ReviewHistoryCard';
import { FormTitle } from '../../layout/SettingsForm';
import Alert from '../../common/Alert';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import ReviewModal from '../../common/ReviewModal';

const ProfileReviews = () => {
  const navigate = useNavigate();

  // 🎣 Use hooks
  const {
    getUserReviewsWithTourInfo,
    isLoading,
    error,
    loadUserReviews,
    handleEditReviewSubmit,
    handleDeleteReview,
    clearError,
    selectReview,
    clearSelectedReview,
    currentReview
  } = useReviews();
  
  const { loadAllTours, isLoading: toursLoading } = useTours();

  // Get reviews with tour info for display
  const reviews = getUserReviewsWithTourInfo();

  // 🎨 Local UI state only
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [selectedReviewForModal, setSelectedReviewForModal] = useState<ReviewWithTourInfo | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 📄 Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await loadAllTours();
      await loadUserReviews();
    };
    loadData();
  }, [loadAllTours, loadUserReviews]);

  // 🧹 Cleanup on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearSelectedReview();
    };
  }, [clearError, clearSelectedReview]);

  const handleEditReview = (review: ReviewWithTourInfo) => {
    console.log('🎯 Opening edit modal for review:', review.id);
    
    setSelectedReviewForModal(review);
    
    // Create Review object for hook
    const reviewForSelection = {
      id: review.id,
      rating: review.rating,
      review: review.review,
      user: review.user,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      tour: review.tour.id 
    };
    
    selectReview(reviewForSelection);
    setIsEditingModalOpen(true);
  };

  const handleDeleteClick = (reviewId: string) => {
    console.log('🎯 Opening delete modal for review:', reviewId);
    
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    setSelectedReviewForModal(review);
    
    const reviewForSelection = {
      id: review.id,
      rating: review.rating,
      review: review.review,
      user: review.user,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      tour: review.tour.id 
    };
    
    selectReview(reviewForSelection);
    setIsDeleteModalOpen(true);
  };

  // 🔧 Modal handlers
  const handleEditSubmit = async (data: ReviewSubmitData) => {
    console.log('📝 Submitting edit:', data);
    
    const result = await handleEditReviewSubmit(data);
    
    if (result.success) {
      // ✅ Close modal on success
      closeEditModal();
    } else {
      console.error('❌ Edit failed:', result.error);
      // Keep modal open on error so user can see the error and try again
    }
  };

  const handleEditCancel = () => {
    console.log('🚫 Edit cancelled');
    closeEditModal();
  };

  const confirmDelete = async () => {
    if (!currentReview) return;
    
    const result = await handleDeleteReview(currentReview.id);
    
    if (result.success) {
      // ✅ Close modal on success
      closeDeleteModal();
    } else {
      console.error('❌ Delete failed:', result.error);
      // Keep modal open on error
    }
  };

  const cancelDelete = () => {
    closeDeleteModal();
  };

  // 🔧 Modal state helpers
  const closeEditModal = () => {
    setIsEditingModalOpen(false);
    setSelectedReviewForModal(null);
    clearSelectedReview();
    clearError();
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedReviewForModal(null);
    clearSelectedReview();
    clearError();
  };

  const getTourInfo = (review: ReviewWithTourInfo | null) => {
    if (!review || !review.tour) {
      return { id: '', name: 'Unknown Tour', slug: '' };
    }
    return {
      id: review.tour.id || '',
      name: review.tour.name || 'Unknown Tour',
      slug: review.tour.slug || ''
    };
  };

  if (isLoading || toursLoading) {
    return (
      <div className="container p-6 md:p-8">
        <FormTitle title="My Reviews" icon={<FiStar />} />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="ml-3 text-gray-600">Loading your reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6 md:p-8">
      <FormTitle title="My Reviews" icon={<FiStar />} />

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={clearError}
        />
      )}

      {/* Content */}
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
            <Button variant='primary' onClick={() => navigate('/')} fullWidth={true}>
              Browse Tours
            </Button>
          </div>
        </div>
      ) : (
        <ReviewCard 
          reviews={reviews}
          onEdit={handleEditReview}
          onDelete={handleDeleteClick}
        />
      )}
      
      {/* Edit Review Modal */}
      <ReviewModal
        isOpen={isEditingModalOpen}
        onClose={handleEditCancel}
        mode="edit"
        tourInfo={getTourInfo(selectedReviewForModal)}
        existingReview={selectedReviewForModal ? {
          id: selectedReviewForModal.id,
          rating: selectedReviewForModal.rating,
          review: selectedReviewForModal.review
        } : undefined}
        onSubmit={handleEditSubmit}
      />
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        title="Delete Review"
        size="md"
      >
        <div className="text-center flex flex-col items-center gap-3">
          <h3 className="md:text-2xl text-xl font-medium text-gray-900 mb-2">
            Are you sure?
          </h3>
          <p className="text-gray-600 text-base">
            You are about to delete your review for{' '}
            <span className="font-bold italic text-emerald-500">
              {getTourInfo(selectedReviewForModal).name}
            </span>.
            This action cannot be undone.
          </p>
          <div className="flex justify-between w-full mt-6 space-x-16 px-4">
            <Button variant="secondary" onClick={cancelDelete} fullWidth={true}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} fullWidth={true}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileReviews;