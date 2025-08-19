export interface Booking {
  id: string;
  tour: string; // Tour ID reference
  user: string; // User ID reference
  price: number; // Booking price
  createdAt: string; // Booking creation date
  paid: boolean;
  status: 'planned' | 'pending-review' | 'reviewed' | 'cancelled';
}

// For API responses that include populated tour data
export interface BookingWithTourDetails {
  id: string; // Booking ID
  tour: {
    id: string; // Tour ID
    name: string; // Tour name
    imageCover: string; // Tour cover image
    startLocation: {
      description: string;
      coordinates: [number, number];
    };
    startDates: string[];
    duration: number;
    price: number;
  };
  user: string; // User ID reference
  price: number; // Booking price
  createdAt: string; // Booking creation date
  paid: boolean; // Payment status
  status: 'planned' | 'pending-review' | 'reviewed' | 'cancelled'; // Booking status
}

// For profile page display
export interface BookingDisplayData {
  id: string;
  tourId: string;
  tourName: string;
  tourSlug: string; 
  imageCover: string;
  startLocation: string;
  startDate: string;
  duration: number;
  price: number;
  status: 'planned' | 'pending-review' | 'reviewed' | 'cancelled';
  createdAt: string;
}

// API request types
export interface CreateBookingRequest {
  tour: string;
  user: string;
  price: number;
}

export interface UpdateBookingStatusRequest {
  status: 'planned' | 'pending-review' | 'reviewed' | 'cancelled';
}

// API response types
// Checkout session types (for Stripe integration)
export interface CheckoutSessionResponse {
  status: 'success' | 'error';
  session?: {
    id: string;
    url: string;
  };
  message?: string;
}