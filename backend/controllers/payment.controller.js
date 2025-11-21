import paymentService from '../services/payment.service.js'
import Order from '../models/order.model.js'

/**
 * @desc    Create Razorpay order for payment
 * @route   POST /api/payments/create-order
 * @access  Private
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId, amount } = req.body

    // Validate input
    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and amount are required',
      })
    }

    // Verify order belongs to user
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order',
      })
    }

    // Create payment order
    const paymentOrder = await paymentService.createPaymentOrder(
      orderId,
      amount,
      req.user._id
    )

    res.status(200).json({
      success: true,
      data: {
        ...paymentOrder,
        key: process.env.RAZORPAY_KEY_ID, // Send key to frontend
      },
    })
  } catch (error) {
    console.error('Create payment order error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order',
    })
  }
}

/**
 * @desc    Verify Razorpay payment
 * @route   POST /api/payments/verify
 * @access  Private
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification parameters',
      })
    }

    // Verify payment
    const result = await paymentService.verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId: result.order._id,
          paymentId: result.payment._id,
          status: result.payment.status,
        },
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Payment verification failed',
      })
    }
  } catch (error) {
    console.error('Verify payment error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed',
    })
  }
}

/**
 * @desc    Create COD order
 * @route   POST /api/payments/cod
 * @access  Private
 */
export const createCODOrder = async (req, res) => {
  try {
    const { orderId, amount } = req.body

    // Validate input
    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and amount are required',
      })
    }

    // Verify order belongs to user
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order',
      })
    }

    // Create COD payment
    const result = await paymentService.createCODPayment(
      orderId,
      req.user._id,
      amount
    )

    res.status(200).json({
      success: true,
      message: 'COD order created successfully',
      data: {
        orderId: result.order._id,
        paymentId: result.payment._id,
        orderStatus: result.order.orderStatus,
      },
    })
  } catch (error) {
    console.error('Create COD order error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create COD order',
    })
  }
}

/**
 * @desc    Process refund (Admin only)
 * @route   POST /api/admin/payments/refund
 * @access  Private/Admin
 */
export const processRefund = async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body

    // Validate input
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required',
      })
    }

    // Process refund
    const result = await paymentService.processRefund(orderId, amount, reason)

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: result,
    })
  } catch (error) {
    console.error('Process refund error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process refund',
    })
  }
}

/**
 * @desc    Get payment status
 * @route   GET /api/payments/:id
 * @access  Private
 */
export const getPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params

    const payment = await paymentService.getPaymentStatus(id)

    // Verify user has access to this payment
    if (
      payment.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this payment',
      })
    }

    res.status(200).json({
      success: true,
      data: payment,
    })
  } catch (error) {
    console.error('Get payment status error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payment status',
    })
  }
}
