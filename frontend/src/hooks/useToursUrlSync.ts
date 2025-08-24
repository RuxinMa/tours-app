/* URL sync hook for tours filters */
import { useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTours } from './useTours';
import type { ToursFilters } from '../types/tours-store';
import type { Difficulty } from '../types/tour.types';

/**
 * 🔗 Parse URL parameters to filters
 */
const parseUrlToFilters = (searchParams: URLSearchParams): ToursFilters => {
  const filters: ToursFilters = {};

  // Difficulty filter
  const difficulty = searchParams.get('difficulty') as Difficulty;
  if (difficulty && ['easy', 'medium', 'difficult'].includes(difficulty)) {
    filters.difficulty = difficulty;
  }

  // Price range filter
  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  if (priceMin || priceMax) {
    filters.price = {};
    if (priceMin) filters.price.min = Number(priceMin);
    if (priceMax) filters.price.max = Number(priceMax);
  }

  // Ratings filter
  const ratingsMin = searchParams.get('ratingsMin');
  if (ratingsMin) {
    filters.ratingsAverage = { min: Number(ratingsMin) };
  }

  // Sort filter
  const sort = searchParams.get('sort');
  if (sort) {
    filters.sort = sort;
  }

  return filters;
};

/**
 * 🔗 Convert filters to URL parameters
 */
const filtersToUrlParams = (filters: ToursFilters): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.difficulty) {
    params.set('difficulty', filters.difficulty);
  }

  if (filters.price?.min !== undefined) {
    params.set('priceMin', filters.price.min.toString());
  }
  if (filters.price?.max !== undefined) {
    params.set('priceMax', filters.price.max.toString());
  }

  if (filters.ratingsAverage?.min !== undefined) {
    params.set('ratingsMin', filters.ratingsAverage.min.toString());
  }

  if (filters.sort) {
    params.set('sort', filters.sort);
  }

  return params;
};

/**
 * 🎯 Hook for URL synchronization with tours filters
 */
export const useToursUrlSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, applyFilters, isInitialized } = useTours();
  const hasInitialized = useRef(false);

  // 📖 Initialize filters from URL on mount
  useEffect(() => {
    if (isInitialized) {
      const urlFilters = parseUrlToFilters(searchParams);
      
      // Only apply if URL has filters and they're different from current
      if (Object.keys(urlFilters).length > 0) {
        applyFilters(urlFilters);
      } else {
        applyFilters({});
      }
      hasInitialized.current = true; // Mark as initialized
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]); // Only depend on initialization

  // 🔄 Handle browser navigation (back/forward)
  useEffect(() => {
    if (isInitialized && hasInitialized.current) {
      const urlFilters = parseUrlToFilters(searchParams);
      const currentFiltersStr = JSON.stringify(filters);
      const urlFiltersStr = JSON.stringify(urlFilters);
      
      if (currentFiltersStr !== urlFiltersStr) {
        console.log('🔗 URL Sync: Browser navigation detected, syncing filters');
        applyFilters(urlFilters);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Listen for changes in searchParams after initialization

  // 🔄 Update URL when filters change (but not during initialization)
  const updateUrlFromFilters = useCallback((newFilters: ToursFilters) => {
    console.log('🔗 URL Sync: Updating URL from filters', newFilters);
    
    const params = filtersToUrlParams(newFilters);
    const newUrl = params.toString();
    
    // Only update URL if it's actually different
    if (newUrl !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // 🎯 Apply filters and sync to URL
  const applyFiltersWithUrl = useCallback((newFilters: ToursFilters) => {
    console.log('🎯 URL Sync: Applying filters with URL sync', newFilters);
    
    // Apply filters through useTours
    applyFilters(newFilters);
    
    // Update URL
    updateUrlFromFilters(newFilters);
  }, [applyFilters, updateUrlFromFilters]);

  // 🧹 Clear filters and URL
  const clearFiltersWithUrl = useCallback(() => {
    console.log('🧹 URL Sync: Clearing filters and URL');
    
    // Clear filters through useTours
    applyFilters({});
    
    // Clear URL parameters
    setSearchParams({}, { replace: true });
  }, [applyFilters, setSearchParams]);

  return {
    applyFiltersWithUrl,   // Use this instead of applyFilters for URL sync
    clearFiltersWithUrl,   // Use this instead of clearAllFilters for URL sync
    currentFilters: filters,
  };
};