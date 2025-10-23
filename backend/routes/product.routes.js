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

const router = express.Router()

// Public routes
router.get('/', getProducts)
router.get('/categories', getCategories)
router.get('/featured', getFeaturedProducts)
router.get('/:id', getProductById)

// Admin routes (temporarily without auth for testing)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
