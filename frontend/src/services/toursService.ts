/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import { isMockEnabled } from './utils/config';
import { handleApiError, ApiError } from './utils/errorHandler';
import type { FetchToursResponse } from '../types/tours-api';
import type { Tour } from '../types/tour.types';
import type { ToursFilters } from '../types/tours-store';
import { filterTours } from './utils/toursFilters';
import { generateMockTours } from '../dev-data/mockTours';

import { transformSingle, transformMultiple } from './utils/apiTransformers';
import type { SingleDocResponse, MultiDocsResponse } from './utils/apiTransformers'

// 🔄 Data transformer for API response
const transformToursResponse = (apiResponse: MultiDocsResponse<Tour>) => {
  return transformMultiple(apiResponse);
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
      const response = await api.get<SingleDocResponse<Tour>>(`/tours/${id}`);
      
      console.log('✅ ToursService: Successfully fetched tour detail');
      return transformSingle(response.data);
      
    } catch (error) {
      console.error(`🚨 ToursService: Failed to fetch tour ${id}`);
      throw transformToursError(error);
    }
  },

  /**
   * Fetch single tour by slug (for detail page with slug→id mapping)
   */
  async fetchTourBySlug(slug: string): Promise<Tour> {
    try {
      console.log(`🚀 ToursService: Fetching tour by slug: ${slug}...`);
      
      if (isMockEnabled()) {
        console.log('🎭 ToursService: Using mock data for tour detail');
        const allTours = await mockToursCall();
        const tour = allTours.find(t => t.slug === slug);
        
        if (!tour) {
          throw new ToursError('Tour not found', 404);
        }
        
        return tour;
      }
      
      // Real API call using slug endpoint
      const response = await api.get<SingleDocResponse<Tour>>(`/tours/slug/${slug}`);
      
      console.log('✅ ToursService: Successfully fetched tour detail by slug');
      return transformSingle(response.data);

    } catch (error) {
      console.error(`🚨 ToursService: Failed to fetch tour by slug ${slug}`);
      throw transformToursError(error);
    }
  },

  /**
   * Filter tours locally (for client-side filtering)
   */
  filterTours(tours: Tour[], filters: ToursFilters): Tour[] {
    console.log('🔍 ToursService: Applying filters', filters);
    const filtered = filterTours(tours, filters); // 💯 Pure function calculation
    console.log(`✅ ToursService: Filtered ${tours.length} → ${filtered.length} tours`);
    return filtered;
  },

  /**
   * Get available filter options from tours data
   */
  getFilterOptions(tours: Tour[]) {
    console.log('📊 ToursService: Calculating filter options');
    
    const difficulties = [...new Set(tours.map(tour => tour.difficulty))];
    const priceRange = {
      min: Math.min(...tours.map(tour => tour.price)),
      max: Math.max(...tours.map(tour => tour.price))
    };
    const ratingsRange = {
      min: Math.min(...tours.map(tour => tour.ratingsAverage || 0)),
      max: Math.max(...tours.map(tour => tour.ratingsAverage || 5))
    };

    return {
      difficulties,
      priceRange,
      ratingsRange
    };
  }

};