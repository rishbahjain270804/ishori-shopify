# Admin Order Management API Documentation

## Overview

This document describes the admin order management endpoints that allow administrators to view, filter, and manage customer orders.

## Endpoints

### 1. Get All Orders (Admin)

**Endpoint:** `GET /api/admin/orders`

**Authentication:** Required (Admin role)

**Description:** Retrieves all orders with optional filtering, searching, and pagination.

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| status | String | No | Filter by order status | `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled` |
| paymentMethod | String | No | Filter by payment method | `COD`, `Online`, `Card` |
| dateFrom | Date | No | Filter orders from this date | `2024-01-01` |
| dateTo | Date | No | Filter orders until this date | `2024-12-31` |
| search | String | No | Search by order ID or customer email | `user@example.com` |
| page | Number | No | Page number for pagination | `1` (default) |
| limit | Number | No | Number of orders per page | `20` (default) |

**Example Request:**
```bash
GET /api/admin/orders?status=Processing&paymentMethod=Online&page=1&limit=20
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id_123",
      "user": {
        "_id": "user_id_456",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+919876543210"
      },
      "orderItems": [
        {
          "product": {
            "_id": "product_id_789",
            "name": "Banarasi Silk Saree",
            "images": ["image_url"]
          },
          "name": "Banarasi Silk Saree",
          "image": "image_url",
          "price": 5000,
          "quantity": 1
        }
      ],
      "shippingAddress": {
        "street": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zipCode": "400001",
        "country": "India",
        "phone": "+919876543210"
      },
      "paymentMethod": "Online",
      "itemsPrice": 5000,
      "shippingPrice": 100,
      "taxPrice": 900,
      "totalPrice": 6000,
      "isPaid": true,
      "paidAt": "2024-01-15T10:30:00.000Z",
      "orderStatus": "Processing",
      "coupon": {
        "code": "WELCOME10",
        "discount": 500
      },
      "timeline": [
        {
          "status": "Pending",
          "timestamp": "2024-01-15T10:30:00.000Z",
          "note": "Order placed successfully"
        },
        {
          "status": "Processing",
          "timestamp": "2024-01-15T11:00:00.000Z",
          "note": "Order is being processed",
          "updatedBy": "admin_id"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to fetch orders"
}
```

---

### 2. Update Order Status (Admin)

**Endpoint:** `PUT /api/admin/orders/:id/status`

**Authentication:** Required (Admin role)

**Description:** Updates the status of an order and sends automatic email/SMS notifications to the customer.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | String | Yes | Order ID |

**Request Body:**

| Field | Type | Required | Description | Valid Values |
|-------|------|----------|-------------|--------------|
| status | String | Yes | New order status | `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled` |
| note | String | No | Optional note about the status change | Any text |

**Example Request:**
```bash
PUT /api/admin/orders/order_id_123/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "Shipped",
  "note": "Order shipped via Blue Dart. Tracking ID: BD123456789"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "order_id_123",
    "orderStatus": "Shipped",
    "timeline": [
      {
        "status": "Pending",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "note": "Order placed successfully"
      },
      {
        "status": "Processing",
        "timestamp": "2024-01-15T11:00:00.000Z",
        "note": "Order is being processed",
        "updatedBy": "admin_id"
      },
      {
        "status": "Shipped",
        "timestamp": "2024-01-15T14:00:00.000Z",
        "note": "Order shipped via Blue Dart. Tracking ID: BD123456789",
        "updatedBy": "admin_id"
      }
    ],
    "updatedAt": "2024-01-15T14:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Status is required"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Cannot update status of cancelled order"
}
```

---

### 3. Get Order Details (Admin)

**Endpoint:** `GET /api/admin/orders/:id`

**Authentication:** Required (Admin role)

**Description:** Retrieves detailed information about a specific order.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | String | Yes | Order ID |

**Example Request:**
```bash
GET /api/admin/orders/order_id_123
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "order_id_123",
    "user": {
      "_id": "user_id_456",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210"
    },
    "orderItems": [...],
    "shippingAddress": {...},
    "paymentMethod": "Online",
    "orderStatus": "Shipped",
    "timeline": [...],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Order not found"
}
```

---

## Automatic Notifications

When an order status is updated via the `PUT /api/admin/orders/:id/status` endpoint, the system automatically sends notifications to the customer:

### Email Notifications

**Sent for all status updates:**
- Subject: `Order {Status} - {Order ID}`
- Contains: Order details, new status, timeline
- Template: Professional HTML email with Ishori branding

### SMS Notifications

**Sent only for critical status updates:**
- **Shipped:** "Your Ishori order {last 6 digits of order ID} has been shipped and is on its way!"
- **Delivered:** "Your Ishori order {last 6 digits of order ID} has been delivered. Thank you for shopping with us!"

**Note:** SMS notifications require:
- Customer must have a valid phone number
- Twilio credentials must be configured in environment variables
- SMS service must be enabled

---

## Implementation Details

### Backend Files

1. **Controller:** `backend/controllers/admin/order.admin.controller.js`
   - Handles all admin order management logic
   - Implements filtering, pagination, and status updates
   - Triggers email and SMS notifications

2. **Service:** `backend/services/order.service.js`
   - Contains business logic for order operations
   - Handles database queries and data manipulation
   - Manages order timeline updates

3. **Routes:** `backend/routes/admin.routes.js`
   - Defines admin order management endpoints
   - Applies authentication and admin role middleware

4. **Model:** `backend/models/order.model.js`
   - Defines order schema with timeline and cancellation support
   - Includes validation and default values

### Notification Services

1. **Email Service:** `backend/services/email.service.js`
   - Sends order status update emails
   - Uses Nodemailer with SMTP configuration
   - Includes professional HTML templates

2. **SMS Service:** `backend/services/sms.service.js`
   - Sends SMS notifications via Twilio
   - Handles rate limiting and error handling
   - Falls back to mock mode if not configured

---

## Testing

### Manual Testing with Postman/Thunder Client

1. **Get all orders:**
```bash
GET http://localhost:5000/api/admin/orders
Authorization: Bearer <admin_token>
```

2. **Filter orders by status:**
```bash
GET http://localhost:5000/api/admin/orders?status=Processing
Authorization: Bearer <admin_token>
```

3. **Update order status:**
```bash
PUT http://localhost:5000/api/admin/orders/{order_id}/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "Shipped",
  "note": "Order shipped successfully"
}
```

### Expected Behavior

1. ✅ Admin can view all orders with filters
2. ✅ Admin can search orders by customer email or order ID
3. ✅ Admin can update order status
4. ✅ Order timeline is automatically updated
5. ✅ Email notification is sent to customer
6. ✅ SMS notification is sent for Shipped/Delivered status
7. ✅ Proper error handling for invalid requests

---

## Requirements Fulfilled

This implementation fulfills the following requirements from the specification:

- **Requirement 9.1:** Display all orders in a table with filters for status, date range, and payment method ✅
- **Requirement 9.2:** Display full order details with customer information ✅
- **Requirement 9.3:** Allow admins to update order status ✅
- **Requirement 9.4:** Send automatic notifications when order status is updated ✅

---

## Security Considerations

1. **Authentication:** All endpoints require valid JWT token
2. **Authorization:** Only users with admin role can access these endpoints
3. **Input Validation:** Status values are validated against allowed enum values
4. **Error Handling:** Sensitive error details are not exposed to clients
5. **Rate Limiting:** Should be implemented at API gateway level

---

## Future Enhancements

1. Add bulk status update functionality
2. Implement order assignment to specific admins
3. Add order notes/comments system
4. Implement real-time notifications via WebSocket
5. Add order export functionality (CSV/PDF)
6. Implement advanced analytics and reporting
