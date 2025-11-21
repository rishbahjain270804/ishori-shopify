import express from 'express';
import { 
  createCoupon, 
  getAllCoupons, 
  getCouponById,
  updateCoupon, 
  deleteCoupon,
  toggleCouponStatus
} from '../controllers/admin/coupon.admin.controller.js';
import { processRefund } from '../controllers/payment.controller.js';
import {
  getDashboardStats,
  getRevenueTrends,
  getTopProducts,
  getOrderStatusDistribution,
  getCategoryPerformance
} from '../controllers/admin/analytics.admin.controller.js';
import {
  getSalesReport,
  exportSalesReport,
  getCategoryPerformance as getReportCategoryPerformance,
  getPaymentMethodBreakdown,
  getDailySalesSummary,
  getProductPerformance
} from '../controllers/admin/report.admin.controller.js';
import {
  getAllOrders,
  updateOrderStatus,
  getOrderDetails
} from '../controllers/admin/order.admin.controller.js';
import {
  bulkUpdateStatus,
  bulkDelete,
  updateStock
} from '../controllers/admin/product.admin.controller.js';
import {
  getAllCustomers,
  getCustomerDetails,
  updateCustomerStatus,
  getCustomerOrders,
  getCustomerStats
} from '../controllers/admin/customer.admin.controller.js';
import {
  getLowStockProducts,
  getOutOfStockProducts,
  updateProductStock,
  getStockHistory,
  getInventorySummary,
  bulkUpdateStock
} from '../controllers/admin/inventory.admin.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

// Analytics routes
router.get('/analytics/dashboard', getDashboardStats);
router.get('/analytics/revenue-trends', getRevenueTrends);
router.get('/analytics/top-products', getTopProducts);
router.get('/analytics/order-status', getOrderStatusDistribution);
router.get('/analytics/category-performance', getCategoryPerformance);

// Reports routes
router.get('/reports/sales', getSalesReport);
router.get('/reports/sales/export', exportSalesReport);
router.get('/reports/category-performance', getReportCategoryPerformance);
router.get('/reports/payment-methods', getPaymentMethodBreakdown);
router.get('/reports/daily-sales', getDailySalesSummary);
router.get('/reports/product-performance', getProductPerformance);

// Inventory routes
router.get('/inventory/summary', getInventorySummary);
router.get('/inventory/low-stock', getLowStockProducts);
router.get('/inventory/out-of-stock', getOutOfStockProducts);
router.put('/inventory/:productId/stock', updateProductStock);
router.get('/inventory/:productId/history', getStockHistory);
router.post('/inventory/bulk-update', bulkUpdateStock);

// Coupon management routes
router.post('/coupons', createCoupon);
router.get('/coupons', getAllCoupons);
router.get('/coupons/:id', getCouponById);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.patch('/coupons/:id/status', toggleCouponStatus);

// Payment management routes
router.post('/payments/refund', processRefund);

// Order management routes
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderDetails);
router.put('/orders/:id/status', updateOrderStatus);

// Product management routes
router.post('/products/bulk-update', bulkUpdateStatus);
router.post('/products/bulk-delete', bulkDelete);
router.put('/products/:productId/stock', updateStock);

// Customer management routes
router.get('/customers/stats/summary', getCustomerStats);
router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomerDetails);
router.put('/customers/:id/status', updateCustomerStatus);
router.get('/customers/:id/orders', getCustomerOrders);

export default router;
