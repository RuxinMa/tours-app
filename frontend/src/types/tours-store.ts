import type { Tour, Difficulty } from './tour.types';
import type { ToursQueryParams } from './tours-api';

/* Redux State Types */
export interface LoadingState {
  initial: boolean;     // Initial loading state
  search: boolean;      // Search loading state
  pagination: boolean;  // Pagination loading state
}

export interface ToursState {
  data: {
    tours: Tour[];
    pagination: {
      currentPage: number;
      totalPages: number;
      limit: number;
      totalDocs: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters: {
      difficulty?: Difficulty;
      price?: { gte?: number; lte?: number };
      duration?: { gte?: number; lte?: number };
      ratingsAverage?: { gte?: number };
      sort?: string;
    };
  }; // Data related to tours, pagination, and filters
  
  ui: {
    isLoading: LoadingState;
    error: string | null;
    isInitialized: boolean;
    syncSource: 'url' | 'redux' | null;
  }; // UI state including loading, error, and initialization status
}

/* Thunk Argument Types 
  ⛄️ Used for async actions to fetch tours with specific parameters
*/
export type LoadingType = keyof LoadingState;

export interface FetchToursThunkArg {
  params: ToursQueryParams;
  loadingType: LoadingType;
}