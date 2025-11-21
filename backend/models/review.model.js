import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
      index: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: false
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Review description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    images: [
      {
        url: String,
        publicId: String
      }
    ],
    verifiedPurchase: {
      type: Boolean,
      default: false
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0
    },
    helpfulBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Index for sorting by creation date
reviewSchema.index({ createdAt: -1 });

// Index for filtering by status
reviewSchema.index({ status: 1 });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;
