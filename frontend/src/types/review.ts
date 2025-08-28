export interface Review {
  id: string;
  review: string;   
  rating: number;
  createdAt: string;
  updatedAt?: string; // Optional, if not always returned
  tour: string;
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
export interface ReviewWithTourInfo extends Omit<Review, 'tour'> {
  tour: {
    id: string;
    name: string;
    slug: string;
    imageCover: string;
  };
}