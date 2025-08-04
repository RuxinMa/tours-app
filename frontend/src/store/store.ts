import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // tours: tourReducer,
    // bookings: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', // Disable DevTools in production
});

// Export type definitions
export type RootState = ReturnType<typeof store.getState>; // Root state type
export type AppDispatch = typeof store.dispatch; // Dispatch type for useDispatch hook