/* 🎯 Business logic layer for tours - Phase 1 MVP
  - Simple data fetching without complex filtering
  - Focus on core functionality: list + detail
*/

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { toursService, ToursError } from '../services/toursService';
import {
  setTours,
  setSelectedTour,
  setLoading,
  setError,
  clearError,
  clearTours,
  clearSelectedTour,
} from '../store/slices/toursSlice';

export const useTours = () => {
  const dispatch = useAppDispatch();
  
  // Select tours state from Redux store
  const toursState = useAppSelector((state) => state.tours);

  // 🚀 Load all tours (for homepage)
  const loadAllTours = useCallback(async () => {
    // Avoid re-fetching if already initialized
    if (toursState.isInitialized && toursState.tours.length > 0) {
      console.log('🔄 Tours already loaded, skipping fetch...');
      return { success: true };
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      console.log('🔄 useTours: Loading all tours...');
      
      const tours = await toursService.fetchAllTours();
      
      dispatch(setTours(tours));
      dispatch(setLoading(false));
      
      console.log(`✅ useTours: Successfully loaded ${tours.length} tours`);
      return { success: true };
      
    } catch (error) {
      console.error('🚨 useTours: Failed to load tours:', error);
      
      const errorMessage = error instanceof ToursError 
        ? error.message 
        : 'Failed to load tours. Please try again.';
        
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      
      return { success: false, error: errorMessage };
    }
  }, [dispatch, toursState.isInitialized, toursState.tours.length]);

  // 🎯 Load tour detail by slug (for detail page with slug→id mapping)
  const loadTourDetail = useCallback(async (slug: string) => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      console.log(`🔄 useTours: Loading tour detail for slug: ${slug}`);
      
      // First try to find tour in already loaded tours (optimization)
      const existingTour = toursState.tours.find(tour => tour.slug === slug);
      
      if (existingTour) {
        console.log('✅ useTours: Found tour in existing data cache');
        dispatch(setSelectedTour(existingTour));
        dispatch(setLoading(false));
        return { success: true, tour: existingTour };
      }
      
      // If not in cache, we need to fetch all tours first to get the slug→id mapping
      console.log('🔄 useTours: Tour not in cache, checking if we need to load all tours...');
      
      // If tours not loaded yet, load them first
      if (!toursState.isInitialized || toursState.tours.length === 0) {
        console.log('🔄 useTours: Loading all tours to find slug mapping...');
        const allTours = await toursService.fetchAllTours();
        dispatch(setTours(allTours));
        
        // Now try to find the tour by slug
        const foundTour = allTours.find(tour => tour.slug === slug);
        if (foundTour) {
          dispatch(setSelectedTour(foundTour));
          dispatch(setLoading(false));
          return { success: true, tour: foundTour };
        }
      }
      
      // If still not found, the slug doesn't exist
      throw new ToursError('Tour not found', 404);
      
    } catch (error) {
      console.error(`🚨 useTours: Failed to load tour detail for ${slug}:`, error);
      
      let errorMessage = 'Failed to load tour details. Please try again.';
      
      if (error instanceof ToursError && error.statusCode === 404) {
        errorMessage = 'Tour not found. The tour you are looking for does not exist.';
      } else if (error instanceof ToursError) {
        errorMessage = error.message;
      }
        
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      
      return { success: false, error: errorMessage };
    }
  }, [dispatch, toursState.tours, toursState.isInitialized]);

  // 🔄 Refresh tours data
  const refreshTours = useCallback(async () => {
    console.log('🔄 useTours: Refreshing tours data...');
    
    // Clear existing data and fetch fresh
    dispatch(clearTours());
    return await loadAllTours();
  }, [dispatch, loadAllTours]);

  // ✨ Clear error message
  const clearToursError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // 🧹 Clear selected tour (when leaving detail page)
  const clearTourDetail = useCallback(() => {
    dispatch(clearSelectedTour());
  }, [dispatch]);

  // 🧹 Clear all tours data
  const clearAllTours = useCallback(() => {
    console.log('🧹 useTours: Clearing all tours data...');
    dispatch(clearTours());
  }, [dispatch]);

  // Return minimal interface for Phase 1
  return {
    // 📊 State
    tours: toursState.tours,
    selectedTour: toursState.selectedTour,
    isLoading: toursState.isLoading,
    error: toursState.error,
    isInitialized: toursState.isInitialized,
    
    // 🔄 Core Operations
    loadAllTours,        // For homepage tours list
    loadTourDetail,      // For tour detail page
    refreshTours,        // Manual refresh functionality
    
    // 🧹 Utility Operations
    clearError: clearToursError,
    clearTourDetail,     // Clear selected tour when leaving detail page
    clearAllTours,       // Clear all data (logout, etc.)
  };
};