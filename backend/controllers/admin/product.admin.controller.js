import Product from '../../models/product.model.js';

// Bulk update product status
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { productIds, status } = req.body;

    // Validate input
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status value
    const validStatuses = ['active', 'inactive', 'out-of-stock', 'discontinued'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Update products
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { status, updatedAt: Date.now() } }
    );

    res.json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} product(s)`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error in bulk update status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update products',
      error: error.message
    });
  }
};

// Bulk delete products
export const bulkDelete = async (req, res) => {
  try {
    const { productIds } = req.body;

    // Validate input
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }

    // Delete products
    const result = await Product.deleteMany({
      _id: { $in: productIds }
    });

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} product(s)`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete products',
      error: error.message
    });
  }
};

// Update product stock
export const updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock, operation } = req.body;

    if (!stock || typeof stock !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Valid stock quantity is required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update stock based on operation
    if (operation === 'add') {
      product.stock += stock;
    } else if (operation === 'subtract') {
      product.stock = Math.max(0, product.stock - stock);
    } else {
      product.stock = stock; // Set directly
    }

    // Update status based on stock
    if (product.stock === 0) {
      product.status = 'out-of-stock';
    } else if (product.status === 'out-of-stock' && product.stock > 0) {
      product.status = 'active';
    }

    await product.save();

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    });
  }
};
