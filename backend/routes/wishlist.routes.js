import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist
} from '../controllers/wishlist.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

// Wishlist routes
router.route('/')
  .get(getWishlist)
  .post(addToWishlist)
  .delete(clearWishlist);

router.delete('/:productId', removeFromWishlist);

export default router;
