# Admin Order Management - Quick Reference

## 🚀 Quick Start

### Base URL
```
http://localhost:5000/api/admin/orders
```

### Authentication
All requests require admin authentication:
```
Authorization: Bearer <admin_jwt_token>
```

---

## 📋 Common Use Cases

### 1. Get All Orders
```bash
GET /api/admin/orders
```

### 2. Get Pending Orders
```bash
GET /api/admin/orders?status=Pending
```

### 3. Get Today's Orders
```bash
GET /api/admin/orders?dateFrom=2024-01-15&dateTo=2024-01-15
```

### 4. Get COD Orders
```bash
GET /api/admin/orders?paymentMethod=COD
```

### 5. Search by Customer Email
```bash
GET /api/admin/orders?search=customer@example.com
```

### 6. Get Processing Orders (Page 2)
```bash
GET /api/admin/orders?status=Processing&page=2&limit=20
```

### 7. Update Order to Shipped
```bash
PUT /api/admin/orders/{order_id}/status
Content-Type: application/json

{
  "status": "Shipped",
  "note": "Shipped via Blue Dart - Tracking: BD123456"
}
```

### 8. Mark Order as Delivered
```bash
PUT /api/admin/orders/{order_id}/status
Content-Type: application/json

{
  "status": "Delivered"
}
```

### 9. Get Specific Order Details
```bash
GET /api/admin/orders/{order_id}
```

---

## 📊 Filter Combinations

### Recent Online Orders
```bash
GET /api/admin/orders?paymentMethod=Online&dateFrom=2024-01-01
```

### Shipped Orders This Month
```bash
GET /api/admin/orders?status=Shipped&dateFrom=2024-01-01&dateTo=2024-01-31
```

### All Cancelled Orders
```bash
GET /api/admin/orders?status=Cancelled
```

---

## 🔔 Notification Behavior

### Email Notifications
Sent for **ALL** status updates:
- ✅ Pending → Processing
- ✅ Processing → Shipped
- ✅ Shipped → Delivered
- ✅ Any → Cancelled

### SMS Notifications
Sent only for **CRITICAL** updates:
- ✅ Processing → Shipped
- ✅ Shipped → Delivered

---

## 📝 Status Values

Valid order statuses:
- `Pending` - Order placed, awaiting processing
- `Processing` - Order is being prepared
- `Shipped` - Order dispatched for delivery
- `Delivered` - Order successfully delivered
- `Cancelled` - Order cancelled

---

## ⚠️ Important Notes

1. **Cannot update cancelled orders** - Once cancelled, status cannot be changed
2. **Timeline is automatic** - Every status update adds a timeline entry
3. **Notifications are automatic** - Email/SMS sent automatically on status update
4. **Notification failures don't break requests** - If email/SMS fails, order still updates
5. **Admin ID is tracked** - Timeline records which admin made the change

---

## 🧪 Testing with cURL

### Get all orders
```bash
curl -X GET "http://localhost:5000/api/admin/orders" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Update order status
```bash
curl -X PUT "http://localhost:5000/api/admin/orders/ORDER_ID/status" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Shipped",
    "note": "Order shipped successfully"
  }'
```

---

## 🎯 Response Codes

- `200` - Success
- `400` - Bad request (invalid status, missing fields)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (not admin)
- `404` - Order not found
- `500` - Server error

---

## 💡 Pro Tips

1. **Use pagination** for better performance with large datasets
2. **Combine filters** to narrow down results
3. **Add notes** when updating status for better tracking
4. **Check timeline** to see complete order history
5. **Search by email** to find all orders from a customer

---

## 🔗 Related Endpoints

- `GET /api/admin/analytics/dashboard` - Order statistics
- `GET /api/admin/analytics/order-status` - Status distribution
- `POST /api/admin/payments/refund` - Process refunds
- `GET /api/orders/:id/invoice` - Download invoice

---

## 📞 Support

For issues or questions:
- Check logs in backend console
- Verify admin token is valid
- Ensure order ID exists
- Check notification service configuration

---

**Last Updated:** January 2025
