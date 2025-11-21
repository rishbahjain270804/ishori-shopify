import Review from '../models/review.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { productId, rating, title, description, images } = req.body;
    const userId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user purchased this product
    const order = await Order.findOne({
      user: userId,
      'orderItems.product': productId,
      orderStatus: { $in: ['Delivered', 'Processing', 'Shipped'] }
    });

    const verifiedPurchase = !!order;

    // Create review
    const review = await Review.create({
      product: productId,
      user: userId,
      order: order?._id,
      rating,
      title,
      description,
      images: images || [],
      verifiedPurchase,
      status: 'approved'
    });

    // Populate user details
    await review.populate('user', 'firstName lastName avatar');

    // Update product rating
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create review'
    });
  }
};

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get reviews with pagination
    const reviews = await Review.find({
      product: productId,
      status: 'approved'
    })
      .populate('user', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const totalReviews = await Review.countDocuments({
      product: productId,
      status: 'approved'
    });

    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
      {
        $match: {
          product: product._id,
          status: 'approved'
        }
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasMore: skip + reviews.length < totalReviews
      },
      ratingDistribution,
      averageRating: product.ratings.average,
      totalRatings: product.ratings.count
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch reviews'
    });
  }
};

// Mark review as helpful
export const markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked this review as helpful
    const alreadyMarked = review.helpfulBy.some(
      id => id.toString() === userId.toString()
    );

    if (alreadyMarked) {
      // Remove from helpful
      review.helpfulBy = review.helpfulBy.filter(
        id => id.toString() !== userId.toString()
      );
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      // Add to helpful
      review.helpfulBy.push(userId);
      review.helpfulCount += 1;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: alreadyMarked ? 'Removed from helpful' : 'Marked as helpful',
      helpfulCount: review.helpfulCount,
      isHelpful: !alreadyMarked
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update helpful status'
    });
  }
};

// Update product rating (internal function)
export const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({
      product: productId,
      status: 'approved'
    });

    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        'ratings.average': 0,
        'ratings.count': 0,
        reviewCount: 0,
        reviews: []
      });
      return;
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update product
    await Product.findByIdAndUpdate(productId, {
      'ratings.average': Math.round(averageRating * 10) / 10, // Round to 1 decimal
      'ratings.count': reviews.length,
      reviewCount: reviews.length,
      reviews: reviews.map(r => r._id)
    });
  } catch (error) {
    console.error('Update product rating error:', error);
    throw error;
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: userId })
      .populate('product', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasMore: skip + reviews.length < totalReviews
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user reviews'
    });
  }
};

// Check if user can review a product
export const canReviewProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      product: productId,
      user: userId
    });

    if (existingReview) {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: 'already_reviewed',
        review: existingReview
      });
    }

    // Check if user purchased the product
    const order = await Order.findOne({
      user: userId,
      'orderItems.product': productId,
      orderStatus: { $in: ['Delivered', 'Processing', 'Shipped'] }
    });

    res.status(200).json({
      success: true,
      canReview: true,
      hasPurchased: !!order,
      orderId: order?._id
    });
  } catch (error) {
    console.error('Can review product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check review eligibility'
    });
  }
};
