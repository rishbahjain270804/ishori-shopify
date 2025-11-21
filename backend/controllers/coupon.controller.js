import couponService from '../services/coupon.service.js';
import Cart from '../models/cart.model.js';

/**
 * Validate coupon code
 * POST /api/coupons/validate
 */
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }

    // Calculate cart total
    const cartTotal = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    // Prepare cart items for validation
    const cartItems = cart.items.map(item => ({
      product: item.product._id,
      productId: item.product._id,
      quantity: item.quantity
    }));

    // Validate coupon
    const result = await couponService.validateCoupon(code, userId, cartTotal, cartItems);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
      coupon: result.coupon
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating coupon',
      error: error.message
    });
  }
};

/**
 * Apply coupon to cart
 * POST /api/coupons/apply
 */
export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }

    // Calculate cart total
    const cartTotal = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    // Prepare cart items for validation
    const cartItems = cart.items.map(item => ({
      product: item.product._id,
      productId: item.product._id,
      quantity: item.quantity
    }));

    // Validate coupon first
    const validationResult = await couponService.validateCoupon(code, userId, cartTotal, cartItems);

    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        message: validationResult.message
      });
    }

    // Apply coupon to cart
    cart.coupon = {
      code: validationResult.coupon.code,
      discountType: validationResult.coupon.discountType,
      discountValue: validationResult.coupon.discountValue,
      discount: validationResult.coupon.discount
    };

    await cart.save();

    // Populate cart for response
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      cart: cart,
      discount: validationResult.coupon.discount
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying coupon',
      error: error.message
    });
  }
};

/**
 * Remove coupon from cart
 * DELETE /api/coupons/remove
 */
export const removeCoupon = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove coupon from cart
    cart.coupon = undefined;
    await cart.save();

    // Populate cart for response
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Coupon removed successfully',
      cart: cart
    });
  } catch (error) {
    console.error('Error removing coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing coupon',
      error: error.message
    });
  }
};

/**
 * Get active coupons
 * GET /api/coupons/active
 */
export const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getActiveCoupons();

    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons: coupons
    });
  } catch (error) {
    console.error('Error fetching active coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupons',
      error: error.message
    });
  }
};
