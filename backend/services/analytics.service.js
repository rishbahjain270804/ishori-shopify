import Order from '../models/order.model.js'
import Product from '../models/product.model.js'
import User from '../models/user.model.js'

class AnalyticsService {
  /**
   * Get dashboard statistics
   * @param {Date} startDate - Start date for analytics
   * @param {Date} endDate - End date for analytics
   * @returns {Object} Dashboard statistics
   */
  async getDashboardStats(startDate, endDate) {
    try {
      const dateFilter = {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }

      // Get total revenue
      const revenueResult = await Order.aggregate([
        {
          $match: {
            ...dateFilter,
            isPaid: true,
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            totalOrders: { $sum: 1 },
          },
        },
      ])

      const revenue = revenueResult[0] || { totalRevenue: 0, totalOrders: 0 }

      // Get total customers
      const totalCustomers = await User.countDocuments({
        ...dateFilter,
        role: 'customer',
      })

      // Get average order value
      const avgOrderValue = revenue.totalOrders > 0 ? revenue.totalRevenue / revenue.totalOrders : 0

      // Get previous period stats for comparison
      const periodDuration = endDate - startDate
      const prevStartDate = new Date(startDate.getTime() - periodDuration)
      const prevEndDate = startDate

      const prevRevenueResult = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: prevStartDate,
              $lte: prevEndDate,
            },
            isPaid: true,
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            totalOrders: { $sum: 1 },
          },
        },
      ])

      const prevRevenue = prevRevenueResult[0] || { totalRevenue: 0, totalOrders: 0 }

      // Calculate growth percentages
      const revenueGrowth =
        prevRevenue.totalRevenue > 0
          ? ((revenue.totalRevenue - prevRevenue.totalRevenue) / prevRevenue.totalRevenue) * 100
          : 0

      const ordersGrowth =
        prevRevenue.totalOrders > 0
          ? ((revenue.totalOrders - prevRevenue.totalOrders) / prevRevenue.totalOrders) * 100
          : 0

      return {
        totalRevenue: revenue.totalRevenue,
        totalOrders: revenue.totalOrders,
        totalCustomers,
        avgOrderValue,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        ordersGrowth: Math.round(ordersGrowth * 10) / 10,
      }
    } catch (error) {
      console.error('Error getting dashboard stats:', error)
      throw new Error(`Failed to get dashboard stats: ${error.message}`)
    }
  }

  /**
   * Get revenue trends over time
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {String} interval - Interval (day, week, month)
   * @returns {Array} Revenue trends data
   */
  async getRevenueTrends(startDate, endDate, interval = 'day') {
    try {
      let groupBy
      let dateFormat

      switch (interval) {
        case 'week':
          groupBy = {
            year: { $year: '$createdAt' },
            week: { $week: '$createdAt' },
          }
          dateFormat = 'Week %V, %Y'
          break
        case 'month':
          groupBy = {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          }
          dateFormat = '%B %Y'
          break
        default: // day
          groupBy = {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          }
          dateFormat = '%Y-%m-%d'
      }

      const trends = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
            isPaid: true,
          },
        },
        {
          $group: {
            _id: groupBy,
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 },
        },
      ])

      return trends.map(item => ({
        date: this.formatDate(item._id, interval),
        revenue: item.revenue,
        orders: item.orders,
      }))
    } catch (error) {
      console.error('Error getting revenue trends:', error)
      throw new Error(`Failed to get revenue trends: ${error.message}`)
    }
  }

  /**
   * Format date based on interval
   * @param {Object} dateObj - Date object from aggregation
   * @param {String} interval - Interval type
   * @returns {String} Formatted date
   */
  formatDate(dateObj, interval) {
    if (interval === 'week') {
      return `Week ${dateObj.week}, ${dateObj.year}`
    } else if (interval === 'month') {
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      return `${monthNames[dateObj.month - 1]} ${dateObj.year}`
    } else {
      return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`
    }
  }

  /**
   * Get top selling products
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Number} limit - Number of products to return
   * @returns {Array} Top products
   */
  async getTopProducts(startDate, endDate, limit = 10) {
    try {
      const topProducts = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
            isPaid: true,
          },
        },
        {
          $unwind: '$orderItems',
        },
        {
          $group: {
            _id: '$orderItems.product',
            totalQuantity: { $sum: '$orderItems.quantity' },
            totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
            productName: { $first: '$orderItems.name' },
            productImage: { $first: '$orderItems.image' },
          },
        },
        {
          $sort: { totalRevenue: -1 },
        },
        {
          $limit: limit,
        },
      ])

      return topProducts.map(item => ({
        productId: item._id,
        name: item.productName,
        image: item.productImage,
        quantitySold: item.totalQuantity,
        revenue: item.totalRevenue,
      }))
    } catch (error) {
      console.error('Error getting top products:', error)
      throw new Error(`Failed to get top products: ${error.message}`)
    }
  }

  /**
   * Get order status distribution
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} Order status distribution
   */
  async getOrderStatusDistribution(startDate, endDate) {
    try {
      const distribution = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ])

      return distribution.map(item => ({
        status: item._id,
        count: item.count,
      }))
    } catch (error) {
      console.error('Error getting order status distribution:', error)
      throw new Error(`Failed to get order status distribution: ${error.message}`)
    }
  }

  /**
   * Get low stock products
   * @param {Number} threshold - Stock threshold
   * @returns {Array} Low stock products
   */
  async getLowStockProducts(threshold = 5) {
    try {
      const products = await Product.find({
        $or: [
          { countInStock: { $lte: threshold, $gt: 0 } },
          {
            'stock.S': { $lte: threshold, $gt: 0 },
          },
          {
            'stock.M': { $lte: threshold, $gt: 0 },
          },
          {
            'stock.L': { $lte: threshold, $gt: 0 },
          },
          {
            'stock.XL': { $lte: threshold, $gt: 0 },
          },
          {
            'stock.XXL': { $lte: threshold, $gt: 0 },
          },
        ],
      })
        .select('name sku images countInStock stock category')
        .limit(20)

      return products.map(product => ({
        _id: product._id,
        name: product.name,
        sku: product.sku,
        image: product.images?.[0],
        countInStock: product.countInStock,
        stock: product.stock,
        category: product.category,
      }))
    } catch (error) {
      console.error('Error getting low stock products:', error)
      throw new Error(`Failed to get low stock products: ${error.message}`)
    }
  }

  /**
   * Get category performance
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} Category performance data
   */
  async getCategoryPerformance(startDate, endDate) {
    try {
      const performance = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
            isPaid: true,
          },
        },
        {
          $unwind: '$orderItems',
        },
        {
          $lookup: {
            from: 'products',
            localField: 'orderItems.product',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        {
          $unwind: '$productDetails',
        },
        {
          $group: {
            _id: '$productDetails.category',
            totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
            totalQuantity: { $sum: '$orderItems.quantity' },
            orderCount: { $sum: 1 },
          },
        },
        {
          $sort: { totalRevenue: -1 },
        },
      ])

      return performance.map(item => ({
        category: item._id || 'Uncategorized',
        revenue: item.totalRevenue,
        quantity: item.totalQuantity,
        orders: item.orderCount,
      }))
    } catch (error) {
      console.error('Error getting category performance:', error)
      throw new Error(`Failed to get category performance: ${error.message}`)
    }
  }
}

export default new AnalyticsService()
