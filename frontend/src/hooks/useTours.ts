/* 🎯 Business logic layer for tours
 ** Connects Redux state with service layer
 ** Provides a clean interface for components to interact with tours data
*/
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { toursService, ToursError } from '../services/toursService';
import type { ToursFilters } from '../types/tours-store';
import {
  setTours,
  setSelectedTour,
  setLoading,
  setError,
  clearError,
  clearTours,
  clearSelectedTour,
  setFilters,
  setFilteredTours,
  clearFilters,
} from '../store/slices/toursSlice';

export const useTours = () => {
  const dispatch = useAppDispatch();
  
  // Select tours state from Redux store
  const toursState = useAppSelector((state) => state.tours);

  const { allTours, filteredTours, filters } = toursState;

  // 🚀 Load all tours (for homepage)
  const loadAllTours = useCallback(async () => {
    // Avoid re-fetching if already initialized
    if (toursState.isInitialized && toursState.allTours.length > 0) {
      console.log('🔄 Tours already loaded, skipping fetch...');
      return { success: true };
    }

    dispatch(setLoading(true)); // Start loading state
    dispatch(clearError()); // Clear any previous errors

    try {
      console.log('🔄 useTours: Loading all tours...');
      
      const tours = await toursService.fetchAllTours(); // Fetch tours from service layer
      
      dispatch(setTours(tours)); // Update Redux state with fetched tours
      dispatch(setLoading(false)); // Stop loading state
      
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
  }, [dispatch, toursState.isInitialized, toursState.allTours.length]);

  // 🎯 Apply filters to tours
  const applyFilters = useCallback((newFilters: ToursFilters) => {
    console.log('🔍 useTours: Applying filters', newFilters);
    
    try {
      // 1. Update filters in Redux
      dispatch(setFilters(newFilters));
      
      // 2. Use service layer to filter tours
      const filtered = toursService.filterTours(allTours, newFilters);
      
      // 3. Update filtered tours in Redux
      dispatch(setFilteredTours(filtered));
      
      console.log(`✅ useTours: Applied filters, ${filtered.length} tours match`);
    } catch (error) {
      console.error('🚨 useTours: Error applying filters:', error);
    }
  }, [dispatch, allTours]);

  // 🎯 Update a single filter
  const updateFilter = useCallback((filterUpdate: Partial<ToursFilters>) => {
    console.log('🔄 useTours: Updating filter', filterUpdate);
    
    const newFilters = { ...filters, ...filterUpdate };
    applyFilters(newFilters);
  }, [filters, applyFilters]);

  // 🎨 Get available filter options
  const getFilterOptions = useCallback(() => {
    return toursService.getFilterOptions(allTours);
  }, [allTours]);

  // 🎯 Load tour detail by slug (for detail page with slug→id mapping)
  const loadTourDetail = useCallback(async (slug: string) => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      console.log(`🔄 useTours: Loading tour detail for slug: ${slug}`);
      
      // First try to find tour in already loaded tours (optimization)
      const existingTour = toursState.allTours.find(tour => tour.slug === slug);

      if (existingTour) {
        console.log('✅ useTours: Found tour in existing data cache');
        dispatch(setSelectedTour(existingTour));
        dispatch(setLoading(false));
        return { success: true, tour: existingTour };
      }
      
      // If not in cache, we need to fetch all tours first to get the slug→id mapping
      console.log('🔄 useTours: Tour not in cache, checking if we need to load all tours...');
      
      // If tours not loaded yet, load them first
      if (!toursState.isInitialized || toursState.allTours.length === 0) {
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
  }, [dispatch, toursState.allTours, toursState.isInitialized]);

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

  // 🧹 Clear all filters and show all tours
  const clearAllFilters = useCallback(() => {
    console.log('🧹 useTours: Clearing all filters');
    // Reset filters to empty object
    dispatch(clearFilters());
    dispatch(setFilteredTours(allTours)); // Show all tours
  }, [dispatch, allTours]);


  // Return minimal interface for Phase 1
  return {
    // 📊 State 
    tours: filteredTours,          // ← Returns filtered tours
    allTours,                      // ← Raw data for filter options
    filters,                       // ← Current filters
    selectedTour: toursState.selectedTour,
    isLoading: toursState.isLoading,
    error: toursState.error,
    isInitialized: toursState.isInitialized,

    // 🔄 Data Operations
    loadAllTours,        // For homepage tours list
    loadTourDetail,      // For tour detail page
    refreshTours,        // Manual refresh functionality

    // 🎯 Filter Operations
    applyFilters,          // Apply complete filter set
    updateFilter,         // Update single filter
    clearAllFilters,      // Clear all filters
    getFilterOptions,     // Get available options for UI
    
    // 🧹 Utility Operations
    clearError: clearToursError,
    clearTourDetail,     // Clear selected tour when leaving detail page
    clearAllTours,       // Clear all data (logout, etc.)
  };
};