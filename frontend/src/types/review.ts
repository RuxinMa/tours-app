export interface Review {
  id: string;
  review: string;   
  rating: number;
  createdAt: string;
  updatedAt?: string; // Optional, if not always returned
  tour: string; // Tour ID
  user: {
    id: string;
    name: string;
    photo: string;
  };
}

export interface CreateReviewData {
  review: string;
  rating: number;
  tour: string;  // Tour ID
}

export interface UpdateReviewData {
  review?: string;
  rating?: number;
  updatedAt?: string; // Optional, if not always updated
}

// Extended Review interface for Tour Details Page
export interface ReviewWithTourInfo extends Review {
  tourInfo: {
    id: string;
    name: string;
    slug: string;
    imageCover: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  status: "success" | "fail" | "error";
  data: T;
  message?: string;
}

export interface ReviewsApiData {
  [x: string]: Review[];
  reviews: Review[];  
}

export interface SingleReviewApiData {
  [x: string]: Review;
  review: Review;  
}

export type FetchReviewsResponse = ApiResponse<ReviewsApiData>;
export type CreateReviewResponse = ApiResponse<SingleReviewApiData>;
export type UpdateReviewResponse = ApiResponse<SingleReviewApiData>;