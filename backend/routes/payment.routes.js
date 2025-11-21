import express from 'express'
import {
  createPaymentOrder,
  verifyPayment,
  createCODOrder,
  getPaymentStatus,
} from '../controllers/payment.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// Create payment order
router.post('/create-order', createPaymentOrder)

// Verify payment
router.post('/verify', verifyPayment)

// Create COD order
router.post('/cod', createCODOrder)

// Get payment status
router.get('/:id', getPaymentStatus)

export default router
