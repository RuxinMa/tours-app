export interface Review {
  id: string;
  tourId: string; // Reference to the tour being reviewed
  userId: string; // Reference to the user who wrote the review
  rating: number; // Rating given by the user (1-5)
  review: string; // Text of the review
  createdAt: string; // Date when the review was created
  updatedAt?: string; // Date when the review was last updated
  user?: {
    name: string;
    photo?: string; // Optional user photo URL
  }; // Optional user details for display purposes
}