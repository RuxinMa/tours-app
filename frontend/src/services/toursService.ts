import api from './api';
import { isMockEnabled } from './utils/config';
import { handleApiError, ApiError } from './utils/errorHandler';
import { generateMockTours } from '../dev-data/mockTours';
import type { FetchToursResponse } from '../types/tours-api';
import type { Tour } from '../types/tour.types';

// 🔄 Data transformer for API response
const transformToursResponse = (apiResponse: FetchToursResponse) => {
  return apiResponse.data.docs; // Simply return the tours array
};

// 🎭 Mock API call for development
const mockToursCall = async (): Promise<Tour[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('🎭 Mock: Fetching all tours');
  return generateMockTours(); // Generate mock tours data
};

// 🚨 Simple tours-specific error handling
export class ToursError extends ApiError {
  constructor(message: string, statusCode?: number, originalError?: unknown) {
    super(message, statusCode);
    this.name = 'ToursError';
    this.originalError = originalError;
  }
  
  originalError?: unknown;
}

// 🔧 Transform API errors to user-friendly messages
const transformToursError = (error: unknown): ToursError => {
  console.error('🚨 ToursService: Error occurred:', error);
  
  const baseError = handleApiError(error as any);
  
  if (baseError.statusCode === 404) {
    return new ToursError(
      'No tours available at the moment',
      404,
      error
    );
  }
  
  return new ToursError(
    baseError.message,
    baseError.statusCode,
    error
  );
};

// 🏗️ Tours Service - Phase 1: Just fetch all tours
export const toursService = {
  /**
   * Fetch all tours (no filters, no pagination)
   */
  async fetchAllTours(): Promise<Tour[]> {
    try {
      console.log('🚀 ToursService: Fetching all tours...');
      
      // Use mock data if configured
      if (isMockEnabled()) {
        console.log('🎭 ToursService: Using mock data');
        return await mockToursCall();
      }
      
      // Real API call - get all tours
      const response = await api.get<FetchToursResponse>('/tours');
      
      // Transform and return tours
      const tours = transformToursResponse(response.data);
      
      console.log(`✅ ToursService: Successfully fetched ${tours.length} tours`);
      return tours;
      
    } catch (error) {
      console.error('🚨 ToursService: Failed to fetch tours');
      throw transformToursError(error);
    }
  },

  /**
   * Fetch single tour by ID (for detail page)
   */
  async fetchTourById(id: string): Promise<Tour> {
    try {
      console.log(`🚀 ToursService: Fetching tour ${id}...`);
      
      // Mock implementation for development
      if (isMockEnabled()) {
        console.log('🎭 ToursService: Using mock data for tour detail');
        const allTours = await mockToursCall();
        const tour = allTours.find(t => t.id === id);
        
        if (!tour) {
          throw new ToursError('Tour not found', 404);
        }
        
        return tour;
      }
      
      // Real API call
      const response = await api.get<{ status: string; data: { doc: Tour } }>(`/tours/${id}`);
      
      console.log('✅ ToursService: Successfully fetched tour detail');
      return response.data.data.doc;
      
    } catch (error) {
      console.error(`🚨 ToursService: Failed to fetch tour ${id}`);
      throw transformToursError(error);
    }
  },
  
  // 🔮 Phase 2: Future filtering methods will be added here
  // async fetchToursWithFilters(filters: ToursFilters): Promise<Tour[]> { ... }
};