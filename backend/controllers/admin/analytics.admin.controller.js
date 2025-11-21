import analyticsService from '../../services/analytics.service.js'

/**
 * Get dashboard statistics
 * @route GET /api/admin/analytics/dashboard
 * @access Private/Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    // Default to last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

    const stats = await analyticsService.getDashboardStats(start, end)

    res.status(200).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error in getDashboardStats:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Get revenue trends
 * @route GET /api/admin/analytics/revenue-trends
 * @access Private/Admin
 */
export const getRevenueTrends = async (req, res) => {
  try {
    const { startDate, endDate, interval = 'day' } = req.query

    // Default to last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

    const trends = await analyticsService.getRevenueTrends(start, end, interval)

    res.status(200).json({
      success: true,
      data: trends,
    })
  } catch (error) {
    console.error('Error in getRevenueTrends:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Get top selling products
 * @route GET /api/admin/analytics/top-products
 * @access Private/Admin
 */
export const getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query

    // Default to last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

    const topProducts = await analyticsService.getTopProducts(start, end, parseInt(limit))

    res.status(200).json({
      success: true,
      data: topProducts,
    })
  } catch (error) {
    console.error('Error in getTopProducts:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Get order status distribution
 * @route GET /api/admin/analytics/order-status
 * @access Private/Admin
 */
export const getOrderStatusDistribution = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    // Default to last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

    const distribution = await analyticsService.getOrderStatusDistribution(start, end)

    res.status(200).json({
      success: true,
      data: distribution,
    })
  } catch (error) {
    console.error('Error in getOrderStatusDistribution:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Get category performance
 * @route GET /api/admin/analytics/category-performance
 * @access Private/Admin
 */
export const getCategoryPerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    // Default to last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

    const performance = await analyticsService.getCategoryPerformance(start, end)

    res.status(200).json({
      success: true,
      data: performance,
    })
  } catch (error) {
    console.error('Error in getCategoryPerformance:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
