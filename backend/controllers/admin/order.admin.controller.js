import orderService from '../../services/order.service.js';
import emailService from '../../services/email.service.js';
import smsService from '../../services/sms.service.js';

/**
 * @desc    Get all orders with filters (Admin)
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      paymentMethod: req.query.paymentMethod,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      search: req.query.search,
    };

    const pagination = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
    };

    const result = await orderService.getAllOrders(filters, pagination);

    res.json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders',
    });
  }
};

/**
 * @desc    Update order status (Admin)
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const order = await orderService.updateOrderStatus(
      req.params.id,
      status,
      note,
      req.user._id
    );

    // Send status update notifications to customer
    try {
      const populatedOrder = await orderService.getOrderById(req.params.id, order.user, true);
      
      // Send email notification
      await emailService.sendOrderStatusUpdateEmail(populatedOrder, populatedOrder.user, status);
      
      // Send SMS notification for important status updates
      if (['Shipped', 'Delivered'].includes(status) && populatedOrder.user.phone) {
        const smsMessage = status === 'Shipped' 
          ? `Your Ishori order ${populatedOrder._id.toString().slice(-6)} has been shipped and is on its way!`
          : `Your Ishori order ${populatedOrder._id.toString().slice(-6)} has been delivered. Thank you for shopping with us!`;
        
        try {
          await smsService.client?.messages.create({
            body: smsMessage,
            from: smsService.phoneNumber,
            to: populatedOrder.user.phone
          });
          console.log(`✅ SMS notification sent to ${populatedOrder.user.phone}`);
        } catch (smsError) {
          console.error('Failed to send SMS notification:', smsError);
          // Don't fail the request if SMS fails
        }
      }
    } catch (notificationError) {
      console.error('Failed to send notifications:', notificationError);
      // Don't fail the request if notifications fail
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update order status',
    });
  }
};

/**
 * @desc    Get order details (Admin)
 * @route   GET /api/admin/orders/:id
 * @access  Private/Admin
 */
export const getOrderDetails = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id, null, true);

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(error.message === 'Order not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to fetch order details',
    });
  }
};
