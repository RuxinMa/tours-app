import type { Tour, Difficulty }from './tour.types';

// 🎯 Tours Filters
export interface ToursFilters {
  difficulty?: Difficulty;
  price?: { min?: number; max?: number };
  ratingsAverage?: { min?: number };
  sort?: string; // '-price' | 'price' | '-ratingsAverage' | 'ratingsAverage' | '-createdAt'
}

// 🎯 Redux State
export interface ToursState {
  // 📊 Data Layer
  allTours: Tour[];              // All tours from API
  filteredTours: Tour[];         // Client-side filtered tours
  filters: ToursFilters;         // Current filter criteria
  selectedTour: Tour | null;     // Currently selected tour details

  // 🎨 UI Layer
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}