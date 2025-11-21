import express from 'express';
import {
  createReview,
  getProductReviews,
  markHelpful,
  getUserReviews,
  canReviewProduct
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes (require authentication)
router.post('/', protect, createReview);
router.post('/:reviewId/helpful', protect, markHelpful);
router.get('/user/my-reviews', protect, getUserReviews);
router.get('/can-review/:productId', protect, canReviewProduct);

export default router;
