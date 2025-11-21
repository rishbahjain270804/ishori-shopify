import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFilters
} from '../controllers/productController.js';
import {
  searchProducts,
  getSuggestions,
  getFilterOptions
} from '../controllers/search.controller.js';

const router = express.Router();

// Public routes - Search endpoints (must come before /:slug)
router.get('/search', searchProducts);
router.get('/suggestions', getSuggestions);
router.get('/filters', getFilterOptions);
router.get('/filters/options', getFilters);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin routes (add auth middleware later)
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
