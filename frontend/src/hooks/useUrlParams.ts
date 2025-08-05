import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FilterState } from '../types';

export const useUrlParams = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = useCallback((key: string): string => {
    return searchParams.get(key) || '';
  }, [searchParams]);

  const setParam = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const setMultipleParams = useCallback((params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const clearParams = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const navigateWithParams = useCallback((path: string, params?: Record<string, string>) => {
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          searchParams.set(key, value);
        }
      });
      navigate(`${path}?${searchParams.toString()}`);
    } else {
      navigate(path);
    }
  }, [navigate]);

  const getFiltersFromUrl = useCallback((): FilterState => {
    return {
      search: getParam('query') || getParam('search') || '',
      location: getParam('location') || '',
      city: getParam('city') || '',
      priceRange: getParam('priceRange') || '',
      rating: getParam('rating') || '',
      category: getParam('category') || '',
      premiumOnly: getParam('premiumOnly') === 'true'
    };
  }, [getParam]);

  const updateFiltersInUrl = useCallback((filters: FilterState) => {
    const params: Record<string, string> = {};
    
    if (filters.search) params.query = filters.search;
    if (filters.location) params.location = filters.location;
    if (filters.city) params.city = filters.city;
    if (filters.priceRange) params.priceRange = filters.priceRange;
    if (filters.rating) params.rating = filters.rating;
    if (filters.category) params.category = filters.category;
    if (filters.premiumOnly) params.premiumOnly = 'true';
    
    setMultipleParams(params);
  }, [setMultipleParams]);

  return {
    getParam,
    setParam,
    setMultipleParams,
    clearParams,
    navigateWithParams,
    getFiltersFromUrl,
    updateFiltersInUrl,
    searchParams
  };
}; 