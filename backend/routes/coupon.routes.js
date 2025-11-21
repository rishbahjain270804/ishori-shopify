import express from 'express';
import { validateCoupon, applyCoupon, removeCoupon, getActiveCoupons } from '../controllers/coupon.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All coupon routes require authentication
router.use(protect);

// Validate coupon
router.post('/validate', validateCoupon);

// Apply coupon to cart
router.post('/apply', applyCoupon);

// Remove coupon from cart
router.delete('/remove', removeCoupon);

// Get active coupons
router.get('/active', getActiveCoupons);

export default router;
