import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../config/api';

/**
 * Custom hook for managing search and filter state
 * Syncs with URL query parameters for shareable URLs
 */
const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({
    categories: [],
    fabrics: [],
    colors: [],
    priceRange: { min: 0, max: 100000 }
  });

  // Get active filters from URL
  const getActiveFilters = useCallback(() => {
    const active = {};
    searchParams.forEach((value, key) => {
      if (value && key !== 'page' && key !== 'limit') {
        active[key] = value;
      }
    });
    return active;
  }, [searchParams]);

  // Fetch available filter options
  const fetchFilters = useCallback(async () => {
    try {
      const response = await productAPI.getFilters();
      if (response.data.success) {
        setFilters(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  }, []);

  // Search products with current filters
  const searchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      // Use search API
      const response = await productAPI.searchProducts(params);

      if (response.data.success) {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err.response?.data?.message || 'Failed to search products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Update a single filter
  const updateFilter = useCallback((key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    
    // Reset to page 1 when filters change
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Update multiple filters at once
  const updateFilters = useCallback((filtersObj) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(filtersObj).forEach(([key, value]) => {
      if (value && value !== '') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    // Reset to page 1
    newParams.set('page', '1');
    
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  // Clear a specific filter
  const clearFilter = useCallback((key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    newParams.set('page', '1');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Change page
  const changePage = useCallback((page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, setSearchParams]);

  // Change sort order
  const changeSort = useCallback((sortValue) => {
    updateFilter('sort', sortValue);
  }, [updateFilter]);

  // Set search query
  const setSearchQuery = useCallback((query) => {
    updateFilter('q', query);
  }, [updateFilter]);

  // Get count of active filters (excluding page, limit, sort, q)
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    searchParams.forEach((value, key) => {
      if (value && !['page', 'limit', 'sort', 'q'].includes(key)) {
        count++;
      }
    });
    return count;
  }, [searchParams]);

  // Fetch filters on mount
  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  // Search products when URL params change
  useEffect(() => {
    searchProducts();
  }, [searchProducts]);

  return {
    // State
    products,
    loading,
    error,
    pagination,
    filters,
    activeFilters: getActiveFilters(),
    activeFilterCount: getActiveFilterCount(),
    
    // Actions
    updateFilter,
    updateFilters,
    clearFilters,
    clearFilter,
    changePage,
    changeSort,
    setSearchQuery,
    refetch: searchProducts
  };
};

export default useSearch;
