import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ToursState, LoadingState, FetchToursThunkArg } from '../../types/tours-store';
import type { ToursFilters, ToursQueryParams, FetchToursResponse } from '../../types/tours-api';
import type { Tour } from '../../types/tour.types';

// Initial state for the tours slice
const initialState: ToursState = {
  data: {
    tours: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      limit: 12, // Default limit for pagination
      totalDocs: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    filters: {
      difficulty: undefined,
      price: { gte: undefined, lte: undefined },
      duration: { gte: undefined, lte: undefined },
      ratingsAverage: { gte: undefined },
      sort: '-createdAt', // Default sort by creation date
    },
  },
  ui: {
    isLoading: {
      initial: false,
      search: false,
      pagination: false,
    },
    error: null,
    isInitialized: false,
    syncSource: null,
  },
};

// Async Thunk for fetching tours
export const fetchTours = createAsyncThunk <{
    tours: Tour[];
    pagination: {
      currentPage: number;
      totalPages: number;
      limit: number;
      totalDocs: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    loadingType: string;
  }, // 📊 Thunk Only for data fetching, no UI state
  FetchToursThunkArg,
  {
    rejectValue: string;
  }
>(
  'tours/fetchTours',
   async ({ params, loadingType }, { rejectWithValue }) => {
      try {
        console.log('🚀 API Request:', { params, loadingType });
        const response = await mockApiCall(params);

        const transformedTours = response.data.docs;
        console.log('🚀 API Response:', response);

        return {
          tours: transformedTours,
          pagination: {
            currentPage: response.data.page,
            totalPages: response.data.totalPages,
            limit: response.data.limit,
            totalDocs: response.data.totalDocs,
            hasNextPage: response.data.hasNextPage,
            hasPrevPage: response.data.hasPrevPage,
          },
          loadingType, // 传递给 reducer，用于状态管理
        };
      } catch (error: unknown) {
        console.error('🚨 Error fetching tours:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to fetch tours';

        return rejectWithValue(errorMessage);
      }
    }
);

// Mock API call function for demonstration purposes
const mockApiCall = async (params: ToursQueryParams): Promise<FetchToursResponse> => {
  // Simulate an API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    status: "success",
    data: {
        docs: [
          {
            id: '1',
            name: 'The Sea Explorer',
            duration: 5,
            maxGroupSize: 10,
            difficulty: 'easy',
            price: 399,
            summary: 'A great tour to explore the sea with friends.',
            imageCover: 'sea-explorer.jpg',
            startLocation: {
              type: 'Point',
              coordinates: [0, 0],
              description: 'Start Location',
            },
            locations: [],
            startDates: ['2023-01-01'],
            slug: 'the-sea-explorer',
            images: [],
            createdAt: "2025-08-09T13:13:44.000Z",
          },
          {
            id: '2',
            name: 'The Hiking Adventure',
            duration: 10,
            maxGroupSize: 10,
            difficulty: 'medium',
            price: 999,
            summary: 'A great tour to explore the sea with friends.',
            imageCover: 'hiking-adventure.jpg',
            startLocation: {
              type: 'Point',
              coordinates: [0, 0],
              description: 'Start Location',
            },
            locations: [],
            startDates: ['2023-01-01'],
            slug: 'the-hiking-adventure',
            images: [],
            createdAt:"2025-08-09T13:13:44.000Z",
          },
          {
            id: '3',
            name: 'The Forest Retreat',
            duration: 5,
            maxGroupSize: 10,
            difficulty: 'difficult',
            price: 1299,
            summary: 'A great tour to explore the forest with friends.',
            imageCover: 'forest-retreat.jpg',
            startLocation: {
              type: 'Point',
              coordinates: [0, 0],
              description: 'Start Location',
            },
            locations: [],
            startDates: ['2023-01-01'],
            slug: 'the-forest-retreat',
            images: [],
            createdAt: "2025-08-09T13:13:44.000Z",
          },
        ],
        page: 1,
        totalPages: 1,
        limit: 2,
        totalDocs: 3,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
};


// Create the tours slice
const tourSlice = createSlice({
  name: 'tours',
  initialState,
  reducers: {
    // 1️⃣ Update Filters
    updateFilters: (state, action: PayloadAction<ToursFilters>) => {
      // Merge new filters with existing ones
      state.data.filters = { ...state.data.filters, ...action.payload };

      if (!('page' in action.payload)) {
        // If page is updated, reset currentPage to 1
        state.data.pagination.currentPage = 1;
      }
    },

    // 2️⃣ Clear Error 
    clearError: (state) => {
      state.ui.error = null;
    },

    // 3️⃣ Reset Filters
    resetFilters: (state) => {
      state.data.filters = { sort: '-createdAt' }; // Reset to default sort
      state.data.pagination.currentPage = 1; // Reset to first page
    },

    // 4️⃣ Manually Set Loading State
    setLoadingState: (state, action: PayloadAction<LoadingState>) => {
      state.ui.isLoading = { ...state.ui.isLoading, ...action.payload };
    },
  },
  // 🧩 Reducers to handle async actions and update state accordingly
  extraReducers: (builder) => {
    // Handle async actions
    builder
      .addCase(fetchTours.pending, (state, action) => {
        const { loadingType } = action.meta.arg;
        console.log('🔄 Loading started:', loadingType); 

        // 1️⃣ Reset all loading states
        state.ui.isLoading = {
          initial: false,
          search: false,
          pagination: false,
        };
        // 2️⃣ Set specific loading state based on action payload
       state.ui.isLoading[loadingType as keyof LoadingState] = true; // Set specific loading state
       state.ui.error = null; // Clear any previous errors

        // 3️⃣ Clear tours data if loadingType is initial or search
       if (loadingType === 'initial' || loadingType === 'search') {
         state.data.tours = []; // Clear tours data for initial or search loading
       } // Keep existing tours for pagination loading
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        const { tours, pagination, loadingType } = action.payload;
        console.log('✅ Loading completed:', loadingType);

        // 1️⃣ Reset loading states
        state.ui.isLoading = {
          initial: false,
          search: false,
          pagination: false,
        };
        // 2️⃣ Update tours and pagination data
        state.data.tours = tours;
        state.data.pagination = pagination;
        // 3️⃣ Update loading state
        state.ui.isInitialized = true;
        // 4️⃣ Clear error state
        state.ui.error = null;
      })
      .addCase(fetchTours.rejected, (state, action) => {
        console.log('❌ Loading failed');

        // 1️⃣ Reset loading states
        state.ui.isLoading = {
          initial: false,
          search: false,
          pagination: false,
        };
        // 2️⃣ Set error message
        state.ui.error = action.payload || 'Unknown error occurred'; 
      });
  },
});

export const {
  updateFilters,
  clearError,
  resetFilters,
  setLoadingState,
} = tourSlice.actions;

export default tourSlice.reducer;