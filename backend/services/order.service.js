import Order from '../models/order.model.js'
import Product from '../models/product.model.js'
import User from '../models/user.model.js'
import inventoryService from './inventory.service.js'

class OrderService {
  /**
   * Create a new order
   */
  async createOrder(userId, orderData) {
    try {
      const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        coupon,
        paymentResult,
      } = orderData

      // Validate stock availability
      for (const item of orderItems) {
        const product = await Product.findById(item.product)
        if (!product) {
          throw new Error(`Product ${item.product} not found`)
        }

        // Check if product has enough stock (assuming size is stored in item)
        if (item.size && product.stock[item.size] < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name} (Size: ${item.size})`
          )
        }
      }

      // Create order
      const order = await Order.create({
        user: userId,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        coupon: coupon || undefined,
        paymentResult: paymentResult || undefined,
        isPaid: paymentMethod === 'Online' || paymentMethod === 'Card',
        paidAt: paymentMethod === 'Online' || paymentMethod === 'Card' ? new Date() : undefined,
        timeline: [
          {
            status: 'Pending',
            timestamp: new Date(),
            note: 'Order placed successfully',
          },
        ],
      })

      // Reduce stock for each item using inventory service
      for (const item of orderItems) {
        if (item.size) {
          try {
            await inventoryService.updateStock(
              item.product,
              item.size,
              item.quantity,
              'order',
              `Stock reduced for order ${order._id}`,
              userId,
              order._id
            )
          } catch (stockError) {
            console.error(`Failed to update stock for product ${item.product}:`, stockError)
            // Continue with order creation even if stock logging fails
          }
        }
      }

      return order
    } catch (error) {
      throw error
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId, status, note, updatedBy) {
    try {
      const order = await Order.findById(orderId)
      if (!order) {
        throw new Error('Order not found')
      }

      // Don't allow status update if order is cancelled
      if (order.orderStatus === 'Cancelled') {
        throw new Error('Cannot update status of cancelled order')
      }

      // Update order status
      order.orderStatus = status
      
      // Add to timeline
      order.timeline.push({
        status,
        timestamp: new Date(),
        note: note || `Order status updated to ${status}`,
        updatedBy,
      })

      // Update delivery status if delivered
      if (status === 'Delivered') {
        order.isDelivered = true
        order.deliveredAt = new Date()
      }

      await order.save()
      return order
    } catch (error) {
      throw error
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId, reason, cancelledBy, userId) {
    try {
      const order = await Order.findById(orderId).populate('orderItems.product')
      if (!order) {
        throw new Error('Order not found')
      }

      // Check if order can be cancelled
      if (order.orderStatus === 'Delivered') {
        throw new Error('Cannot cancel delivered order')
      }

      if (order.orderStatus === 'Cancelled') {
        throw new Error('Order is already cancelled')
      }

      // Only allow cancellation for Pending or Processing orders
      if (!['Pending', 'Processing'].includes(order.orderStatus)) {
        throw new Error('Order cannot be cancelled at this stage')
      }

      // Restore stock for each item using inventory service
      for (const item of order.orderItems) {
        if (item.size) {
          try {
            await inventoryService.updateStock(
              item.product._id,
              item.size,
              item.quantity,
              'cancellation',
              `Stock restored from cancelled order ${order._id}`,
              userId,
              order._id
            )
          } catch (stockError) {
            console.error(`Failed to restore stock for product ${item.product._id}:`, stockError)
            // Continue with cancellation even if stock logging fails
          }
        }
      }

      // Update order
      order.orderStatus = 'Cancelled'
      order.cancellation = {
        reason,
        cancelledBy,
        cancelledAt: new Date(),
        refundStatus: order.isPaid ? 'pending' : undefined,
        refundAmount: order.isPaid ? order.totalPrice : undefined,
      }

      // Add to timeline
      order.timeline.push({
        status: 'Cancelled',
        timestamp: new Date(),
        note: `Order cancelled: ${reason}`,
        updatedBy: userId,
      })

      await order.save()
      return order
    } catch (error) {
      throw error
    }
  }

  /**
   * Generate invoice number
   */
  generateInvoiceNumber(orderId) {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const orderIdShort = orderId.toString().slice(-6).toUpperCase()
    return `INV-${year}${month}-${orderIdShort}`
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId, filters = {}) {
    try {
      const query = { user: userId }

      if (filters.status) {
        query.orderStatus = filters.status
      }

      const orders = await Order.find(query)
        .populate('orderItems.product', 'name images')
        .sort({ createdAt: -1 })

      return orders
    } catch (error) {
      throw error
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId, userId, isAdmin = false) {
    try {
      const order = await Order.findById(orderId)
        .populate('orderItems.product', 'name images price')
        .populate('user', 'name email phone')

      if (!order) {
        throw new Error('Order not found')
      }

      // Check if user has permission to view this order
      if (!isAdmin && order.user._id.toString() !== userId.toString()) {
        throw new Error('Not authorized to view this order')
      }

      return order
    } catch (error) {
      throw error
    }
  }

  /**
   * Get all orders (admin)
   */
  async getAllOrders(filters = {}, pagination = {}) {
    try {
      const query = {}

      if (filters.status) {
        query.orderStatus = filters.status
      }

      if (filters.paymentMethod) {
        query.paymentMethod = filters.paymentMethod
      }

      if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {}
        if (filters.dateFrom) {
          query.createdAt.$gte = new Date(filters.dateFrom)
        }
        if (filters.dateTo) {
          query.createdAt.$lte = new Date(filters.dateTo)
        }
      }

      if (filters.search) {
        // Search by order ID or user email
        const users = await User.find({
          email: { $regex: filters.search, $options: 'i' },
        }).select('_id')
        
        query.$or = [
          { _id: filters.search },
          { user: { $in: users.map(u => u._id) } },
        ]
      }

      const page = pagination.page || 1
      const limit = pagination.limit || 20
      const skip = (page - 1) * limit

      const orders = await Order.find(query)
        .populate('user', 'name email phone')
        .populate('orderItems.product', 'name images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

      const total = await Order.countDocuments(query)

      return {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      throw error
    }
  }
}

export default new OrderService()
