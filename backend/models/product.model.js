import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    images: [
      {
        url: String, // absolute URL or /api/images/:id
        fileId: String, // GridFS file _id as string
        publicId: String, // optional for cloud providers
      },
    ],
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      trim: true,
    },
    fabric: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    stock: {
      S: {
        type: Number,
        default: 0,
        min: 0,
      },
      M: {
        type: Number,
        default: 0,
        min: 0,
      },
      L: {
        type: Number,
        default: 0,
        min: 0,
      },
      XL: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

// Index for search
productSchema.index({ name: 'text', description: 'text' })

const Product = mongoose.model('Product', productSchema)

export default Product
