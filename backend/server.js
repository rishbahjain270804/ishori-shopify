import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/database.js'

// Import routes
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/order.routes.js'
import userRoutes from './routes/user.routes.js'
import imageRoutes from './routes/image.routes.js'
import videoRoutes from './routes/video.routes.js'
import cartRoutes from './routes/cart.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import reviewRoutes from './routes/review.routes.js'
import couponRoutes from './routes/coupon.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import adminRoutes from './routes/admin.routes.js'
import { getFeatures } from './config/features.js'

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()

// Connect to database
connectDB()

// Middleware
// CORS: allow multiple frontends (e.g., Vercel/Hostinger) via env CLIENT_ORIGINS
const rawOrigins = process.env.CLIENT_ORIGINS || process.env.CLIENT_URL || ''
const allowedOrigins = rawOrigins
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

const defaultDevOrigins = ['http://localhost:3000', 'http://localhost:5173']

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests or same-origin
    if (!origin) return callback(null, true)

    const origins = allowedOrigins.length ? allowedOrigins : defaultDevOrigins
    if (origins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`CORS blocked for origin ${origin}`), false)
  },
  credentials: true,
  optionsSuccessStatus: 200
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/users', userRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/admin', adminRoutes)

// Feature flags endpoint (public, cache-friendly)
app.get('/api/features', (req, res) => {
  const features = getFeatures()
  res.set('Cache-Control', 'public, max-age=60')
  res.status(200).json({ success: true, features })
})

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ishori API is running',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`\n🚀 Ishori Backend Server running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV}`)
  console.log(`🌐 API: http://localhost:${PORT}/api`)
  console.log(`💚 Health: http://localhost:${PORT}/api/health\n`)
})
