import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Fetch wishlist
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/wishlist`);
      setWishlist(response.data.wishlist || []);
    } catch (error) {
      console.error('Fetch wishlist error:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch on mount and when auth changes
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Add to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return { success: false };
    }

    // Optimistic update
    const tempProduct = { _id: productId };
    setWishlist(prev => [...prev, tempProduct]);

    try {
      const response = await axios.post(`${API_URL}/wishlist`, { productId });
      toast.success('Added to wishlist');
      // Refresh to get full product details
      await fetchWishlist();
      return { success: true };
    } catch (error) {
      console.error('Add to wishlist error:', error);
      // Revert optimistic update
      setWishlist(prev => prev.filter(item => item._id !== productId));
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      return { success: false };
    }

    // Optimistic update
    const previousWishlist = [...wishlist];
    setWishlist(prev => prev.filter(item => item._id !== productId));

    try {
      await axios.delete(`${API_URL}/wishlist/${productId}`);
      toast.success('Removed from wishlist');
      return { success: true };
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      // Revert optimistic update
      setWishlist(previousWishlist);
      const message = error.response?.data?.message || 'Failed to remove from wishlist';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (productId) => {
    const isInWishlist = wishlist.some(item => item._id === productId);
    
    if (isInWishlist) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlist.length;
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    refreshWishlist: fetchWishlist
  };
};
