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
  page?: number;
  limit?: number;
}

/* 
  💦 API Query Parameter Type
  Includes Filtering Conditions + Pagination Parameters
*/
export interface ToursQueryParams extends ToursFilters {
  page: number;
  limit: number;
}


/* 
  💦 Pagination Information
  Pagination Data from the Backend
*/
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalDocs: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/* Tours API Response Types */
export interface ApiResponse<T> {
  status: "success" | "fail" | "error";
  data: T;
  message?: string;
}

export interface ToursApiData {
  docs: Tour[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * 完整的 Tours API 响应类型
 * 组合 ApiResponse + ToursApiData
 */
export type FetchToursResponse = ApiResponse<ToursApiData>;
