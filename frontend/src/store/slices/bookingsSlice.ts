import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Booking, BookingDisplayData } from '../../types/booking';

interface BookingState {
  // Data Layer
  userBookings: BookingDisplayData[]; // User's all bookings for profile page
  currentBooking: Booking | null; // Currently selected booking for details or editing
  
  // UI Layer  
  isLoading: boolean; 
  error: string | null;
  isSubmitting: boolean;
}

const initialState: BookingState = {
  userBookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
  isSubmitting: false,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    // 📄 Loading States
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

    // 👤 User Bookings Management (Profile页面)
    setUserBookings: (state, action: PayloadAction<BookingDisplayData[]>) => {
      state.userBookings = action.payload;
      state.error = null;
    },

    updateUserBookingStatus: (state, action: PayloadAction<{ bookingId: string; status: Booking['status'] }>) => {
      const { bookingId, status } = action.payload;
      const booking = state.userBookings.find(b => b.id === bookingId);
      if (booking) {
        booking.status = status;
      }
      state.error = null;
    },

    removeUserBooking: (state, action: PayloadAction<string>) => {
      state.userBookings = state.userBookings.filter(booking => booking.id !== action.payload);
      state.error = null;
    },

    // 🎯 Current Booking Management
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload;
    },

    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    
    // 🧹 Clear User Bookings
    clearUserBookings: (state) => {
      state.userBookings = [];
      state.error = null;
    },
  },
});

export const {
  // 📄 Loading States
  setLoading,
  setSubmitting,
  // 🚨 Error Management
  setError,
  clearError,
  // 👤 User Bookings Management
  setUserBookings,
  updateUserBookingStatus, 
  removeUserBooking,
  // 🎯 Current Booking Management
  setCurrentBooking,
  clearCurrentBooking,
  clearUserBookings,
} = bookingSlice.actions;

export default bookingSlice.reducer;