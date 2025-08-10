import type { Tour } from './tour.types';
import type { ToursFilters } from './tours-api';

/* 
  🎯 Redux State
*/
export interface ToursState {
  // 📊 Data Layer
  allTours: Tour[];              // All tours from API
  filteredTours: Tour[];         // Client-side filtered tours
  filters: ToursFilters;         // Current filter criteria
  
  // 🎨 UI Layer
  isLoading: boolean;            // Single loading state
  error: string | null;          // Error message
  isInitialized: boolean;        // Whether data has been loaded initially
}

/* 
  🎯 Service Layer Types
*/
export interface FetchAllToursResult {
  tours: Tour[];
  totalCount: number;
}