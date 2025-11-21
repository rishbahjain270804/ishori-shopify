import express from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { protect, optional } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get cart (works for both authenticated and guest users)
router.get('/', optional, cartController.getCart);

// Add item to cart
router.post('/add', optional, cartController.addToCart);

// Update cart item quantity
router.put('/item/:itemId', optional, cartController.updateCartItem);

// Remove item from cart
router.delete('/item/:itemId', optional, cartController.removeFromCart);

// Clear cart
router.delete('/clear', optional, cartController.clearCart);

// Apply coupon
router.post('/coupon', optional, cartController.applyCoupon);

// Merge guest cart with user cart (on login)
router.post('/merge', protect, cartController.mergeCart);

export default router;
