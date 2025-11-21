import Razorpay from 'razorpay'
import crypto from 'crypto'
import Payment from '../models/payment.model.js'
import Order from '../models/order.model.js'

// Lazy initialization of Razorpay instance
let razorpay = null

const getRazorpayInstance = () => {
  if (!razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn('⚠️  Razorpay credentials not configured. Payment features will be limited.')
      return null
    }
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
  return razorpay
}

class PaymentService {
  /**
   * Create a Razorpay order for payment
   * @param {String} orderId - MongoDB order ID
   * @param {Number} amount - Amount in rupees
   * @param {String} userId - User ID
   * @returns {Object} Payment order details
   */
  async createPaymentOrder(orderId, amount, userId) {
    try {
      const razorpayInstance = getRazorpayInstance()
      if (!razorpayInstance) {
        throw new Error('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
      }

      // Validate order exists
      const order = await Order.findById(orderId)
      if (!order) {
        throw new Error('Order not found')
      }

      // Convert amount to paise (Razorpay expects amount in smallest currency unit)
      const amountInPaise = Math.round(amount * 100)

      // Create Razorpay order
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `order_${orderId}`,
        notes: {
          orderId: orderId.toString(),
          userId: userId.toString(),
        },
      })

      // Create payment record in database
      const payment = await Payment.create({
        order: orderId,
        user: userId,
        amount: amount,
        currency: 'INR',
        paymentMethod: 'card', // Will be updated after payment
        paymentGateway: 'razorpay',
        gatewayOrderId: razorpayOrder.id,
        status: 'pending',
      })

      return {
        razorpayOrderId: razorpayOrder.id,
        amount: amount,
        currency: 'INR',
        paymentId: payment._id,
      }
    } catch (error) {
      console.error('Error creating payment order:', error)
      throw new Error(`Failed to create payment order: ${error.message}`)
    }
  }

  /**
   * Verify Razorpay payment signature
   * @param {String} razorpayOrderId - Razorpay order ID
   * @param {String} razorpayPaymentId - Razorpay payment ID
   * @param {String} razorpaySignature - Razorpay signature
   * @returns {Boolean} Verification result
   */
  async verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    try {
      // Create signature string
      const signatureString = `${razorpayOrderId}|${razorpayPaymentId}`

      // Generate expected signature
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(signatureString)
        .digest('hex')

      // Compare signatures
      const isValid = expectedSignature === razorpaySignature

      if (isValid) {
        // Update payment record
        const payment = await Payment.findOne({ gatewayOrderId: razorpayOrderId })
        
        if (payment) {
          payment.gatewayPaymentId = razorpayPaymentId
          payment.gatewaySignature = razorpaySignature
          payment.status = 'success'
          payment.completedAt = new Date()
          await payment.save()

          // Update order status
          const order = await Order.findById(payment.order)
          if (order) {
            order.isPaid = true
            order.paidAt = new Date()
            order.paymentResult = {
              id: razorpayPaymentId,
              status: 'success',
              updateTime: new Date().toISOString(),
            }
            order.orderStatus = 'Processing'
            
            // Add to timeline
            order.timeline.push({
              status: 'Processing',
              timestamp: new Date(),
              note: 'Payment received successfully',
            })
            
            await order.save()
          }

          return { success: true, payment, order }
        }
      }

      return { success: false, message: 'Invalid payment signature' }
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw new Error(`Payment verification failed: ${error.message}`)
    }
  }

  /**
   * Process refund for a payment
   * @param {String} orderId - Order ID
   * @param {Number} amount - Refund amount (optional, full refund if not provided)
   * @param {String} reason - Refund reason
   * @returns {Object} Refund details
   */
  async processRefund(orderId, amount = null, reason = 'Order cancelled') {
    try {
      const razorpayInstance = getRazorpayInstance()
      if (!razorpayInstance) {
        throw new Error('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
      }

      // Find payment record
      const payment = await Payment.findOne({ order: orderId, status: 'success' })
      
      if (!payment) {
        throw new Error('No successful payment found for this order')
      }

      if (!payment.gatewayPaymentId) {
        throw new Error('Payment ID not found')
      }

      // Determine refund amount
      const refundAmount = amount || payment.amount
      const refundAmountInPaise = Math.round(refundAmount * 100)

      // Create refund in Razorpay
      const refund = await razorpayInstance.payments.refund(payment.gatewayPaymentId, {
        amount: refundAmountInPaise,
        notes: {
          reason: reason,
          orderId: orderId.toString(),
        },
      })

      // Update payment record
      payment.status = 'refunded'
      payment.refund = {
        amount: refundAmount,
        refundId: refund.id,
        status: 'completed',
        processedAt: new Date(),
        reason: reason,
      }
      await payment.save()

      // Update order
      const order = await Order.findById(orderId)
      if (order && order.cancellation) {
        order.cancellation.refundStatus = 'completed'
        order.cancellation.refundAmount = refundAmount
        await order.save()
      }

      return {
        success: true,
        refundId: refund.id,
        amount: refundAmount,
        status: refund.status,
      }
    } catch (error) {
      console.error('Error processing refund:', error)
      
      // Update payment record with failed refund
      const payment = await Payment.findOne({ order: orderId })
      if (payment) {
        payment.refund = {
          amount: amount || payment.amount,
          status: 'failed',
          reason: reason,
        }
        await payment.save()
      }

      throw new Error(`Refund processing failed: ${error.message}`)
    }
  }

  /**
   * Get payment status
   * @param {String} paymentId - Payment ID (MongoDB)
   * @returns {Object} Payment details
   */
  async getPaymentStatus(paymentId) {
    try {
      const payment = await Payment.findById(paymentId)
        .populate('order')
        .populate('user', 'name email')

      if (!payment) {
        throw new Error('Payment not found')
      }

      return payment
    } catch (error) {
      console.error('Error fetching payment status:', error)
      throw new Error(`Failed to fetch payment status: ${error.message}`)
    }
  }

  /**
   * Create COD payment record
   * @param {String} orderId - Order ID
   * @param {String} userId - User ID
   * @param {Number} amount - Amount
   * @returns {Object} Payment details
   */
  async createCODPayment(orderId, userId, amount) {
    try {
      // Validate order exists
      const order = await Order.findById(orderId)
      if (!order) {
        throw new Error('Order not found')
      }

      // Create payment record
      const payment = await Payment.create({
        order: orderId,
        user: userId,
        amount: amount,
        currency: 'INR',
        paymentMethod: 'cod',
        paymentGateway: 'cod',
        status: 'pending',
      })

      // Update order
      order.paymentMethod = 'COD'
      order.orderStatus = 'Processing'
      order.timeline.push({
        status: 'Processing',
        timestamp: new Date(),
        note: 'Order placed with Cash on Delivery',
      })
      await order.save()

      return {
        success: true,
        payment,
        order,
      }
    } catch (error) {
      console.error('Error creating COD payment:', error)
      throw new Error(`Failed to create COD payment: ${error.message}`)
    }
  }
}

export default new PaymentService()
