import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchTours, updateFilters } from '../store/slices/toursSlice';
import type { Difficulty } from '../types/tour.types';
import type { ToursFilters, ToursQueryParams } from '../types/tours-api';

/* 🦄 Custom Hook for URL Resolution 
  * This hook parses the URL search parameters and returns a ToursQueryParams object
  * It is used to synchronize the tour filters with the URL
*/
const parseUrlParams = (searchParams: URLSearchParams): ToursQueryParams => {
  // Basic pramas
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const sort = searchParams.get('sort') || '-createdAt';

  // Difficulty params
  const difficulty = searchParams.get('difficulty') as Difficulty || null;

  // Price range params
  const priceGte = searchParams.get('price[gte]') || null;
  const priceLte = searchParams.get('price[lte]') || null;

  // Duration range params
  const durationGte = searchParams.get('duration[gte]') || null;
  const durationLte = searchParams.get('duration[lte]') || null;

  // Ratings params
  const ratingsGte = searchParams.get('ratingsAverage[gte]');

  // 🔑 Returning the parsed query parameters
  return {
    page: Number(page),
    limit: Number(limit),
    sort,
    difficulty: difficulty || undefined,
    price: {
      gte: priceGte ? Number(priceGte) : undefined,
      lte: priceLte ? Number(priceLte) : undefined,
    },
    duration: {
      gte: durationGte ? Number(durationGte) : undefined,
      lte: durationLte ? Number(durationLte) : undefined,
    },
    ratingsAverage: {
      gte: ratingsGte ? Number(ratingsGte) : undefined,
    },
  };
};

/* 🌈 Custom Hook for Building URL 
  * This hook constructs a URL based on the provided filters 
*/
const buildUrlParams = (filters: ToursFilters & { page: number; limit: number }): string => {
  // Create a new URLSearchParams object
  const params = new URLSearchParams(); 

  // ✅ Only non-default values are added
  if (filters.page && filters.page > 1) {
    params.set('page', filters.page.toString());
  }
  
  if (filters.limit && filters.limit !== 12) {
    params.set('limit', filters.limit.toString());
  }
  
  if (filters.sort && filters.sort !== '-createdAt') {
    params.set('sort', filters.sort);
  }
  
  // Difficulty params
  if (filters.difficulty) {
    params.set('difficulty', filters.difficulty);
  }

  // Price range params
  if (filters.price?.gte) {
    params.set('price[gte]', filters.price.gte.toString());
  }
  if (filters.price?.lte) {
    params.set('price[lte]', filters.price.lte.toString());
  }

  // Duration range params
  if (filters.duration?.gte) {
    params.set('duration[gte]', filters.duration.gte.toString());
  }
  if (filters.duration?.lte) {
    params.set('duration[lte]', filters.duration.lte.toString());
  }

  // Ratings params
  if (filters.ratingsAverage?.gte) {
    params.set('ratingsAverage[gte]', filters.ratingsAverage.gte.toString());
  }

  return params.toString();
};

/*  ✅ Sync URL & Redux & UI 
 => 用户操作 → 更新 Redux → 同步 URL → 发起 API 请求
*/
export const useToursSync = () => {
  // 1️⃣ Get search parameters from the URL
  const [searchParams, setSearchParams] = useSearchParams();

  // 2️⃣ dispatch to update the Redux state
  const dispatch = useAppDispatch();

  // 3️⃣ Get the current filters and pagination from the Redux state
  const { isInitialized, filters, pagination } = useAppSelector(state => ({
    isInitialized: state.tours.ui.isInitialized,
    filters: state.tours.data.filters,
    pagination: state.tours.data.pagination,
  }));

  // 4️⃣ Initialize: URL -> Redux
  useEffect(() => {
    if (!isInitialized) {
      console.log('🔄 Syncing URL parameters with Redux state...');
      const urlParams = parseUrlParams(searchParams); // Parse the URL parameters

      // Update the Redux state with parsed filters
      dispatch(updateFilters(urlParams)); 
      
      // Update the URL with the new filters
      dispatch(fetchTours({
        params: urlParams,
        loadingType: 'initial'
      }));
    }
  }, [isInitialized, searchParams, dispatch]);

  // 📚 Handling User Search: Redux -> URL
  const handleSearch = (newFilters: Partial<ToursFilters>) => {
    console.log('🔎 User set filters', newFilters);

    // 1) Update the Redux state with new filters (reset to page 1)
    const updatedFilters = { ...filters, ...newFilters };
    dispatch(updateFilters(updatedFilters));

    // 2) Update the URL with the new filters
    const newUrlParams = buildUrlParams({ 
      ...updatedFilters, 
      page: 1, 
      limit: pagination.limit || 12 
    });
    setSearchParams(newUrlParams, { replace: true }); // Replace the current URL without adding to history

    // 3) Fetch tours with the updated filters
    dispatch(fetchTours({
      params: { 
        ...updatedFilters, 
        page: 1, limit: 
        pagination.limit || 12 
      },
      loadingType: 'search' // Indicate this is a search operation
    }));
  };

  // 📚 Handling Pagination: Redux -> URL
  const handlePagination = (page: number) => {
    console.log('📄 User changed page to', page);

    // 1) Update the Redux state with the new page
    dispatch(updateFilters({ ...filters, page }));

    // 2) Update the URL with the new page
    const newUrlParams = buildUrlParams({ 
      ...filters, 
      page, 
      limit: pagination.limit || 12
    });
    setSearchParams(newUrlParams, { replace: true }); // Replace the current URL without adding to history

    // 3) Fetch tours with the updated filters
    dispatch(fetchTours({
      params: { 
        ...filters, 
        page, 
        limit: pagination.limit || 12
      },
      loadingType: 'pagination' // Indicate this is a pagination operation
    }));
  };

  // Return the handlers for search and pagination
  return {
    handleSearch,
    handlePagination,
  };
};