import inventoryService from '../../services/inventory.service.js';
import Product from '../../models/product.model.js';

/**
 * @desc    Get low stock products
 * @route   GET /api/admin/inventory/low-stock
 * @access  Private/Admin
 */
export const getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;
    const products = await inventoryService.getLowStockProducts(threshold);

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch low stock products'
    });
  }
};

/**
 * @desc    Get out of stock products
 * @route   GET /api/admin/inventory/out-of-stock
 * @access  Private/Admin
 */
export const getOutOfStockProducts = async (req, res) => {
  try {
    const products = await inventoryService.getOutOfStockProducts();

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Get out of stock products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch out of stock products'
    });
  }
};

/**
 * @desc    Update product stock
 * @route   PUT /api/admin/inventory/:productId/stock
 * @access  Private/Admin
 */
export const updateProductStock = async (req, res) => {
  try {
    const { size, quantity, type, reason, notes } = req.body;

    if (!size || quantity === undefined || !type || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Size, quantity, type, and reason are required'
      });
    }

    const result = await inventoryService.updateStock(
      req.params.productId,
      size,
      quantity,
      type,
      reason,
      req.user._id,
      null,
      notes
    );

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Update product stock error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update stock'
    });
  }
};

/**
 * @desc    Get stock history for a product
 * @route   GET /api/admin/inventory/:productId/history
 * @access  Private/Admin
 */
export const getStockHistory = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
      size: req.query.size,
      type: req.query.type,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const result = await inventoryService.getStockHistory(req.params.productId, options);

    res.json({
      success: true,
      data: result.logs,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get stock history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch stock history'
    });
  }
};

/**
 * @desc    Get inventory summary
 * @route   GET /api/admin/inventory/summary
 * @access  Private/Admin
 */
export const getInventorySummary = async (req, res) => {
  try {
    const summary = await inventoryService.getInventorySummary();

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Get inventory summary error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch inventory summary'
    });
  }
};

/**
 * @desc    Bulk update stock
 * @route   POST /api/admin/inventory/bulk-update
 * @access  Private/Admin
 */
export const bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates array is required'
      });
    }

    const results = await inventoryService.bulkUpdateStock(updates, req.user._id);

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `Bulk update completed: ${successCount} succeeded, ${failCount} failed`,
      data: results
    });
  } catch (error) {
    console.error('Bulk update stock error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to bulk update stock'
    });
  }
};
