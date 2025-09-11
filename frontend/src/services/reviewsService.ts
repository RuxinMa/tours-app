/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import { isMockEnabled } from './utils/config';
import { handleApiError, ApiError } from './utils/errorHandler';
import { 
  transformMultiple, 
  transformCreate, 
  MultiDocsResponse,
  CreateResponse
} from './utils/apiTransformers';
import type { 
  Review, 
  CreateReviewData, 
  UpdateReviewData,
} from '../types/review';

// Mock data generator
const generateMockReviews = (tourId?: string): Review[] => {
  const mockReviews: Review[] = [
    {
      id: '1',
      review: 'Amazing tour! The guides were very knowledgeable and the scenery was breathtaking. Highly recommend!',
      rating: 5,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      tour: tourId || '1',
      user: {
        id: 'user1',
        name: 'John Doe',
        photo: 'john-doe.jpg'
      }
    },
    {
      id: '2',
      review: 'Great experience overall. The tour was well organized and the locations were stunning.',
      rating: 4, 
      createdAt: '2024-01-10T14:30:00Z',
      tour: tourId || '2',
      user: {
        id: 'user2',
        name: 'Sarah Smith',
        photo: 'sarah-smith.jpg'
      }
    },
    {
      id: '3',
      review: 'Good value for money. The tour covered all major attractions and the guide was friendly.',
      rating: 4,
      createdAt: '2024-01-08T09:15:00Z',
      tour: tourId || '3',
      user: {
        id: 'user3',
        name: 'Mike Johnson',
        photo: 'mike-johnson.jpg'
      }
    }
  ];

  return tourId ? mockReviews.filter(review => review.tour === tourId) : mockReviews;
};

// Reviews-specific error class
export class ReviewsError extends ApiError {
  constructor(message: string, statusCode?: number, originalError?: unknown) {
    super(message, statusCode);
    this.name = 'ReviewsError';
    this.originalError = originalError;
  }
  
  originalError?: unknown;
}

// Error transformer
const transformReviewsError = (error: unknown): ReviewsError => {
  console.error('ReviewsService: Error occurred:', error);
  
  const baseError = handleApiError(error as any);
  
  const errorObj = error && typeof error === 'object' ? error as any : {};
  const messages = [
    errorObj.response?.data?.message,
    errorObj.message,
    baseError.message
  ].filter(Boolean).join(' ');
  
  if (messages.includes('E11000') || messages.includes('duplicate key') || baseError.statusCode === 409) {
    return new ReviewsError('You have already reviewed this tour. You can edit your existing review instead.', 409, error);
  }
  
  return new ReviewsError(baseError.message, baseError.statusCode, error);
};

// Data transformation utility
const transformApiResponseToReview = (apiData: any): Review => ({
  id: apiData._id || apiData.id,
  review: apiData.review,
  rating: apiData.rating,
  createdAt: apiData.createdAt,
  updatedAt: apiData.updatedAt,
  tour: typeof apiData.tour === 'object' ? (apiData.tour._id || apiData.tour.id) : apiData.tour,
  user: {
    id: typeof apiData.user === 'object' ? (apiData.user._id || apiData.user.id) : apiData.user,
    name: typeof apiData.user === 'object' ? apiData.user.name : 'Unknown User',
    photo: typeof apiData.user === 'object' ? apiData.user.photo : 'default-user.jpg'
  }
});

// Reviews Service
export const reviewsService = {
  /**
   * Fetch all reviews for a specific tour (GET operation)
   */
  async fetchTourReviews(tourId: string): Promise<Review[]> {
    try {
      console.log(`ReviewsService: Fetching reviews for tour ${tourId}...`);
      
      if (isMockEnabled()) {
        console.log('ReviewsService: Using mock reviews data');
        await new Promise(resolve => setTimeout(resolve, 800));
        return generateMockReviews(tourId);
      }
      
      // GET 操作使用 MultiDocsResponse
      const response = await api.get<MultiDocsResponse<any>>(`/tours/${tourId}/reviews`);
      const reviewsData = transformMultiple(response.data);
      const reviews = reviewsData.map(transformApiResponseToReview);
      
      console.log(`ReviewsService: Successfully fetched ${reviews.length} reviews for tour ${tourId}`);
      return reviews;
      
    } catch (error) {
      console.error(`ReviewsService: Failed to fetch reviews for tour ${tourId}`);
      throw transformReviewsError(error);
    }
  },

  /**
   * Fetch current user's reviews (GET operation)  
   */
  async fetchUserReviews(): Promise<Review[]> {
    try {
      console.log('ReviewsService: Fetching user reviews...');
      
      if (isMockEnabled()) {
        console.log('ReviewsService: Using mock user reviews data');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [
          ...generateMockReviews('tour1').slice(0, 1),
          ...generateMockReviews('tour2').slice(0, 1)
        ];
      }
      const response = await api.get('/reviews/user/me');
      
      const reviews = response.data?.data?.reviews || response.data?.reviews || [];
      const transformedReviews = reviews.map(transformApiResponseToReview);

      console.log(`ReviewsService: Successfully fetched ${transformedReviews.length} user reviews`);
      return transformedReviews;

    } catch (error) {
      console.error('ReviewsService: Failed to fetch user reviews');
      throw transformReviewsError(error);
    }
  },

  /**
   * Create a new review (POST operation - CreateResponse)
   */
  async createReview(reviewData: CreateReviewData): Promise<Review> {
    try {
      console.log('ReviewsService: Creating new review...', reviewData);
      
      if (isMockEnabled()) {
        console.log('ReviewsService: Mock creating review');
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const newReview: Review = {
          id: Math.random().toString(36).substr(2, 9),
          review: reviewData.review,
          rating: reviewData.rating,
          tour: reviewData.tour,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            id: 'current-user',
            name: 'Current User',
            photo: 'current-user.jpg'
          }
        };
        
        return newReview;
      }
      
      const response = await api.post<CreateResponse<any>>(`/tours/${reviewData.tour}/reviews`, {
        review: reviewData.review,
        rating: reviewData.rating
      });

      if (response.status === 201 || response.status === 200) {
        const apiData = transformCreate(response.data);
        console.log('Extracted review data:', apiData);

        const transformedReview = transformApiResponseToReview(apiData);
        
        console.log('ReviewsService: Successfully created review');
        return transformedReview;
      }

      throw new ReviewsError('Invalid response structure or non-success status');
    } catch (error) {
      console.error('ReviewsService: Failed to create review');
      throw transformReviewsError(error);
    }
  },

  /**
   * Update an existing review (PATCH operation)
   */
  async updateReview(reviewId: string, updateData: UpdateReviewData): Promise<Review> {
    try {
      console.log(`ReviewsService: Updating review ${reviewId}...`, updateData);
      
      if (isMockEnabled()) {
        console.log('ReviewsService: Mock updating review');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockReviews = generateMockReviews();
        const existingReview = mockReviews.find(r => r.id === reviewId);
        
        if (!existingReview) {
          throw new ReviewsError('Review not found', 404);
        }
        
        return {
          ...existingReview,
          ...updateData,
          updatedAt: new Date().toISOString()
        };
      }
      const response = await api.patch(`/reviews/${reviewId}`, updateData);
      
      if (response.data?.status === 'success') {
        let apiData: any;
        
        if (response.data.data?.data) {
          apiData = response.data.data.data;
        } else if (response.data.data?.doc) {
          apiData = response.data.data.doc;
        } else {
          throw new ReviewsError('Unknown response format');
        }

        const transformedReview = transformApiResponseToReview(apiData);
        
        console.log('ReviewsService: Successfully updated review');
        return transformedReview;
      } else {
        console.error('Non-success status:', response.data?.status);
        throw new ReviewsError('API returned non-success status: ' + response.data?.status);
      }
    } catch (error) {
      console.error(`ReviewsService: Failed to update review ${reviewId}`);
      throw transformReviewsError(error);
    }
  },

  /**
   * Delete a review (DELETE operation)
   */
  async deleteReview(reviewId: string): Promise<void> {
    try {
      console.log(`ReviewsService: Deleting review ${reviewId}...`);
      
      if (isMockEnabled()) {
        console.log('ReviewsService: Mock deleting review');
        await new Promise(resolve => setTimeout(resolve, 800));
        return;
      }
      
      await api.delete(`/reviews/${reviewId}`);
      
      console.log('ReviewsService: Successfully deleted review');
      
    } catch (error) {
      console.error(`ReviewsService: Failed to delete review ${reviewId}`);
      throw transformReviewsError(error);
    }
  }
};