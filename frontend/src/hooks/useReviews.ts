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
import type { CreateReviewData, UpdateReviewData, Review, ReviewWithTourInfo } from '../types/review';

export const useReviews = () => {
  const dispatch = useAppDispatch();
  
  // Select state from Redux
  const reviewsState = useAppSelector((state) => state.reviews);
  const toursState = useAppSelector((state) => state.tours);

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
    // Avoid re-fetching if already loaded
    if (reviewsState.userReviews.length > 0) {
      console.log('📄 User reviews already loaded');
      return { success: true };
    }

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
  }, [dispatch, reviewsState.userReviews.length]);

  // ✍️ Create a new review
  const createReview = useCallback(async (reviewData: CreateReviewData) => {
    dispatch(setSubmitting(true));
    dispatch(clearError());

    try {
      console.log('✍️ useReviews: Creating new review...', reviewData);
      
      const newReview = await reviewsService.createReview(reviewData);
      
      // Add to user reviews
      dispatch(addUserReview(newReview));
      
      // If tour reviews are loaded, refresh them to show the new review
      if (reviewsState.tourReviews[reviewData.tour]) {
        console.log('🔄 Refreshing tour reviews to include new review');
        dispatch(clearTourReviews(reviewData.tour));
        await loadTourReviews(reviewData.tour);
      }
      
      dispatch(setSubmitting(false));
      
      console.log('✅ useReviews: Successfully created review');
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
  }, [dispatch, reviewsState.tourReviews, loadTourReviews]);

  // 📝 Update an existing review
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

  // 🗑️ Delete a review
  const deleteReview = useCallback(async (reviewId: string) => {
    dispatch(setSubmitting(true));
    dispatch(clearError());

    try {
      console.log(`🗑️ useReviews: Deleting review ${reviewId}...`);
      
      // Find the review to get tour ID before deletion
      const reviewToDelete = reviewsState.userReviews.find(r => r.id === reviewId);
      
      await reviewsService.deleteReview(reviewId);
      
      // Remove from user reviews
      dispatch(removeUserReview(reviewId));
      
      // Clear current review if it's the same one
      if (reviewsState.currentReview?.id === reviewId) {
        dispatch(clearCurrentReview());
      }
      
      // Refresh tour reviews if they're loaded
      if (reviewToDelete && reviewsState.tourReviews[reviewToDelete.tour]) {
        console.log('🔄 Refreshing tour reviews after deletion');
        dispatch(clearTourReviews(reviewToDelete.tour));
        await loadTourReviews(reviewToDelete.tour);
      }
      
      dispatch(setSubmitting(false));
      
      console.log('✅ useReviews: Successfully deleted review');
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
  }, [dispatch, reviewsState.userReviews, reviewsState.currentReview, reviewsState.tourReviews, loadTourReviews]);

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

  const getUserReviewsWithTourInfo = useCallback((): ReviewWithTourInfo[] => {
    return reviewsState.userReviews.map(review => {
      // Find tour info from tours state
      const tourInfo = toursState.allTours.find(tour => tour.id === review.tour);
      
      if (tourInfo) {
        return {
          ...review,
          tourInfo: {
            id: tourInfo.id,
            name: tourInfo.name,
            slug: tourInfo.slug,
            imageCover: tourInfo.imageCover
          }
        };
      }
      
      // If tour info not found, return review with undefined tourInfo
      return {
        ...review,
        tourInfo: {
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
    dispatch(setCurrentReview(review));
  }, [dispatch]);

  const clearSelectedReview = useCallback(() => {
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
    loadTourReviews,          // Tour Detail Page
    loadUserReviews,          // User Profile Page
    refreshTourReviews,
    refreshUserReviews,
    
    // ✍️ CRUD Operations  
    createReview,
    updateReview,
    deleteReview,
    
    // 🎯 Data Getters
    getTourReviews,           // 获取 tour 的 reviews
    getUserReviewsWithTourInfo, // 获取用户的 reviews（带 tour 信息）

    // 🔧 Helper Functions
    hasUserReviewedTour,      // 检查用户是否已评论过某个 tour
    selectReview,
    clearSelectedReview,
    clearError: clearReviewsError,
  };
};