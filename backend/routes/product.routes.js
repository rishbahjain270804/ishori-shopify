import express from 'express'
import { protect, admin } from '../middleware/auth.middleware.js'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getFeaturedProducts
} from '../controllers/product.controller.js'
import {
  searchProducts,
  getSuggestions,
  getFilterOptions
} from '../controllers/search.controller.js'

const router = express.Router()

// Public routes - Search endpoints (must come before /:id)
router.get('/search', searchProducts)
router.get('/suggestions', getSuggestions)
router.get('/filters', getFilterOptions)
router.get('/categories', getCategories)
router.get('/featured', getFeaturedProducts)
router.get('/', getProducts)
router.get('/:id', getProductById)

// Admin routes (temporarily without auth for testing)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
