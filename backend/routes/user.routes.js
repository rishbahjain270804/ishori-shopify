import express from 'express';
import User from '../models/user.model.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  getUserProfile,
  updateUserProfile
} from '../controllers/user.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Notification preferences routes
router.get('/notification-preferences', getNotificationPreferences);
router.put('/notification-preferences', updateNotificationPreferences);

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
router.get('/addresses', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
      error: error.message
    });
  }
});

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
router.post('/addresses', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.addAddress(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add address',
      error: error.message
    });
  }
});

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
router.put('/addresses/:addressId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.updateAddress(req.params.addressId, req.body);
    
    res.json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message
    });
  }
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
router.delete('/addresses/:addressId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.deleteAddress(req.params.addressId);
    
    res.json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message
    });
  }
});

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
router.get('/wishlist', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'name price originalPrice discount images slug category');
    
    res.json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message
    });
  }
});

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
router.post('/wishlist/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.addToWishlist(req.params.productId);
    await user.populate('wishlist', 'name price originalPrice discount images slug category');
    
    res.json({
      success: true,
      message: 'Added to wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist',
      error: error.message
    });
  }
});

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
router.delete('/wishlist/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.removeFromWishlist(req.params.productId);
    await user.populate('wishlist', 'name price originalPrice discount images slug category');
    
    res.json({
      success: true,
      message: 'Removed from wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist',
      error: error.message
    });
  }
});

export default router;
