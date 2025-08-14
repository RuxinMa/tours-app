export interface Review {
  id: string;
  tour: {
    id: string; // Tour ID
    name: string; // Tour name
    imageCover: string; // URL of the cover image
    slug: string; // Slug for the tour URL
  };
  rating: number; // Rating given by the user (1-5)
  review: string; // Text of the review
  createdAt: string; // Date when the review was created
  updatedAt?: string; // Date when the review was last updated
  user?: {
    name: string;
    photo?: string; // Optional user photo URL
  }; // Optional user details for display purposes
}