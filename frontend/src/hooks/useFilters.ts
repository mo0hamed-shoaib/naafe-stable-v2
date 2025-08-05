import { useState, useCallback } from 'react';
import { FilterState } from '../types';

const initialFilters: FilterState = {
  search: '',
  location: '',
  rating: '',
};

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = useCallback(() => {
    return Object.values(filters).some(value => value !== '');
  }, [filters]);

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters: hasActiveFilters(),
  };
};