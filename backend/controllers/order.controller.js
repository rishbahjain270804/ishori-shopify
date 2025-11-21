import orderService from '../services/order.service.js'
import emailService from '../services/email.service.js'
import invoiceService from '../services/invoice.service.js'
import Order from '../models/order.model.js'
import fs from 'fs'

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.user._id, req.body)

    // Send order confirmation email
    try {
      await emailService.sendOrderConfirmationEmail(order, req.user)
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create order',
    })
  }
}

/**
 * @desc    Get user orders
 * @route   GET /api/orders
 * @access  Private
 */
export const getUserOrders = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
    }

    const orders = await orderService.getUserOrders(req.user._id, filters)

    res.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    console.error('Get user orders error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders',
    })
  }
}

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user._id,
      req.user.role === 'admin'
    )

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error('Get order by ID error:', error)
    res.status(error.message === 'Order not found' ? 404 : 403).json({
      success: false,
      message: error.message || 'Failed to fetch order',
    })
  }
}

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Cancellation reason is required',
      })
    }

    const order = await orderService.cancelOrder(
      req.params.id,
      reason,
      'customer',
      req.user._id
    )

    // Send cancellation confirmation email
    try {
      await emailService.sendOrderCancellationEmail(order, req.user)
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError)
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    })
  } catch (error) {
    console.error('Cancel order error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to cancel order',
    })
  }
}

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders/admin/all
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      paymentMethod: req.query.paymentMethod,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      search: req.query.search,
    }

    const pagination = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
    }

    const result = await orderService.getAllOrders(filters, pagination)

    res.json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('Get all orders error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders',
    })
  }
}

/**
 * @desc    Update order status (Admin)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      })
    }

    const order = await orderService.updateOrderStatus(
      req.params.id,
      status,
      note,
      req.user._id
    )

    // Send status update email to customer
    try {
      const populatedOrder = await orderService.getOrderById(req.params.id, order.user, true)
      await emailService.sendOrderStatusUpdateEmail(populatedOrder, populatedOrder.user, status)
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError)
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    })
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update order status',
    })
  }
}

/**
 * @desc    Get order invoice
 * @route   GET /api/orders/:id/invoice
 * @access  Private
 */
export const getOrderInvoice = async (req, res) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user._id,
      req.user.role === 'admin'
    )

    // Check if invoice already exists
    if (order.invoice?.invoiceNumber && invoiceService.invoiceExists(order.invoice.invoiceNumber)) {
      const filePath = invoiceService.getInvoicePath(order.invoice.invoiceNumber)
      return res.download(filePath, `invoice-${order.invoice.invoiceNumber}.pdf`)
    }

    // Generate new invoice
    const invoiceData = await invoiceService.generateInvoice(order, order.user)

    // Update order with invoice info
    await Order.findByIdAndUpdate(order._id, {
      invoice: {
        invoiceNumber: invoiceData.invoiceNumber,
        invoiceUrl: invoiceData.url,
        generatedAt: new Date(),
      },
    })

    // Send the PDF file
    res.download(invoiceData.filePath, invoiceData.fileName)
  } catch (error) {
    console.error('Get invoice error:', error)
    res.status(error.message === 'Order not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to generate invoice',
    })
  }
}
