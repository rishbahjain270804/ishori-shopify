import axios from 'axios';

// API Base URL - adjust based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status === 404) {
        console.error('Resource not found:', data.message);
      } else if (status === 500) {
        console.error('Server error:', data.message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error: No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Product API endpoints
export const productAPI = {
  // Get all products with filters
  getProducts: (params) => api.get('/products', { params }),
  
  // Search products with advanced filtering
  searchProducts: (params) => api.get('/products/search', { params }),
  
  // Get search suggestions for autocomplete
  getSuggestions: (query) => api.get('/products/suggestions', { params: { q: query } }),
  
  // Get single product by slug
  getProduct: (slug) => api.get(`/products/${slug}`),
  
  // Get filter options
  getFilters: () => api.get('/products/filters'),
  
  // Create product (admin)
  createProduct: (data) => api.post('/products', data),
  
  // Update product (admin)
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  
  // Delete product (admin)
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Order API endpoints (placeholder for future)
export const orderAPI = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrder: (id, data) => api.put(`/orders/${id}`, data),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel`),
};

// User API endpoints (placeholder for future)
export const userAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
};

// Cart API endpoints (placeholder for future)
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

// Wishlist API endpoints (placeholder for future)
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
};

// Review API endpoints (placeholder for future)
export const reviewAPI = {
  getReviews: (productId) => api.get(`/products/${productId}/reviews`),
  createReview: (productId, data) => api.post(`/products/${productId}/reviews`, data),
  updateReview: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};
