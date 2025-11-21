import Product from '../models/product.model.js';
import StockLog from '../models/stockLog.model.js';

class InventoryService {
  /**
   * Update stock for a product
   */
  async updateStock(productId, size, quantity, type, reason, userId, orderId = null, notes = null) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (!product.stock[size]) {
        throw new Error(`Size ${size} not found for this product`);
      }

      const previousStock = product.stock[size];
      let newStock;

      // Calculate new stock based on type
      if (type === 'add' || type === 'adjustment' || type === 'cancellation' || type === 'return') {
        newStock = previousStock + Math.abs(quantity);
      } else if (type === 'remove' || type === 'order') {
        newStock = previousStock - Math.abs(quantity);
        if (newStock < 0) {
          throw new Error('Insufficient stock');
        }
      } else {
        throw new Error('Invalid stock update type');
      }

      // Update product stock
      product.stock[size] = newStock;
      await product.save();

      // Log the stock change
      await StockLog.create({
        product: productId,
        type,
        quantity: Math.abs(quantity),
        size,
        previousStock,
        newStock,
        reason,
        orderId,
        user: userId,
        notes
      });

      return {
        success: true,
        previousStock,
        newStock,
        product
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(threshold = 5) {
    try {
      const products = await Product.find().lean();
      
      const lowStockProducts = products.filter(product => {
        if (!product.stock) return false;
        
        // Check if any size has stock below threshold
        return Object.values(product.stock).some(quantity => quantity > 0 && quantity <= threshold);
      }).map(product => {
        // Add low stock sizes info
        const lowStockSizes = {};
        Object.entries(product.stock).forEach(([size, quantity]) => {
          if (quantity > 0 && quantity <= threshold) {
            lowStockSizes[size] = quantity;
          }
        });
        
        return {
          ...product,
          lowStockSizes
        };
      });

      return lowStockProducts;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get out of stock products
   */
  async getOutOfStockProducts() {
    try {
      const products = await Product.find().lean();
      
      const outOfStockProducts = products.filter(product => {
        if (!product.stock) return false;
        
        // Check if all sizes are out of stock
        return Object.values(product.stock).every(quantity => quantity === 0);
      });

      return outOfStockProducts;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get stock history for a product
   */
  async getStockHistory(productId, options = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        size = null,
        type = null,
        startDate = null,
        endDate = null
      } = options;

      const query = { product: productId };

      if (size) {
        query.size = size;
      }

      if (type) {
        query.type = type;
      }

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          query.createdAt.$lte = new Date(endDate);
        }
      }

      const skip = (page - 1) * limit;

      const logs = await StockLog.find(query)
        .populate('user', 'firstName lastName email')
        .populate('orderId', '_id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await StockLog.countDocuments(query);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get inventory summary
   */
  async getInventorySummary() {
    try {
      const products = await Product.find().lean();
      
      let totalProducts = products.length;
      let totalStock = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;
      const threshold = 5;

      products.forEach(product => {
        if (product.stock) {
          const stockValues = Object.values(product.stock);
          const productTotalStock = stockValues.reduce((sum, qty) => sum + qty, 0);
          totalStock += productTotalStock;

          // Check if product is low stock
          const hasLowStock = stockValues.some(qty => qty > 0 && qty <= threshold);
          if (hasLowStock) {
            lowStockCount++;
          }

          // Check if product is out of stock
          const isOutOfStock = stockValues.every(qty => qty === 0);
          if (isOutOfStock) {
            outOfStockCount++;
          }
        }
      });

      return {
        totalProducts,
        totalStock,
        lowStockCount,
        outOfStockCount,
        inStockCount: totalProducts - outOfStockCount
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk stock update
   */
  async bulkUpdateStock(updates, userId) {
    try {
      const results = [];

      for (const update of updates) {
        try {
          const result = await this.updateStock(
            update.productId,
            update.size,
            update.quantity,
            update.type || 'adjustment',
            update.reason || 'Bulk stock update',
            userId,
            null,
            update.notes
          );
          results.push({ success: true, productId: update.productId, ...result });
        } catch (error) {
          results.push({ success: false, productId: update.productId, error: error.message });
        }
      }

      return results;
    } catch (error) {
      throw error;
    }
  }
}

export default new InventoryService();
