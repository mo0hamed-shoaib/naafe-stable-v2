import { useState, useCallback, useMemo } from 'react';
import { ServiceCategory } from '../types';
import { sortOptions } from '../data/categories';

export const useSort = (categories: ServiceCategory[]) => {
  const [sortBy, setSortBy] = useState('recommended');

  const sortedCategories = useMemo(() => {
    const sorted = [...categories];
    
    switch (sortBy) {
      case 'most-popular':
        // Sort by service count (highest = most popular)
        return sorted.sort((a, b) => b.serviceCount - a.serviceCount);
      case 'price-low':
        // Sort by starting price (lowest first)
        return sorted.sort((a, b) => a.startingPrice - b.startingPrice);
      case 'price-high':
        // Sort by starting price (highest first)
        return sorted.sort((a, b) => b.startingPrice - a.startingPrice);
      case 'alphabetical':
        // Sort alphabetically by name
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'recently-added':
        // Sort by date added (newest first)
        return sorted.sort((a, b) => {
          const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
          const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
          return dateB - dateA;
        });
      case 'recommended':
      default:
        // Smart Picks: Uses a smart algorithm that combines service count (70%) and affordability (30%)
        return sorted.sort((a, b) => {
          // Calculate a recommendation score based on service count and affordability
          const scoreA = a.serviceCount * 0.7 + (100 - a.startingPrice) * 0.3;
          const scoreB = b.serviceCount * 0.7 + (100 - b.startingPrice) * 0.3;
          return scoreB - scoreA;
        });
    }
  }, [categories, sortBy]);

  const updateSort = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
  }, []);

  return {
    sortBy,
    updateSort,
    sortedCategories,
    sortOptions,
  };
};