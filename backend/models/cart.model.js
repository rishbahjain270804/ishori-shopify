import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  selectedSize: {
    type: String,
    default: 'Free Size'
  },
  selectedColor: {
    type: String
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true // Allow null for guest users
  },
  sessionId: {
    type: String,
    index: true // For guest cart tracking
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  couponCode: {
    type: String
  },
  coupon: {
    code: {
      type: String
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    discountValue: {
      type: Number
    },
    discount: {
      type: Number
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days
  }
}, {
  timestamps: true
});

// Index for automatic cart cleanup
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate tax (example: 10%)
  this.tax = this.subtotal * 0.10;
  
  // Calculate shipping (free over $100)
  this.shipping = this.subtotal > 100 ? 0 : 10;
  
  // Apply discount from coupon or discount field
  const discountAmount = (this.coupon && this.coupon.discount) ? this.coupon.discount : (this.discount || 0);
  
  // Calculate total
  this.total = this.subtotal + this.tax + this.shipping - discountAmount;
  
  this.lastUpdated = new Date();
  next();
});

// Methods
cartSchema.methods.addItem = async function(productId, quantity, price, options = {}) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString() &&
    item.selectedSize === (options.selectedSize || 'Free Size') &&
    item.selectedColor === options.selectedColor
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity,
      price,
      selectedSize: options.selectedSize || 'Free Size',
      selectedColor: options.selectedColor
    });
  }

  return this.save();
};

cartSchema.methods.updateItemQuantity = async function(itemId, quantity) {
  const item = this.items.id(itemId);
  if (item) {
    if (quantity <= 0) {
      item.remove();
    } else {
      item.quantity = quantity;
    }
    return this.save();
  }
  throw new Error('Item not found in cart');
};

cartSchema.methods.removeItem = async function(itemId) {
  this.items.id(itemId).remove();
  return this.save();
};

cartSchema.methods.clearCart = async function() {
  this.items = [];
  this.couponCode = null;
  this.discount = 0;
  return this.save();
};

cartSchema.methods.applyCoupon = async function(couponCode, discountAmount) {
  this.couponCode = couponCode;
  this.discount = discountAmount;
  return this.save();
};

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
