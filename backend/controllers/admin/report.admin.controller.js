import reportService from '../../services/report.service.js'

/**
 * Get sales report
 * @route GET /api/admin/reports/sales
 * @access Private/Admin
 */
export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    // Default to last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

    const report = await reportService.generateSalesReport(start, end)

    res.status(200).json({
      success: true,
      data: report,
    })
  } catch (error) {
    console.error('Error in getSalesReport:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Export sales report as CSV
 * @route GET /api/admin/reports/sales/export
 * @access Private/Admin
 */
export const exportSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    // Default to last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

    const csv = await reportService.exportSalesReportCSV(start, end)

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=sales-report-${start.toISOString().split('T')[0]}-to-${end.toISOString().split('T')[0]}.csv`
    )

    res.status(200).send(csv)
  } catch (error) {
    console.error('Error in exportSalesReport:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Get category performance
 * @route GET /api/admin/reports/category-performance
 * @access Private/Admin
 */
export const getCategoryPerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    // Default to last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

    const performance = await reportService.getCategorySales(start, end)

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

/**
 * Get payment method breakdown
 * @route GET /api/admin/reports/payment-methods
 * @access Private/Admin
 */
export const getPaymentMethodBreakdown = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    // Default to last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

    const breakdown = await reportService.getPaymentMethodBreakdown(start, end)

    res.status(200).json({
      success: true,
      data: breakdown,
    })
  } catch (error) {
    console.error('Error in getPaymentMethodBreakdown:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Get daily sales summary
 * @route GET /api/admin/reports/daily-sales
 * @access Private/Admin
 */
export const getDailySalesSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    // Default to last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

    const summary = await reportService.getDailySalesSummary(start, end)

    res.status(200).json({
      success: true,
      data: summary,
    })
  } catch (error) {
    console.error('Error in getDailySalesSummary:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Get product performance
 * @route GET /api/admin/reports/product-performance
 * @access Private/Admin
 */
export const getProductPerformance = async (req, res) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query

    // Default to last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

    const performance = await reportService.getProductPerformance(start, end, parseInt(limit))

    res.status(200).json({
      success: true,
      data: performance,
    })
  } catch (error) {
    console.error('Error in getProductPerformance:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
