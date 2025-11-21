import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    index: true
  },
  otp: {
    type: String,
    required: [true, 'OTP is required']
  },
  expiresAt: {
    type: Date,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Document will be automatically deleted after 1 hour
  }
}, {
  timestamps: true
});

// Index for automatic cleanup of expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to check if OTP is expired
otpSchema.methods.isExpired = function() {
  return Date.now() > this.expiresAt;
};

// Method to increment attempts
otpSchema.methods.incrementAttempts = async function() {
  this.attempts += 1;
  return this.save();
};

export default mongoose.models.OTP || mongoose.model('OTP', otpSchema);
