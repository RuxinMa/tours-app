import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState } from '../../types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// ONLY STATE MANAGEMENT - NO ASYNC LOGIC HERE
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set user information (after successful login/registration/check)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.isInitialized = true;
    },

    // Clear user information (after logout or auth failure)
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isInitialized = true;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error message
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false; // Stop loading when error occurs
    },

    // Clear error message
    clearError: (state) => {
      state.error = null;
    },

    // Update user profile information
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    // Set initialization status (used during app startup)
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
  
  // ✅ No more extraReducers - all async logic moved to service layer
});

// Export actions for use in hooks
export const {
  setUser,
  clearUser,
  setLoading,
  setError,
  clearError,
  updateUser,
  setInitialized,
} = authSlice.actions;

export default authSlice.reducer;