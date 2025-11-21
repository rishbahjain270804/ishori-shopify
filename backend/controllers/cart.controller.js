import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// Get cart by user or session
export const getCart = async (req, res) => {
  try {
    const { sessionId } = req.query;
    const userId = req.user?.id;

    let cart;
    
    if (userId) {
      cart = await Cart.findOne({ user: userId }).populate('items.product');
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId }).populate('items.product');
    }

    if (!cart) {
      return res.json({
        success: true,
        cart: {
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 0
        }
      });
    }

    // Filter out items with deleted products
    cart.items = cart.items.filter(item => item.product);
    await cart.save();

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedSize, selectedColor, sessionId } = req.body;
    const userId = req.user?.id;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Find or create cart
    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({ user: userId });
      }
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
      if (!cart) {
        cart = new Cart({ sessionId });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Session ID required for guest users'
      });
    }

    // Add item
    await cart.addItem(productId, quantity, product.price, {
      selectedSize,
      selectedColor
    });

    // Populate and return
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, sessionId } = req.body;
    const userId = req.user?.id;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Validate stock
    const item = cart.items.id(itemId);
    if (item) {
      const product = await Product.findById(item.product);
      if (product && product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock'
        });
      }
    }

    await cart.updateItemQuantity(itemId, quantity);
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Cart updated',
      cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { sessionId } = req.query;
    const userId = req.user?.id;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.removeItem(itemId);
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item',
      error: error.message
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const { sessionId } = req.query;
    const userId = req.user?.id;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};

// Apply coupon
export const applyCoupon = async (req, res) => {
  try {
    const { couponCode, sessionId } = req.body;
    const userId = req.user?.id;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Validate coupon (simplified - you can add a Coupon model)
    const validCoupons = {
      'WELCOME10': 10, // $10 off
      'SAVE20': 20,    // $20 off
      'FIRST50': 50    // $50 off
    };

    const discountAmount = validCoupons[couponCode.toUpperCase()];
    
    if (!discountAmount) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    await cart.applyCoupon(couponCode.toUpperCase(), discountAmount);
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      cart
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply coupon',
      error: error.message
    });
  }
};

// Merge guest cart with user cart on login
export const mergeCart = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    const guestCart = await Cart.findOne({ sessionId });
    if (!guestCart || guestCart.items.length === 0) {
      return res.json({
        success: true,
        message: 'No guest cart to merge'
      });
    }

    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      // Convert guest cart to user cart
      guestCart.user = userId;
      guestCart.sessionId = null;
      await guestCart.save();
      userCart = guestCart;
    } else {
      // Merge items
      for (const guestItem of guestCart.items) {
        await userCart.addItem(
          guestItem.product,
          guestItem.quantity,
          guestItem.price,
          {
            selectedSize: guestItem.selectedSize,
            selectedColor: guestItem.selectedColor
          }
        );
      }
      // Delete guest cart
      await Cart.deleteOne({ _id: guestCart._id });
    }

    await userCart.populate('items.product');

    res.json({
      success: true,
      message: 'Carts merged successfully',
      cart: userCart
    });
  } catch (error) {
    console.error('Merge cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to merge carts',
      error: error.message
    });
  }
};
