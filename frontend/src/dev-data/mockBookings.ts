import type { Booking } from '../types/booking';

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    tour: {
      id: 'tour-1',
      name: 'The Forest Hiker',
      imageCover: '/img/tours/tour-1-cover.jpg',
      duration: 5,
      startLocation: {
        description: 'Miami, USA'
      },
      slug: 'the-forest-hiker',
    },
    startDate: '2024-12-15',
    price: 397,
    status: 'planned',
    createdAt: '2024-01-10',
  },
  {
    id: 'booking-2', 
    tour: {
      id: 'tour-2',
      name: 'The Northern Lights',
      imageCover: '/img/tours/tour-3-cover.jpg',
      duration: 7,
      startLocation: {
        description: 'Tromsø, Norway'
      },
      slug: 'the-northern-lights'
    },
    startDate: '2024-01-20',
    price: 1497,
    status: 'pending-review',
    createdAt: '2023-12-01',
  },
  {
    id: 'booking-3',
    tour: {
      id: 'tour-3', 
      name: 'The City Wanderer',
      imageCover: '/img/tours/tour-4-cover.jpg',
      duration: 9,
      startLocation: {
        description: 'New York, USA'
      },
      slug: 'the-city-wanderer'
    },
    startDate: '2023-11-10',
    price: 2197,
    status: 'reviewed',
    createdAt: '2023-10-01',
    review: {
      id: 'review-1',
      rating: 5,
      review: 'Amazing experience! Highly recommend.'
    }
  }
];