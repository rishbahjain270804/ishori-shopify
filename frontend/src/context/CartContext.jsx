import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Initialize session ID
  useEffect(() => {
    let sid = localStorage.getItem('cart_session_id');
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem('cart_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  // Fetch cart on mount
  useEffect(() => {
    if (sessionId) {
      fetchCart();
    }
  }, [sessionId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/cart`, {
        params: { sessionId }
      });
      setCart(response.data.cart);
    } catch (error) {
      console.error('Fetch cart error:', error);
      // Initialize empty cart on error
      setCart({
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, options = {}) => {
    try {
      const response = await axios.post(`${API_URL}/cart/add`, {
        productId,
        quantity,
        sessionId,
        ...options
      });
      setCart(response.data.cart);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Add to cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add item to cart'
      };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await axios.put(`${API_URL}/cart/item/${itemId}`, {
        quantity,
        sessionId
      });
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      console.error('Update quantity error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update quantity'
      };
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/item/${itemId}`, {
        params: { sessionId }
      });
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      console.error('Remove item error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove item'
      };
    }
  };

  const clearCart = async () => {
    try {
      const response = await axios.delete(`${API_URL}/cart/clear`, {
        params: { sessionId }
      });
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      console.error('Clear cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clear cart'
      };
    }
  };

  const applyCoupon = async (couponCode) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          success: false,
          message: 'Please login to apply coupon'
        };
      }

      const response = await axios.post(
        `${API_URL}/coupons/apply`,
        { code: couponCode },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCart(response.data.cart);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Apply coupon error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to apply coupon'
      };
    }
  };

  const removeCoupon = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          success: false,
          message: 'Please login to remove coupon'
        };
      }

      const response = await axios.delete(`${API_URL}/coupons/remove`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCart(response.data.cart);
      return { success: true, message: 'Coupon removed successfully' };
    } catch (error) {
      console.error('Remove coupon error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove coupon'
      };
    }
  };

  const getCartCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartCount,
    refreshCart: fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
