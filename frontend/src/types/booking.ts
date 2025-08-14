export type BookingStatus = 'planned' | 'pending-review' | 'reviewed';

export interface Booking {
  id: string;
  tour: {
    id: string;
    name: string;
    imageCover: string;
    duration: number;
    startLocation: {
      description: string;
    };
    slug: string; // Slug for SEO-friendly URLs
  };
  startDate: string;
  price: number;
  status: BookingStatus;
  createdAt: string;
  // Optional review for reviewed bookings
  review?: {
    id: string;
    rating: number;
    review: string;
  };
}