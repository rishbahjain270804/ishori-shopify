import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [3, 'Coupon code must be at least 3 characters'],
    maxlength: [20, 'Coupon code must not exceed 20 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  discountType: {
    type: String,
    required: [true, 'Discount type is required'],
    enum: {
      values: ['percentage', 'fixed'],
      message: 'Discount type must be either percentage or fixed'
    }
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value must be positive']
  },
  minOrderValue: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order value must be positive']
  },
  maxDiscount: {
    type: Number,
    default: null,
    min: [0, 'Maximum discount must be positive']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  usageLimit: {
    type: Number,
    default: null,
    min: [1, 'Usage limit must be at least 1']
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    usedAt: {
      type: Date,
      default: Date.now
    }
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive'],
      message: 'Status must be either active or inactive'
    },
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index on code field for fast lookups
couponSchema.index({ code: 1 });

// Index on status and expiry date for active coupon queries
couponSchema.index({ status: 1, expiryDate: 1 });

// Virtual to check if coupon is expired
couponSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Virtual to check if coupon has reached usage limit
couponSchema.virtual('isLimitReached').get(function() {
  return this.usageLimit !== null && this.usedCount >= this.usageLimit;
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.status === 'active' &&
    this.startDate <= now &&
    this.expiryDate > now &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
};

// Method to check if user has already used this coupon
couponSchema.methods.hasUserUsed = function(userId) {
  return this.usedBy.some(usage => usage.user.toString() === userId.toString());
};

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
