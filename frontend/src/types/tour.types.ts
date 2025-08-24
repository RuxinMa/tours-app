import type { Review } from './review';

/* Basic Types for Tours */
export interface Location {
  id?: string;
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  description: string;
  day?: number; // Optional day for multi-day tours
  address?: string; // Optional address for startLocation
}

export interface Guide {
  id: string;
  name: string;
  email: string;
  photo: string;
  role: "guide" | "lead-guide";
}

export type Difficulty = 'easy' | 'medium' | 'difficult';

export interface Tour {
  id: string;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: Difficulty;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  reviews?: Review[];
  price: number;
  summary: string;
  description?: string;
  imageCover: string;
  images: string[];
  startLocation: Location;
  locations: Location[];
  guides?: Guide[];
  startDates: string[];
  slug: string;
  durationWeeks?: number;
  createdAt: string; 
}