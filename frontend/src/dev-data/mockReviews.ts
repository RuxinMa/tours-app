import type { Review } from '../types/review';

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    tour: {
      id: 'tour-3',
      name: 'The City Wanderer',
      imageCover: '/img/tours/tour-4-cover.jpg',
      slug: 'the-city-wanderer'
    },
    rating: 5,
    review: 'Amazing experience! Highly recommend. The tour guide was knowledgeable and the city views were breathtaking. Perfect for anyone who loves urban exploration.',
    createdAt: '2023-11-15',
    updatedAt: '2023-11-15'
  },
  {
    id: 'review-2',
    tour: {
      id: 'tour-2',
      name: 'The Northern Lights',
      imageCover: '/img/tours/tour-3-cover.jpg',
      slug: 'the-northern-lights'
    },
    rating: 4,
    review: 'Beautiful northern lights! Weather was a bit challenging but totally worth it. The accommodation was comfortable and the guides were very professional.',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  },
  {
    id: 'review-3',
    tour: {
      id: 'tour-1',
      name: 'The Forest Hiker',
      imageCover: '/img/tours/tour-1-cover.jpg',
      slug: 'the-forest-hiker'
    },
    rating: 5,
    review: 'Perfect hiking experience! Great trails and wonderful scenery. The difficulty level was just right and the camping spots were fantastic.',
    createdAt: '2023-08-20',
    updatedAt: '2023-08-20'
  },
  {
    id: 'review-4',
    tour: {
      id: 'tour-2',
      name: 'The Northern Lights',
      imageCover: '/img/tours/tour-3-cover.jpg',
      slug: 'the-northern-lights'
    },
    rating: 3,
    review: 'Good tour overall, but the weather didn\'t cooperate much. Only saw the lights on one night out of seven. Still a memorable experience though.',
    createdAt: '2023-12-10',
    updatedAt: '2023-12-10'
  }
];