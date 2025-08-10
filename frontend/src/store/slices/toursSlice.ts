import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Tour } from '../../types/tour.types';

// 🎯 Tours State 
interface ToursState {
  // 📊 Data
  tours: Tour[];                 // All tours from API
  selectedTour: Tour | null;     // Currently viewed tour (for detail page)
  
  // 🎨 UI State
  isLoading: boolean;            // Single loading state
  error: string | null;          // Error message
  isInitialized: boolean;        // Has data been loaded initially
}

// 🎯 Initial state
const initialState: ToursState = {
  tours: [],
  selectedTour: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// 🏗️ Redux slice - pure state management
const toursSlice = createSlice({
  name: 'tours',
  initialState,
  reducers: {
    // 🔄 Set all tours (after successful fetch)
    setTours: (state, action: PayloadAction<Tour[]>) => {
      state.tours = action.payload;
      state.error = null;
      state.isInitialized = true;
    },

    // 🎯 Set selected tour (for detail page)
    setSelectedTour: (state, action: PayloadAction<Tour>) => {
      state.selectedTour = action.payload;
      state.error = null;
    },

    // ⏳ Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null; // Clear error when starting to load
      }
    },

    // 🚨 Set error message
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false; // Stop loading when error occurs
    },

    // ✨ Clear error message
    clearError: (state) => {
      state.error = null;
    },

    // 🧹 Clear all data (for logout or navigation)
    clearTours: (state) => {
      state.tours = [];
      state.selectedTour = null;
      state.isLoading = false;
      state.error = null;
      state.isInitialized = false;
    },

    // 🧹 Clear selected tour (when leaving detail page)
    clearSelectedTour: (state) => {
      state.selectedTour = null;
    },
  },
});

// Export actions
export const {
  setTours,
  setSelectedTour,
  setLoading,
  setError,
  clearError,
  clearTours,
  clearSelectedTour,
} = toursSlice.actions;

export default toursSlice.reducer;