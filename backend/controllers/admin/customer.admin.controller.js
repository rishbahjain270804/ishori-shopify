import User from '../../models/user.model.js';
import Order from '../../models/order.model.js';

/**
 * @desc    Get all customers with pagination and filters
 * @route   GET /api/admin/customers
 * @access  Private/Admin
 */
export const getAllCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { role: 'user' }; // Only get customers, not admins

    // Search by name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Get customers
    const customers = await User.find(query)
      .select('-password -passwordResetToken -emailVerificationToken')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await User.countDocuments(query);

    // Calculate lifetime value and order count for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ user: customer._id });
        
        const totalOrders = orders.length;
        const lifetimeValue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const lastOrder = orders.length > 0 
          ? orders.sort((a, b) => b.createdAt - a.createdAt)[0].createdAt 
          : null;

        return {
          ...customer,
          stats: {
            totalOrders,
            lifetimeValue,
            lastOrderDate: lastOrder
          }
        };
      })
    );

    res.json({
      success: true,
      data: customersWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all customers error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch customers'
    });
  }
};

/**
 * @desc    Get customer details by ID
 * @route   GET /api/admin/customers/:id
 * @access  Private/Admin
 */
export const getCustomerDetails = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)
      .select('-password -passwordResetToken -emailVerificationToken')
      .lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get customer orders
    const orders = await Order.find({ user: customer._id })
      .populate('orderItems.product', 'name images price')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate statistics
    const totalOrders = orders.length;
    const lifetimeValue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = totalOrders > 0 ? lifetimeValue / totalOrders : 0;
    
    const ordersByStatus = {
      pending: orders.filter(o => o.orderStatus === 'Pending').length,
      processing: orders.filter(o => o.orderStatus === 'Processing').length,
      shipped: orders.filter(o => o.orderStatus === 'Shipped').length,
      delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
      cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length
    };

    const lastOrder = orders.length > 0 ? orders[0] : null;

    res.json({
      success: true,
      data: {
        customer,
        stats: {
          totalOrders,
          lifetimeValue,
          averageOrderValue,
          ordersByStatus,
          lastOrderDate: lastOrder?.createdAt || null
        },
        recentOrders: orders.slice(0, 5) // Last 5 orders
      }
    });
  } catch (error) {
    console.error('Get customer details error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch customer details'
    });
  }
};

/**
 * @desc    Update customer status (active/inactive/suspended)
 * @route   PUT /api/admin/customers/:id/status
 * @access  Private/Admin
 */
export const updateCustomerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (active, inactive, or suspended)'
      });
    }

    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Prevent changing admin status
    if (customer.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot change admin user status'
      });
    }

    customer.status = status;
    await customer.save();

    res.json({
      success: true,
      message: `Customer status updated to ${status}`,
      data: customer
    });
  } catch (error) {
    console.error('Update customer status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update customer status'
    });
  }
};

/**
 * @desc    Get customer order history
 * @route   GET /api/admin/customers/:id/orders
 * @access  Private/Admin
 */
export const getCustomerOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = ''
    } = req.query;

    // Check if customer exists
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Build query
    const query = { user: req.params.id };
    if (status) {
      query.orderStatus = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get orders
    const orders = await Order.find(query)
      .populate('orderItems.product', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch customer orders'
    });
  }
};

/**
 * @desc    Get customer statistics summary
 * @route   GET /api/admin/customers/stats/summary
 * @access  Private/Admin
 */
export const getCustomerStats = async (req, res) => {
  try {
    // Total customers
    const totalCustomers = await User.countDocuments({ role: 'user' });
    
    // Active customers
    const activeCustomers = await User.countDocuments({ 
      role: 'user', 
      status: 'active' 
    });
    
    // Inactive customers
    const inactiveCustomers = await User.countDocuments({ 
      role: 'user', 
      status: 'inactive' 
    });
    
    // Suspended customers
    const suspendedCustomers = await User.countDocuments({ 
      role: 'user', 
      status: 'suspended' 
    });

    // New customers this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newCustomersThisMonth = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: startOfMonth }
    });

    // Customers with orders
    const customersWithOrders = await Order.distinct('user');

    res.json({
      success: true,
      data: {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        suspendedCustomers,
        newCustomersThisMonth,
        customersWithOrders: customersWithOrders.length,
        customersWithoutOrders: totalCustomers - customersWithOrders.length
      }
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch customer statistics'
    });
  }
};
