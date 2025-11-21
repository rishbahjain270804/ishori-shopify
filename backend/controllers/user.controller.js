import User from '../models/user.model.js';

/**
 * @desc    Get user notification preferences
 * @route   GET /api/users/notification-preferences
 * @access  Private
 */
export const getNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.preferences
    });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch notification preferences'
    });
  }
};

/**
 * @desc    Update user notification preferences
 * @route   PUT /api/users/notification-preferences
 * @access  Private
 */
export const updateNotificationPreferences = async (req, res) => {
  try {
    const { newsletter, notifications } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    if (newsletter !== undefined) {
      user.preferences.newsletter = newsletter;
    }

    if (notifications) {
      if (notifications.email !== undefined) {
        user.preferences.notifications.email = notifications.email;
      }
      if (notifications.sms !== undefined) {
        user.preferences.notifications.sms = notifications.sms;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: user.preferences
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update notification preferences'
    });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user profile'
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};
