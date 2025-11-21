import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'cod'],
    },
    paymentGateway: {
      type: String,
      enum: ['razorpay', 'stripe', 'cod'],
      default: 'razorpay',
    },
    gatewayOrderId: {
      type: String,
    },
    gatewayPaymentId: {
      type: String,
    },
    gatewaySignature: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending',
    },
    failureReason: {
      type: String,
    },
    refund: {
      amount: {
        type: Number,
      },
      refundId: {
        type: String,
      },
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
      },
      processedAt: {
        type: Date,
      },
      reason: {
        type: String,
      },
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
paymentSchema.index({ order: 1 })
paymentSchema.index({ user: 1 })
paymentSchema.index({ gatewayOrderId: 1 })
paymentSchema.index({ gatewayPaymentId: 1 })
paymentSchema.index({ status: 1 })

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema)

export default Payment
