import Order from '../models/order.model.js'
import { Parser } from 'json2csv'

class ReportService {
  /**
   * Generate sales report
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Object} Sales report data
   */
  async generateSalesReport(startDate, endDate) {
    try {
      const orders = await Order.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        isPaid: true,
      })
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 })

      // Calculate totals
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
      const totalOrders = orders.length
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Group by payment method
      const paymentMethodBreakdown = {}
      orders.forEach(order => {
        const method = order.paymentMethod || 'Unknown'
        if (!paymentMethodBreakdown[method]) {
          paymentMethodBreakdown[method] = {
            count: 0,
            revenue: 0,
          }
        }
        paymentMethodBreakdown[method].count++
        paymentMethodBreakdown[method].revenue += order.totalPrice
      })

      // Group by status
      const statusBreakdown = {}
      orders.forEach(order => {
        const status = order.orderStatus || 'Unknown'
        if (!statusBreakdown[status]) {
          statusBreakdown[status] = {
            count: 0,
            revenue: 0,
          }
        }
        statusBreakdown[status].count++
        statusBreakdown[status].revenue += order.totalPrice
      })

      return {
        summary: {
          totalRevenue,
          totalOrders,
          avgOrderValue,
          startDate,
          endDate,
        },
        paymentMethodBreakdown: Object.entries(paymentMethodBreakdown).map(([method, data]) => ({
          method,
          ...data,
        })),
        statusBreakdown: Object.entries(statusBreakdown).map(([status, data]) => ({
          status,
          ...data,
        })),
        orders: orders.map(order => ({
          orderId: order._id,
          orderDate: order.createdAt,
          customerName: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
          customerEmail: order.user?.email,
          totalAmount: order.totalPrice,
          paymentMethod: order.paymentMethod,
          status: order.orderStatus,
          itemsCount: order.orderItems.length,
        })),
      }
    } catch (error) {
      console.error('Error generating sales report:', error)
      throw new Error(`Failed to generate sales report: ${error.message}`)
    }
  }

  /**
   * Get category sales breakdown
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} Category sales data
   */
  async getCategorySales(startDate, endDate) {
    try {
      const categorySales = await Order.aggregate([
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

      return categorySales.map(item => ({
        category: item._id || 'Uncategorized',
        revenue: item.totalRevenue,
        quantity: item.totalQuantity,
        orders: item.orderCount,
      }))
    } catch (error) {
      console.error('Error getting category sales:', error)
      throw new Error(`Failed to get category sales: ${error.message}`)
    }
  }

  /**
   * Get payment method breakdown
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} Payment method breakdown
   */
  async getPaymentMethodBreakdown(startDate, endDate) {
    try {
      const breakdown = await Order.aggregate([
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
            _id: '$paymentMethod',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$totalPrice' },
          },
        },
        {
          $sort: { totalRevenue: -1 },
        },
      ])

      return breakdown.map(item => ({
        method: item._id || 'Unknown',
        count: item.count,
        revenue: item.totalRevenue,
      }))
    } catch (error) {
      console.error('Error getting payment method breakdown:', error)
      throw new Error(`Failed to get payment method breakdown: ${error.message}`)
    }
  }

  /**
   * Export sales report to CSV
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {String} CSV data
   */
  async exportSalesReportCSV(startDate, endDate) {
    try {
      const report = await this.generateSalesReport(startDate, endDate)

      const fields = [
        { label: 'Order ID', value: 'orderId' },
        { label: 'Order Date', value: 'orderDate' },
        { label: 'Customer Name', value: 'customerName' },
        { label: 'Customer Email', value: 'customerEmail' },
        { label: 'Total Amount', value: 'totalAmount' },
        { label: 'Payment Method', value: 'paymentMethod' },
        { label: 'Status', value: 'status' },
        { label: 'Items Count', value: 'itemsCount' },
      ]

      const parser = new Parser({ fields })
      const csv = parser.parse(report.orders)

      return csv
    } catch (error) {
      console.error('Error exporting sales report:', error)
      throw new Error(`Failed to export sales report: ${error.message}`)
    }
  }

  /**
   * Get daily sales summary
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} Daily sales data
   */
  async getDailySalesSummary(startDate, endDate) {
    try {
      const dailySales = await Order.aggregate([
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
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
            },
            totalRevenue: { $sum: '$totalPrice' },
            totalOrders: { $sum: 1 },
            avgOrderValue: { $avg: '$totalPrice' },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
        },
      ])

      return dailySales.map(item => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        revenue: item.totalRevenue,
        orders: item.totalOrders,
        avgOrderValue: item.avgOrderValue,
      }))
    } catch (error) {
      console.error('Error getting daily sales summary:', error)
      throw new Error(`Failed to get daily sales summary: ${error.message}`)
    }
  }

  /**
   * Get product performance report
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Number} limit - Number of products
   * @returns {Array} Product performance data
   */
  async getProductPerformance(startDate, endDate, limit = 50) {
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
          $group: {
            _id: '$orderItems.product',
            productName: { $first: '$orderItems.name' },
            totalQuantity: { $sum: '$orderItems.quantity' },
            totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
            avgPrice: { $avg: '$orderItems.price' },
            orderCount: { $sum: 1 },
          },
        },
        {
          $sort: { totalRevenue: -1 },
        },
        {
          $limit: limit,
        },
      ])

      return performance.map(item => ({
        productId: item._id,
        productName: item.productName,
        quantitySold: item.totalQuantity,
        revenue: item.totalRevenue,
        avgPrice: item.avgPrice,
        orders: item.orderCount,
      }))
    } catch (error) {
      console.error('Error getting product performance:', error)
      throw new Error(`Failed to get product performance: ${error.message}`)
    }
  }
}

export default new ReportService()
