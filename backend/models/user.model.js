import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  },
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: String,
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'India'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    url: String,
    publicId: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  addresses: [addressSchema],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  phoneVerified: {
    type: Boolean,
    default: false
  },
  phoneVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  // Lock account after max attempts
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
  
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  
  return resetToken;
};

// Generate email verification token
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = Math.random().toString(36).substring(2, 15) + 
                           Math.random().toString(36).substring(2, 15);
  
  this.emailVerificationToken = verificationToken;
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Add address
userSchema.methods.addAddress = async function(addressData) {
  // If this is set as default, unset other defaults
  if (addressData.isDefault) {
    this.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  // If this is the first address, make it default
  if (this.addresses.length === 0) {
    addressData.isDefault = true;
  }
  
  this.addresses.push(addressData);
  return this.save();
};

// Update address
userSchema.methods.updateAddress = async function(addressId, addressData) {
  const address = this.addresses.id(addressId);
  if (!address) {
    throw new Error('Address not found');
  }
  
  // If setting as default, unset other defaults
  if (addressData.isDefault) {
    this.addresses.forEach(addr => {
      if (addr._id.toString() !== addressId) {
        addr.isDefault = false;
      }
    });
  }
  
  Object.assign(address, addressData);
  return this.save();
};

// Delete address
userSchema.methods.deleteAddress = async function(addressId) {
  const address = this.addresses.id(addressId);
  if (!address) {
    throw new Error('Address not found');
  }
  
  const wasDefault = address.isDefault;
  address.remove();
  
  // If deleted address was default, make first address default
  if (wasDefault && this.addresses.length > 0) {
    this.addresses[0].isDefault = true;
  }
  
  return this.save();
};

// Add to wishlist
userSchema.methods.addToWishlist = async function(productId) {
  if (!this.wishlist.includes(productId)) {
    this.wishlist.push(productId);
    return this.save();
  }
  return this;
};

// Remove from wishlist
userSchema.methods.removeFromWishlist = async function(productId) {
  this.wishlist = this.wishlist.filter(id => id.toString() !== productId.toString());
  return this.save();
};

// JSON response (exclude sensitive data)
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.emailVerificationToken;
  delete user.emailVerificationExpires;
  delete user.loginAttempts;
  delete user.lockUntil;
  return user;
};

export default mongoose.models.User || mongoose.model('User', userSchema);
