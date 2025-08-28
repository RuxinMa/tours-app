import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { reviewsService, ReviewsError } from '../services/reviewsService';
import {
  setLoading,
  setSubmitting,
  setError,
  clearError,
  setTourReviews,
  setUserReviews,
  addUserReview,
  updateUserReview,
  removeUserReview,
  setCurrentReview,
  clearCurrentReview,
  clearTourReviews,
} from '../store/slices/reviewsSlice';
import { updateUserBookingStatus } from '../store/slices/bookingsSlice';
import type { CreateReviewData, UpdateReviewData, Review, ReviewWithTourInfo } from '../types/review';
import type { ReviewSubmitData } from '../components/common/ReviewModal';

export const useReviews = () => {
  const dispatch = useAppDispatch();
  
  // Select state from Redux
  const reviewsState = useAppSelector((state) => state.reviews);
  const toursState = useAppSelector((state) => state.tours);
  const bookingsState = useAppSelector((state) => state.bookings);

  // 📄 Helper function to find booking by tour ID
  const findBookingByTourId = useCallback((tourId: string) => {
    return bookingsState.userBookings.find(booking => booking.tourId === tourId);
  }, [bookingsState.userBookings]);

  // 📖 Load reviews for a specific tour (Tour Detail Page)
  const loadTourReviews = useCallback(async (tourId: string) => {
    // Check if already loaded
    if (reviewsState.tourReviews[tourId]?.length > 0) {
      console.log(`📄 Reviews already loaded for tour ${tourId}`);
      return { success: true };
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      console.log(`📄 useReviews: Loading reviews for tour ${tourId}...`);
      
      const reviews = await reviewsService.fetchTourReviews(tourId);
      
      dispatch(setTourReviews({ tourId, reviews }));
      dispatch(setLoading(false));
      
      console.log(`✅ useReviews: Successfully loaded ${reviews.length} reviews for tour ${tourId}`);
      return { success: true };
      
    } catch (error) {
      console.error(`🚨 useReviews: Failed to load reviews for tour ${tourId}:`, error);
      
      const errorMessage = error instanceof ReviewsError 
        ? error.message 
        : 'Failed to load reviews. Please try again.';
        
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      
      return { success: false, error: errorMessage };
    }
  }, [dispatch, reviewsState.tourReviews]);

  // 👤 Load user's own reviews (User Profile Page)
  const loadUserReviews = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      console.log('📄 useReviews: Loading user reviews...');
      
      const reviews = await reviewsService.fetchUserReviews();
      
      dispatch(setUserReviews(reviews));
      dispatch(setLoading(false));
      
      console.log(`✅ useReviews: Successfully loaded ${reviews.length} user reviews`);
      return { success: true };
      
    } catch (error) {
      console.error('🚨 useReviews: Failed to load user reviews:', error);
      
      const errorMessage = error instanceof ReviewsError 
        ? error.message 
        : 'Failed to load your reviews. Please try again.';
        
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // ✏️ Create a new review (WITH BOOKING COORDINATION)
  const createReview = useCallback(async (reviewData: CreateReviewData) => {
    dispatch(setSubmitting(true));
    dispatch(clearError());

    try {
      console.log('✏️ useReviews: Creating new review...', reviewData);
      
      // 1️⃣ Create the review
      const newReview = await reviewsService.createReview(reviewData);
      
      // 2️⃣ Update local review state
      dispatch(addUserReview(newReview));
      
      // 3️⃣ 📄 Cross-domain coordination: Update booking status to 'reviewed'
      const booking = findBookingByTourId(reviewData.tour);
      if (booking && booking.status === 'pending-review') {
        console.log(`📄 useReviews: Updating booking ${booking.id} status to 'reviewed'`);
        dispatch(updateUserBookingStatus({ 
          bookingId: booking.id, 
          status: 'reviewed' 
        }));
        
        // 📄 Also update backend booking status
        try {
          const { bookingsService } = await import('../services/bookingsService');
          await bookingsService.updateBookingStatus(booking.id, 'reviewed');
          console.log('✅ useReviews: Successfully updated booking status in backend');
        } catch (bookingError) {
          console.warn('⚠️ useReviews: Failed to update booking status in backend:', bookingError);
        }
      }
      
      // 4️⃣ If tour reviews are loaded, refresh them to show the new review
      if (reviewsState.tourReviews[reviewData.tour]) {
        console.log('🔄 Refreshing tour reviews to include new review');
        dispatch(clearTourReviews(reviewData.tour));
        await loadTourReviews(reviewData.tour);
      }
      
      dispatch(setSubmitting(false));
      
      console.log('✅ useReviews: Successfully created review and updated booking status');
      return { success: true, review: newReview };
      
    } catch (error) {
      console.error('🚨 useReviews: Failed to create review:', error);
      
      const errorMessage = error instanceof ReviewsError 
        ? error.message 
        : 'Failed to create review. Please try again.';
        
      dispatch(setError(errorMessage));
      dispatch(setSubmitting(false));
      
      return { success: false, error: errorMessage };
    }
  }, [dispatch, reviewsState.tourReviews, loadTourReviews, findBookingByTourId]);

  // 📝 Update an existing review - ENHANCED VERSION
  const updateReview = useCallback(async (reviewId: string, updateData: UpdateReviewData) => {
    dispatch(setSubmitting(true));
    dispatch(clearError());

    try {
      console.log(`📝 useReviews: Updating review ${reviewId}...`, updateData);
      
      const updatedReview = await reviewsService.updateReview(reviewId, updateData);
      
      // Update in user reviews
      dispatch(updateUserReview(updatedReview));
      
      // Update current review if it's the same one
      if (reviewsState.currentReview?.id === reviewId) {
        dispatch(setCurrentReview(updatedReview));
      }
      
      // Refresh tour reviews if they're loaded
      if (reviewsState.tourReviews[updatedReview.tour]) {
        console.log('🔄 Refreshing tour reviews after update');
        dispatch(clearTourReviews(updatedReview.tour));
        await loadTourReviews(updatedReview.tour);
      }
      
      dispatch(setSubmitting(false));
      
      console.log('✅ useReviews: Successfully updated review');
      return { success: true, review: updatedReview };
      
    } catch (error) {
      console.error(`🚨 useReviews: Failed to update review ${reviewId}:`, error);
      
      const errorMessage = error instanceof ReviewsError 
        ? error.message 
        : 'Failed to update review. Please try again.';
        
      dispatch(setError(errorMessage));
      dispatch(setSubmitting(false));
      
      return { success: false, error: errorMessage };
    }
  }, [dispatch, reviewsState.currentReview, reviewsState.tourReviews, loadTourReviews]);

  // 🔧 Enhanced update review with UI coordination
  const updateReviewAndRefresh = useCallback(async (reviewId: string, updateData: UpdateReviewData) => {
    const result = await updateReview(reviewId, updateData);
    
    if (result.success) {
      // Force refresh user reviews to ensure UI is up to date
      try {
        await loadUserReviews();
        console.log('✅ User reviews refreshed after update');
      } catch (refreshError) {
        console.warn('⚠️ Failed to refresh user reviews after update:', refreshError);
      }
    }
    
    return result;
  }, [updateReview, loadUserReviews]);

  // 🔧 Handle edit review submit (for component)
  const handleEditReviewSubmit = useCallback(async (data: ReviewSubmitData) => {
    if (!data.reviewId) {
      return { success: false, error: 'Review ID is required' };
    }

    try {
      // Clear any existing errors
      dispatch(clearError());
      
      const result = await updateReviewAndRefresh(data.reviewId, {
        rating: data.rating,
        review: data.review,
        updatedAt: new Date().toISOString()
      });

      if (result.success) {
        // Clear current review selection
        dispatch(clearCurrentReview());
        console.log('✅ Edit review completed successfully');
      }

      return result;
    } catch (error) {
      console.error('🚨 Error in handleEditReviewSubmit:', error);
      return { success: false, error: 'Failed to update review. Please try again.' };
    }
  }, [dispatch, updateReviewAndRefresh]);

  // 🗑️ Delete a review (WITH BOOKING COORDINATION)
  const deleteReview = useCallback(async (reviewId: string) => {
    dispatch(setSubmitting(true));
    dispatch(clearError());

    try {
      console.log(`🗑️ useReviews: Deleting review ${reviewId}...`);
      
      // 1️⃣ Find the review to get tour ID before deletion
      const reviewToDelete = reviewsState.userReviews.find(r => r.id === reviewId);
      
      if (!reviewToDelete) {
        throw new ReviewsError('Review not found in local state');
      }
      
      // 2️⃣ Delete the review
      await reviewsService.deleteReview(reviewId);
      
      // 3️⃣ Remove from user reviews
      dispatch(removeUserReview(reviewId));
      
      // 4️⃣ 📄 Cross-domain coordination: Update booking status back to 'pending-review'
      const booking = findBookingByTourId(reviewToDelete.tour);
      if (booking && booking.status === 'reviewed') {
        console.log(`📄 useReviews: Updating booking ${booking.id} status back to 'pending-review'`);
        dispatch(updateUserBookingStatus({ 
          bookingId: booking.id, 
          status: 'pending-review' 
        }));
        
        // 📄 Also update backend booking status
        try {
          const { bookingsService } = await import('../services/bookingsService');
          await bookingsService.updateBookingStatus(booking.id, 'pending-review');
          console.log('✅ useReviews: Successfully updated booking status in backend');
        } catch (bookingError) {
          console.warn('⚠️ useReviews: Failed to update booking status in backend:', bookingError);
        }
      }
      
      // 5️⃣ Clear current review if it's the same one
      if (reviewsState.currentReview?.id === reviewId) {
        dispatch(clearCurrentReview());
      }
      
      // 6️⃣ Refresh tour reviews if they're loaded
      if (reviewsState.tourReviews[reviewToDelete.tour]) {
        console.log('🔄 Refreshing tour reviews after deletion');
        dispatch(clearTourReviews(reviewToDelete.tour));
        await loadTourReviews(reviewToDelete.tour);
      }
      
      dispatch(setSubmitting(false));
      
      console.log('✅ useReviews: Successfully deleted review and updated booking status');
      return { success: true };
      
    } catch (error) {
      console.error(`🚨 useReviews: Failed to delete review ${reviewId}:`, error);
      
      const errorMessage = error instanceof ReviewsError 
        ? error.message 
        : 'Failed to delete review. Please try again.';
        
      dispatch(setError(errorMessage));
      dispatch(setSubmitting(false));
      
      return { success: false, error: errorMessage };
    }
  }, [dispatch, reviewsState.userReviews, reviewsState.currentReview, reviewsState.tourReviews, loadTourReviews, findBookingByTourId]);

  // 🔧 Handle delete review with UI coordination
  const handleDeleteReview = useCallback(async (reviewId: string) => {
    const result = await deleteReview(reviewId);
    
    if (result.success) {
      // Force refresh user reviews to ensure UI is up to date
      try {
        await loadUserReviews();
        console.log('✅ User reviews refreshed after deletion');
      } catch (refreshError) {
        console.warn('⚠️ Failed to refresh user reviews after deletion:', refreshError);
      }
    }
    
    return result;
  }, [deleteReview, loadUserReviews]);

  // 🔄 Refresh operations
  const refreshTourReviews = useCallback(async (tourId: string) => {
    console.log(`🔄 useReviews: Refreshing reviews for tour ${tourId}...`);
    dispatch(clearTourReviews(tourId));
    return await loadTourReviews(tourId);
  }, [dispatch, loadTourReviews]);

  const refreshUserReviews = useCallback(async () => {
    console.log('🔄 useReviews: Refreshing user reviews...');
    dispatch(setUserReviews([]));
    return await loadUserReviews();
  }, [dispatch, loadUserReviews]);

  // 🎯 Data getters with tour info enhancement
  const getTourReviews = useCallback((tourId: string): Review[] => {
    return reviewsState.tourReviews[tourId] || [];
  }, [reviewsState.tourReviews]);
  
  // 🎯 Get user's reviews with tour info for profile display
  const getUserReviewsWithTourInfo = useCallback((): ReviewWithTourInfo[] => {
    return reviewsState.userReviews.map(review => {
      // Find tour info from tours state
      const tourInfo = toursState.allTours.find(tour => tour.id === review.tour);
      
      if (tourInfo) {
        return {
          ...review,
          tour: { 
            id: tourInfo.id,
            name: tourInfo.name,
            slug: tourInfo.slug,
            imageCover: tourInfo.imageCover
          }
        };
      }
      
      // If tour info not found, return review with default tour info
      return {
        ...review,
        tour: {
          id: review.tour,
          name: 'Unknown Tour',
          slug: '',
          imageCover: 'default-tour.jpg'
        }
      };
    });
  }, [reviewsState.userReviews, toursState.allTours]);

  // 🔧 Helper functions
  const hasUserReviewedTour = useCallback((tourId: string): boolean => {
    return reviewsState.userReviews.some(review => review.tour === tourId);
  }, [reviewsState.userReviews]);

  const clearReviewsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const selectReview = useCallback((review: Review) => {
    console.log('🎯 Selecting review:', review.id);
    dispatch(setCurrentReview(review));
  }, [dispatch]);

  const clearSelectedReview = useCallback(() => {
    console.log('🎯 Clearing selected review');
    dispatch(clearCurrentReview());
  }, [dispatch]);

  return {
    // 📊 State
    tourReviews: reviewsState.tourReviews,
    userReviews: reviewsState.userReviews,
    currentReview: reviewsState.currentReview,
    isLoading: reviewsState.isLoading,
    isSubmitting: reviewsState.isSubmitting,
    error: reviewsState.error,
    
    // 📖 Data Loading
    loadTourReviews,          
    loadUserReviews,          
    refreshTourReviews,
    refreshUserReviews,
    
    // ✏️ CRUD Operations (📄 WITH BOOKING COORDINATION)
    createReview,             
    updateReview,
    updateReviewAndRefresh,   // Enhanced version with UI refresh
    deleteReview,             
    
    // 🔧 Component Helpers (NEW)
    handleEditReviewSubmit,   // Handle complete edit flow
    handleDeleteReview,       // Handle complete delete flow
    
    // 🎯 Data Getters
    getTourReviews,           
    getUserReviewsWithTourInfo, 

    // 🔧 Helper Functions
    hasUserReviewedTour,      
    selectReview,
    clearSelectedReview,
    clearError: clearReviewsError,
  };
};