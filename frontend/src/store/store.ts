// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import toursReducer from './slices/toursSlice';
import reviewsReducer from './slices/reviewsSlice';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => void;
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tours: toursReducer,
    reviews: reviewsReducer,
    // booking: bookingReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

if (
  typeof window !== 'undefined' &&
  (window as Window & typeof globalThis).__REDUX_DEVTOOLS_EXTENSION__
) {
  console.log('✅ Redux DevTools Connected');
} else {
  console.warn('⚠️ Redux DevTools not connected');
}