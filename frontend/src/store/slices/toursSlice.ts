import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Tour } from '../../types/tour.types';
import type { ToursFilters } from '../../types/tours-store';
import { filterTours } from '../../services/utils/toursFilters';

// 🎯 Tours State 
interface ToursState {
  // 📊 Data
  allTours: Tour[];              // All tours from API
  filteredTours: Tour[];         // Client-side filtered tours
  filters: ToursFilters;         // Current filter criteria
  selectedTour: Tour | null;     // Currently selected tour details
  
  // 🎨 UI State
  isLoading: boolean;            // Single loading state
  error: string | null;          // Error message
  isInitialized: boolean;        // Has data been loaded initially
}

// 🎯 Initial state
const initialState: ToursState = {
  allTours: [],
  filteredTours: [],
  filters: {},
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
      state.allTours = action.payload;
    // 🔑 
    if (Object.keys(state.filters).length === 0) {
      state.filteredTours = action.payload; // No filters applied, show all tours
    } else {
      state.filteredTours = filterTours(action.payload, state.filters);
    }
    state.isInitialized = true;
    state.error = null;
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
      state.allTours = [];
      state.selectedTour = null;
      state.isLoading = false;
      state.error = null;
      state.isInitialized = false;
    },

    // 🧹 Clear selected tour (when leaving detail page)
    clearSelectedTour: (state) => {
      state.selectedTour = null;
    },
    
    // 🔄 Set filters
    setFilters: (state, action: PayloadAction<ToursFilters>) => {
      state.filters = action.payload;
    },
    
    // 🔄 Set filtered tours (after applying filters)
    setFilteredTours: (state, action: PayloadAction<Tour[]>) => {
      state.filteredTours = action.payload;
    },
    
    // 🧹 Clear filters
    clearFilters: (state) => {
      state.filters = {};
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
  setFilters,
  setFilteredTours,
  clearFilters,
} = toursSlice.actions;

export default toursSlice.reducer;