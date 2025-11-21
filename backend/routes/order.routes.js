import express from 'express'
import { protect, admin } from '../middleware/auth.middleware.js'
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderInvoice,
} from '../controllers/order.controller.js'

const router = express.Router()

// Customer routes
router.post('/', protect, createOrder)
router.get('/', protect, getUserOrders)
router.get('/:id', protect, getOrderById)
router.get('/:id/invoice', protect, getOrderInvoice)
router.put('/:id/cancel', protect, cancelOrder)

// Admin routes
router.get('/admin/all', protect, admin, getAllOrders)
router.put('/:id/status', protect, admin, updateOrderStatus)

export default router
