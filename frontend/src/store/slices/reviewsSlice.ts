import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Review } from '../../types/review';
import type { clearUser } from './authSlice';

interface ReviewState {
  // Data Layer
  tourReviews: {
    [tourId: string]: Review[]; // Reviews indexed by tour ID
  };
  userReviews: Review[]; // Reviews written by the user
  currentReview: Review | null; // Currently selected review for editing

  // UI Layer
  isLoading: boolean; // Global loading state for reviews
  error: string | null; // Error message if any
  isSubmitting: boolean; // State for form submission
}

const initialState: ReviewState = {
  tourReviews: {},
  userReviews: [],
  currentReview: null,
  isLoading: false,
  error: null,
  isSubmitting: false,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    // 🔄 Loading States
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },

    // 🚨 Error Management
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isSubmitting = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // 📊 Tour Reviews Management (ONLY VIEW)
    setTourReviews: (state, action: PayloadAction<{ tourId: string; reviews: Review[] }>) => {
      const { tourId, reviews } = action.payload;
      state.tourReviews[tourId] = reviews;
      state.error = null;
    },

    clearTourReviews: (state, action: PayloadAction<string>) => {
      delete state.tourReviews[action.payload];
    },

    // 👤 User Reviews Management (CRUD)
    setUserReviews: (state, action: PayloadAction<Review[]>) => {
      state.userReviews = action.payload;
      state.error = null;
    },

    addUserReview: (state, action: PayloadAction<Review>) => {
      state.userReviews.push(action.payload);
      state.error = null;
    },

    updateUserReview: (state, action: PayloadAction<Review>) => {
      const updatedReview = action.payload;
      const index = state.userReviews.findIndex(review => review.id === updatedReview.id);
      if (index !== -1) {
        state.userReviews[index] = updatedReview;
      }
      state.error = null;
    },

    removeUserReview: (state, action: PayloadAction<string>) => {
      state.userReviews = state.userReviews.filter(review => review.id !== action.payload);
      state.error = null;
    },

    // 📝 Current Review Management (for editing)
    setCurrentReview: (state, action: PayloadAction<Review | null>) => {
      state.currentReview = action.payload;
    },

    clearCurrentReview: (state) => {
      state.currentReview = null;
    },

    // 🧹 Clear all reviews (for logout or navigation)
    clearReviews: (state) => {
      state.tourReviews = {};
      state.userReviews = [];
      state.currentReview = null;
      state.error = null;
    },

    // 🧹 Clear User Reviews
    clearUserReviews: (state) => {
      state.userReviews = [];
      state.error = null;
    },
  },
});

export const {
  // 🔄 Loading States
  setLoading,
  setSubmitting,
  // 🚨 Error Management
  setError,
  clearError,
  // 📊 Tour Reviews Management
  setTourReviews,
  clearTourReviews,
  // 👤 User Reviews Management
  setUserReviews,
  addUserReview,
  updateUserReview,
  removeUserReview,
  // 📝 Current Review Management
  setCurrentReview,
  clearCurrentReview,
  clearReviews,
  clearUserReviews,
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
