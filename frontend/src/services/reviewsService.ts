/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import { isMockEnabled } from './utils/config';
import { handleApiError, ApiError } from './utils/errorHandler';
import { transformMultiple } from './utils/apiTransformers';
import { SingleDocResponse, MultiDocsResponse } from './utils/apiTransformers';
import type { 
  Review, 
  CreateReviewData, 
  UpdateReviewData,
} from '../types/review';

// 🎭 Mock data
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

// 🚨 Reviews-specific error class
export class ReviewsError extends ApiError {
  constructor(message: string, statusCode?: number, originalError?: unknown) {
    super(message, statusCode);
    this.name = 'ReviewsError';
    this.originalError = originalError;
  }
  
  originalError?: unknown;
}

// 🔧 Error transformer
const transformReviewsError = (error: unknown): ReviewsError => {
  console.error('🚨 ReviewsService: Error occurred:', error);
  
  const baseError = handleApiError(error as any);
  
  // Extract all possible error messages
  const errorObj = error && typeof error === 'object' ? error as any : {};
  const messages = [
    errorObj.response?.data?.message,
    errorObj.message,
    baseError.message
  ].filter(Boolean).join(' ');
  
  // Check for duplicate key error in any message
  if (messages.includes('E11000') || messages.includes('duplicate key') || baseError.statusCode === 409) {
    return new ReviewsError('You have already reviewed this tour. You can edit your existing review instead.', 409, error);
  }
  
  return new ReviewsError(baseError.message, baseError.statusCode, error);
};

// 🗝️ Reviews Service - Review CRUD
export const reviewsService = {
  /**
   * Fetch all reviews for a specific tour
   ** Tour Detail Page
   */
  async fetchTourReviews(tourId: string): Promise<Review[]> {
    try {
      console.log(`🚀 ReviewsService: Fetching reviews for tour ${tourId}...`);
      
      if (isMockEnabled()) {
        console.log('🎭 ReviewsService: Using mock reviews data');
        await new Promise(resolve => setTimeout(resolve, 800));
        return generateMockReviews(tourId);
      }
      
      const response = await api.get<MultiDocsResponse<Review>>(`/tours/${tourId}/reviews`);
      const reviews = transformMultiple(response.data);
      
      console.log(`✅ ReviewsService: Successfully fetched ${reviews.length} reviews for tour ${tourId}`);
      return reviews;
      
    } catch (error) {
      console.error(`🚨 ReviewsService: Failed to fetch reviews for tour ${tourId}`);
      throw transformReviewsError(error);
    }
  },

  /**
   * Fetch current user's reviews
   ** User Profile Page  
   */
  async fetchUserReviews(): Promise<Review[]> {
    try {
      console.log('🚀 ReviewsService: Fetching user reviews...');
      
      if (isMockEnabled()) {
        console.log('🎭 ReviewsService: Using mock user reviews data');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [
          ...generateMockReviews('tour1').slice(0, 1),
          ...generateMockReviews('tour2').slice(0, 1)
        ];
      }

      const transformReviewData = (review: any): Review => ({
        id: review._id || review.id,
        rating: review.rating,
        review: review.review,
        user: {
          id: review.user._id || review.user.id,
          name: review.user.name,
          photo: review.user.photo
        },
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        tour: review.tour._id || review.tour.id
      });
      
      const response = await api.get('/reviews/user/me');
      const reviews = response.data?.data?.reviews || [];

      const transformedReviews = reviews.map(transformReviewData);

      console.log(`✅ ReviewsService: Successfully fetched ${transformedReviews.length} user reviews`);
      return transformedReviews;

    } catch (error) {
      console.error('🚨 ReviewsService: Failed to fetch user reviews');
      throw transformReviewsError(error);
    }
  },

  /**
   * Create a new review
   */
  async createReview(reviewData: CreateReviewData): Promise<Review> {
    try {
      console.log('🚀 ReviewsService: Creating new review...', reviewData);
      
      if (isMockEnabled()) {
        console.log('🎭 ReviewsService: Mock creating review');
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
      
      const response = await api.post<SingleDocResponse<Review>>(`/tours/${reviewData.tour}/reviews`, {
        review: reviewData.review,
        rating: reviewData.rating
      });

      if (response.status === 201 || response.status === 200) {
        const apiData = response.data.data.data;
        console.log('📦 Extracted review data:', apiData);

        const transformedReview: Review = {
          id: apiData._id || apiData.id,
          rating: apiData.rating,
          review: apiData.review,
          tour: apiData.tour,
          user: apiData.user,
          createdAt: apiData.createdAt,
          updatedAt: apiData.updatedAt
        };
        
        console.log('✅ ReviewsService: Successfully created review');
        return transformedReview;
      }

      throw new ReviewsError('Invalid response structure or non-success status');
    } catch (error) {
      console.error('🚨 ReviewsService: Failed to create review');
      throw transformReviewsError(error);
    }
  },

  /**
   * Update an existing review
   */
  async updateReview(reviewId: string, updateData: UpdateReviewData): Promise<Review> {
    try {
      console.log(`🚀 ReviewsService: Updating review ${reviewId}...`, updateData);
      
      if (isMockEnabled()) {
        console.log('🎭 ReviewsService: Mock updating review');
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
        if (response.data.data?.data) {
          const apiData = response.data.data.data;
    
          const transformedReview: Review = {
            id: apiData._id || apiData.id,
            rating: apiData.rating,
            review: apiData.review,
            tour: apiData.tour,
            user: apiData.user,
            createdAt: apiData.createdAt,
            updatedAt: apiData.updatedAt
          };
          
          console.log('✅ ReviewsService: Successfully updated review');
          return transformedReview;
        } else {
          console.error('❌ Missing nested data structure');
          throw new ReviewsError('Missing data.data in response');
        }
      } else {
        console.error('❌ Non-success status:', response.data?.status);
        throw new ReviewsError('API returned non-success status: ' + response.data?.status);
      }
    } catch (error) {
      console.error(`🚨 ReviewsService: Failed to update review ${reviewId}`);
      throw transformReviewsError(error);
    }
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string): Promise<void> {
    try {
      console.log(`🚀 ReviewsService: Deleting review ${reviewId}...`);
      
      if (isMockEnabled()) {
        console.log('🎭 ReviewsService: Mock deleting review');
        await new Promise(resolve => setTimeout(resolve, 800));
        return;
      }
      
      await api.delete(`/reviews/${reviewId}`);
      
      console.log('✅ ReviewsService: Successfully deleted review');
      
    } catch (error) {
      console.error(`🚨 ReviewsService: Failed to delete review ${reviewId}`);
      throw transformReviewsError(error);
    }
  }
};