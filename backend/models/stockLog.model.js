import mongoose from 'mongoose';

const stockLogSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['add', 'remove', 'adjustment', 'order', 'cancellation', 'return'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: String
}, {
  timestamps: true
});

// Indexes for efficient queries
stockLogSchema.index({ product: 1, createdAt: -1 });
stockLogSchema.index({ type: 1 });
stockLogSchema.index({ createdAt: -1 });

export default mongoose.models.StockLog || mongoose.model('StockLog', stockLogSchema);
