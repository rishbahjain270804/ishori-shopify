import Coupon from '../models/coupon.model.js';
import Product from '../models/product.model.js';

class CouponService {
  /**
   * Validate a coupon code
   * @param {string} code - Coupon code
   * @param {string} userId - User ID
   * @param {number} cartTotal - Cart total amount
   * @param {Array} cartItems - Array of cart items with product IDs
   * @returns {Object} Validation result
   */
  async validateCoupon(code, userId, cartTotal, cartItems = []) {
    try {
      // Find coupon by code
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });

      if (!coupon) {
        return {
          valid: false,
          message: 'Invalid coupon code'
        };
      }

      // Check if coupon is active
      if (coupon.status !== 'active') {
        return {
          valid: false,
          message: 'This coupon is no longer active'
        };
      }

      // Check if coupon has started
      const now = new Date();
      if (coupon.startDate > now) {
        return {
          valid: false,
          message: 'This coupon is not yet active'
        };
      }

      // Check if coupon has expired
      if (coupon.expiryDate <= now) {
        return {
          valid: false,
          message: 'This coupon has expired'
        };
      }

      // Check usage limit
      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        return {
          valid: false,
          message: 'This coupon has reached its usage limit'
        };
      }

      // Check if user has already used this coupon
      if (coupon.hasUserUsed(userId)) {
        return {
          valid: false,
          message: 'You have already used this coupon'
        };
      }

      // Check minimum order value
      if (cartTotal < coupon.minOrderValue) {
        return {
          valid: false,
          message: `Minimum order value of ₹${coupon.minOrderValue} required`
        };
      }

      // Check product/category eligibility
      const isEligible = await this.checkEligibility(coupon, cartItems);
      if (!isEligible) {
        return {
          valid: false,
          message: 'This coupon is not applicable to items in your cart'
        };
      }

      // Calculate discount
      const discount = this.calculateDiscount(coupon, cartTotal);

      return {
        valid: true,
        coupon: {
          id: coupon._id,
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discount: discount
        },
        message: 'Coupon applied successfully'
      };
    } catch (error) {
      console.error('Error validating coupon:', error);
      throw error;
    }
  }

  /**
   * Apply coupon to an order
   * @param {string} code - Coupon code
   * @param {string} userId - User ID
   * @param {string} orderId - Order ID (optional)
   * @returns {Object} Applied coupon details
   */
  async applyCoupon(code, userId, orderId = null) {
    try {
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });

      if (!coupon) {
        throw new Error('Invalid coupon code');
      }

      // Increment usage count
      coupon.usedCount += 1;

      // Add user to usedBy array
      coupon.usedBy.push({
        user: userId,
        usedAt: new Date()
      });

      await coupon.save();

      return {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      };
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  }

  /**
   * Calculate discount amount based on coupon
   * @param {Object} coupon - Coupon object
   * @param {number} cartTotal - Cart total amount
   * @returns {number} Discount amount
   */
  calculateDiscount(coupon, cartTotal) {
    let discount = 0;

    if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountValue) / 100;
      
      // Apply max discount cap if set
      if (coupon.maxDiscount !== null && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
      
      // Discount cannot exceed cart total
      if (discount > cartTotal) {
        discount = cartTotal;
      }
    }

    return Math.round(discount * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Check if coupon is eligible for cart items
   * @param {Object} coupon - Coupon object
   * @param {Array} cartItems - Array of cart items
   * @returns {boolean} Eligibility status
   */
  async checkEligibility(coupon, cartItems) {
    try {
      // If no restrictions, coupon is applicable to all products
      if (
        (!coupon.applicableProducts || coupon.applicableProducts.length === 0) &&
        (!coupon.applicableCategories || coupon.applicableCategories.length === 0)
      ) {
        return true;
      }

      // Check if any cart item matches the restrictions
      for (const item of cartItems) {
        const productId = item.product || item.productId || item._id;

        // Check if product is in applicable products list
        if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
          const isProductApplicable = coupon.applicableProducts.some(
            applicableId => applicableId.toString() === productId.toString()
          );
          if (isProductApplicable) {
            return true;
          }
        }

        // Check if product category is in applicable categories list
        if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
          const product = await Product.findById(productId).select('category');
          if (product && coupon.applicableCategories.includes(product.category)) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking coupon eligibility:', error);
      return false;
    }
  }

  /**
   * Get all active coupons
   * @returns {Array} List of active coupons
   */
  async getActiveCoupons() {
    try {
      const now = new Date();
      const coupons = await Coupon.find({
        status: 'active',
        startDate: { $lte: now },
        expiryDate: { $gt: now }
      }).select('code description discountType discountValue minOrderValue maxDiscount expiryDate');

      return coupons;
    } catch (error) {
      console.error('Error fetching active coupons:', error);
      throw error;
    }
  }

  /**
   * Remove coupon usage (for order cancellation)
   * @param {string} code - Coupon code
   * @param {string} userId - User ID
   */
  async removeCouponUsage(code, userId) {
    try {
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });

      if (coupon) {
        // Decrement usage count
        coupon.usedCount = Math.max(0, coupon.usedCount - 1);

        // Remove user from usedBy array
        coupon.usedBy = coupon.usedBy.filter(
          usage => usage.user.toString() !== userId.toString()
        );

        await coupon.save();
      }
    } catch (error) {
      console.error('Error removing coupon usage:', error);
      throw error;
    }
  }
}

export default new CouponService();
