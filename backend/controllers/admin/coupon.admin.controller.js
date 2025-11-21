import Coupon from '../../models/coupon.model.js';

/**
 * Create a new coupon
 * POST /api/admin/coupons
 */
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      startDate,
      expiryDate,
      usageLimit,
      applicableProducts,
      applicableCategories,
      status
    } = req.body;

    // Validate required fields
    if (!code || !description || !discountType || !discountValue || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    // Validate discount type and value
    if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Percentage discount must be between 0 and 100'
      });
    }

    // Create coupon
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      maxDiscount: maxDiscount || null,
      startDate: startDate || Date.now(),
      expiryDate,
      usageLimit: usageLimit || null,
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || [],
      status: status || 'active',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating coupon',
      error: error.message
    });
  }
};

/**
 * Get all coupons
 * GET /api/admin/coupons
 */
export const getAllCoupons = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch coupons
    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');

    // Get total count
    const total = await Coupon.countDocuments(query);

    res.status(200).json({
      success: true,
      count: coupons.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      coupons
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupons',
      error: error.message
    });
  }
};

/**
 * Get coupon by ID
 * GET /api/admin/coupons/:id
 */
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('applicableProducts', 'name price images')
      .populate('usedBy.user', 'name email');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      success: true,
      coupon
    });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupon',
      error: error.message
    });
  }
};

/**
 * Update coupon
 * PUT /api/admin/coupons/:id
 */
export const updateCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      startDate,
      expiryDate,
      usageLimit,
      applicableProducts,
      applicableCategories,
      status
    } = req.body;

    // Find coupon
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check if code is being changed and if new code already exists
    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code already exists'
        });
      }
      coupon.code = code.toUpperCase();
    }

    // Update fields
    if (description) coupon.description = description;
    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (minOrderValue !== undefined) coupon.minOrderValue = minOrderValue;
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
    if (startDate) coupon.startDate = startDate;
    if (expiryDate) coupon.expiryDate = expiryDate;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (applicableProducts) coupon.applicableProducts = applicableProducts;
    if (applicableCategories) coupon.applicableCategories = applicableCategories;
    if (status) coupon.status = status;

    await coupon.save();

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      coupon
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating coupon',
      error: error.message
    });
  }
};

/**
 * Delete coupon
 * DELETE /api/admin/coupons/:id
 */
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check if coupon has been used
    if (coupon.usedCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete coupon that has been used. Consider deactivating it instead.'
      });
    }

    await coupon.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting coupon',
      error: error.message
    });
  }
};

/**
 * Toggle coupon status (activate/deactivate)
 * PATCH /api/admin/coupons/:id/status
 */
export const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Toggle status
    coupon.status = coupon.status === 'active' ? 'inactive' : 'active';
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon ${coupon.status === 'active' ? 'activated' : 'deactivated'} successfully`,
      coupon
    });
  } catch (error) {
    console.error('Error toggling coupon status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling coupon status',
      error: error.message
    });
  }
};
