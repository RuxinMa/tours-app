import type { Tour } from '../../types/tour.types';
import type { ToursFilters } from '../../types/tours-store';

/**
 * 🎯 Frontend Filter
 */
export const filterTours = (tours: Tour[], filters: ToursFilters): Tour[] => {
  let result = [...tours]; // Create a shallow copy of the tours array

  // 1️⃣ Difficulty 
  if (filters.difficulty) {
    result = result.filter(tour => tour.difficulty === filters.difficulty);
  }

  // 2️⃣ Price Range
  if (filters.price) {
    if (filters.price.min !== undefined) {
      result = result.filter(tour => tour.price >= filters.price!.min!);
    }
    if (filters.price.max !== undefined) {
      result = result.filter(tour => tour.price <= filters.price!.max!);
    }
  }

  // 3️⃣ Ratings Average
  if (filters.ratingsAverage?.min !== undefined) {
    result = result.filter(tour => 
      (tour.ratingsAverage || 0) >= filters.ratingsAverage!.min!
    );
  }
 
  // 4️⃣ Sorting 
  if (filters.sort) {
    result = sortTours(result, filters.sort);
  }

  return result;
};

/**
 * 🔄 Sorting Logic
 */
const sortTours = (tours: Tour[], sortBy: string): Tour[] => {
  const sorted = [...tours];
  
  switch (sortBy) {
    case 'price':
      return sorted.sort((a, b) => a.price - b.price);
    case '-price':
      return sorted.sort((a, b) => b.price - a.price);
    case 'ratingsAverage':
      return sorted.sort((a, b) => (a.ratingsAverage || 0) - (b.ratingsAverage || 0));
    case '-ratingsAverage':
      return sorted.sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0));
    case '-createdAt':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'createdAt':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    default:
      return sorted;
  }
};