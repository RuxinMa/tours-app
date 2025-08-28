/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import { isMockEnabled } from './utils/config';
import { handleApiError, ApiError } from './utils/errorHandler';
import { type SingleDocResponse, transformSingleDoc } from './utils/apiTransformers';
import { getTourImageUrl } from './utils/imageUtils';
import type { 
  Booking,
  BookingDisplayData,
  UpdateBookingStatusRequest,
  CheckoutSessionResponse,
} from '../types/booking';

// 🎭 Mock data
const generateMockBookings = (userId?: string): BookingDisplayData[] => {
  const mockBookings: BookingDisplayData[] = [
    {
      id: '1',
      tourId: 'tour1',
      tourName: 'The Forest Hiker',
      tourSlug: 'the-forest-hiker',
      imageCover: 'tour-1-cover.jpg',
      startLocation: 'Miami, USA',
      startDate: '2024-04-15T09:00:00Z',
      duration: 5,
      price: 397,
      status: 'planned',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2', 
      tourId: 'tour2',
      tourName: 'The Sea Explorer',
      tourSlug: 'the-sea-explorer',
      imageCover: 'tour-2-cover.jpg',
      startLocation: 'California, USA',
      startDate: '2024-05-20T08:00:00Z',
      duration: 7,
      price: 497,
      status: 'pending-review',
      createdAt: '2024-01-10T14:30:00Z'
    },
    {
      id: '3',
      tourId: 'tour3', 
      tourName: 'The Snow Adventurer',
      tourSlug: 'the-snow-adventurer',
      imageCover: 'tour-3-cover.jpg',
      startLocation: 'Aspen, USA',
      startDate: '2024-03-10T10:00:00Z',
      duration: 4,
      price: 897,
      status: 'reviewed',
      createdAt: '2024-01-08T09:15:00Z'
    }
  ];

  return userId ? mockBookings : mockBookings;
};

// 🚨 Bookings-specific error class
export class BookingsError extends ApiError {
  constructor(message: string, statusCode?: number, originalError?: unknown) {
    super(message, statusCode);
    this.name = 'BookingsError';
    this.originalError = originalError;
  }
  
  originalError?: unknown;
}

// Transform booking with populated tour data for display
const transformToDisplayFormat = (booking: any): BookingDisplayData => {
  const tourData = booking.tour;
  
  // Handle startLocation - it might be a string or an object
  let startLocationText = 'Location TBD';
  if (tourData.startLocation) {
    if (typeof tourData.startLocation === 'string') {
      startLocationText = tourData.startLocation;
    } else if (tourData.startLocation.description) {
      startLocationText = tourData.startLocation.description;
    }
  }
  
  // Get the first start date from startDates array
  let startDate = '';
  if (tourData.startDates && tourData.startDates.length > 0) {
    startDate = tourData.startDates[0];
  }
  
  return {
    id: booking._id || booking.id,
    tourId: tourData._id || tourData.id,
    tourName: tourData.name,
    tourSlug: tourData.slug,
    imageCover: getTourImageUrl(tourData.imageCover),
    startLocation: startLocationText,
    startDate: startDate,
    duration: tourData.duration,
    price: booking.price || tourData.price, // Use booking price first, fallback to tour price
    status: booking.status || 'planned',
    createdAt: booking.createdAt
  };
};


// 🔧 Error transformer
const transformBookingsError = (error: unknown): BookingsError => {
  console.error('🚨 BookingsService: Error occurred:', error);
  
  const baseError = handleApiError(error as any);
  
  if (baseError.statusCode === 409) {
    return new BookingsError('You have already booked this tour', 409, error);
  }
  
  if (baseError.statusCode === 402) {
    return new BookingsError('Payment required to complete booking', 402, error);
  }
  
  return new BookingsError(baseError.message, baseError.statusCode, error);
};

// 🗃️ Bookings Service
export const bookingsService = {
  /**
   * Get checkout session for Stripe payment
   * Used in Tour Detail Page
   */
  async getCheckoutSession(tourId: string): Promise<{ sessionId: string; url: string }> {
    try {
      console.log(`🚀 BookingsService: Creating checkout session for tour ${tourId}...`);
      
      if (isMockEnabled()) {
        console.log('🎭 BookingsService: Mock checkout session');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          sessionId: 'mock_session_id',
          url: 'https://checkout.stripe.com/mock'
        };
      }
      
      const response = await api.get<CheckoutSessionResponse>(`/bookings/checkout-session/${tourId}`);
      const session = response.data.session;
      
      if (!session) {
        throw new BookingsError('Failed to create checkout session');
      }
      
      console.log('✅ BookingsService: Successfully created checkout session');
      return {
        sessionId: session.id,
        url: session.url
      };
      
    } catch (error) {
      console.error(`🚨 BookingsService: Failed to create checkout session for tour ${tourId}`);
      throw transformBookingsError(error);
    }
  },

  /**
   * Fetch current user's bookings
   * Used in Profile Page
   */
  async fetchUserBookings(): Promise<BookingDisplayData[]> {
    try {
      console.log('🚀 BookingsService: Fetching user bookings...');
      
      if (isMockEnabled()) {
        console.log('🎭 BookingsService: Using mock bookings data');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return generateMockBookings();
      }
      
      // Note: This endpoint should return bookings populated with tour data
      const response = await api.get('/bookings/user/me');
      const bookings = response.data?.data?.bookings || [];

      const transformedBookings = bookings.map((booking: any) => 
      transformToDisplayFormat(booking)
    );
      console.log(`✅ BookingsService: Successfully fetched ${transformedBookings.length} bookings`);
      return transformedBookings;
    } catch (error) {
      console.error('🚨 BookingsService: Failed to fetch user bookings');
      throw transformBookingsError(error);
    }
  },

  /**
   * Update booking status
   * Used in Profile Page
   */
  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    try {
      console.log(`🚀 BookingsService: Updating booking ${bookingId} status to ${status}...`);
      
      if (isMockEnabled()) {
        console.log('🎭 BookingsService: Mock updating booking status');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return {
          id: bookingId,
          tour: 'mock-tour-id',
          user: 'mock-user-id', 
          price: 497,
          createdAt: new Date().toISOString(),
          paid: true,
          status: status
        };
      }
      
      const updateData: UpdateBookingStatusRequest = { status };
      const response = await api.patch<SingleDocResponse<Booking>>(`/bookings/${bookingId}/status`, updateData);
      const booking = (response.data);
      
      console.log('✅ BookingsService: Successfully updated booking status');
      return transformSingleDoc(booking);

    } catch (error) {
      console.error(`🚨 BookingsService: Failed to update booking ${bookingId} status`);
      throw transformBookingsError(error);
    }
  },

  /**
   * Delete/Cancel booking
   */
  async cancelBooking(bookingId: string): Promise<void> {
    try {
      console.log(`🚀 BookingsService: Cancelling booking ${bookingId}...`);
      
      if (isMockEnabled()) {
        console.log('🎭 BookingsService: Mock cancelling booking');
        await new Promise(resolve => setTimeout(resolve, 800));
        return;
      }
      
      await api.delete(`/bookings/${bookingId}`);
      
      console.log('✅ BookingsService: Successfully cancelled booking');
      
    } catch (error) {
      console.error(`🚨 BookingsService: Failed to cancel booking ${bookingId}`);
      throw transformBookingsError(error);
    }
  }
};