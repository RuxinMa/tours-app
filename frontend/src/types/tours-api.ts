import type { Difficulty, Tour } from './tour.types';

/* 
  💦 Tours Filters Parameters
  For users to filter and paginate tours
*/
export interface ToursFilters {
  difficulty?: Difficulty;
  price?: { gte?: number; lte?: number };
  duration?: { gte?: number; lte?: number };
  ratingsAverage?: { gte?: number };
  sort?: string;
}

/* Tours API Response Types */
export interface ApiResponse<T> {
  status: "success" | "fail" | "error";
  data: T;
  message?: string;
}

export interface ToursApiData {
  docs: Tour[]; // Array of tours
}

/**
 * 🎯 Tours API Response
 * Returns all tours for client-side filtering
 */
export type FetchToursResponse = ApiResponse<ToursApiData>

/* 
  🎯 Client-side filtering function type
  For filtering tours on the frontend
*/
export type TourFilterFunction = (tours: Tour[], filters: ToursFilters) => Tour[];;
