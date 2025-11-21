# Payment API Documentation

## Overview
This document provides detailed information about the Payment API endpoints for the Ishori Sarees e-commerce platform.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Customer Endpoints

### 1. Create Payment Order

Initialize a Razorpay payment order for an existing order.

**Endpoint:** `POST /api/payments/create-order`

**Authentication:** Required (Customer)

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "amount": 1500
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "razorpayOrderId": "order_MNxyz123456789",
    "amount": 1500,
    "currency": "INR",
    "paymentId": "507f1f77bcf86cd799439012",
    "key": "rzp_test_xxxxxxxxxxxxx"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `403` - Not authorized to access this order
- `404` - Order not found
- `500` - Server error

---

### 2. Verify Payment

Verify Razorpay payment signature after successful payment.

**Endpoint:** `POST /api/payments/verify`

**Authentication:** Required (Customer)

**Request Body:**
```json
{
  "razorpay_order_id": "order_MNxyz123456789",
  "razorpay_payment_id": "pay_ABCxyz987654321",
  "razorpay_signature": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "orderId": "507f1f77bcf86cd799439011",
    "paymentId": "507f1f77bcf86cd799439012",
    "status": "success"
  }
}
```

**Error Responses:**
- `400` - Missing parameters or invalid signature
- `500` - Verification failed

**Side Effects:**
- Updates payment status to "success"
- Updates order `isPaid` to true
- Sets order status to "Processing"
- Adds timeline entry to order

---

### 3. Create COD Order

Create a Cash on Delivery order without payment gateway.

**Endpoint:** `POST /api/payments/cod`

**Authentication:** Required (Customer)

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "amount": 1500
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "COD order created successfully",
  "data": {
    "orderId": "507f1f77bcf86cd799439011",
    "paymentId": "507f1f77bcf86cd799439012",
    "orderStatus": "Processing"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `403` - Not authorized to access this order
- `404` - Order not found
- `500` - Server error

**Side Effects:**
- Creates payment record with method "cod"
- Sets order payment method to "COD"
- Sets order status to "Processing"
- Adds timeline entry to order

---

### 4. Get Payment Status

Retrieve payment details by payment ID.

**Endpoint:** `GET /api/payments/:id`

**Authentication:** Required (Customer or Admin)

**URL Parameters:**
- `id` - Payment ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "order": {
      "_id": "507f1f77bcf86cd799439011",
      "orderNumber": "ORD-2024-001",
      "totalPrice": 1500
    },
    "user": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "amount": 1500,
    "currency": "INR",
    "paymentMethod": "card",
    "paymentGateway": "razorpay",
    "gatewayOrderId": "order_MNxyz123456789",
    "gatewayPaymentId": "pay_ABCxyz987654321",
    "status": "success",
    "completedAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:25:00.000Z"
  }
}
```

**Error Responses:**
- `403` - Not authorized to access this payment
- `404` - Payment not found
- `500` - Server error

---

## Admin Endpoints

### 5. Process Refund

Process a refund for a successful payment (Admin only).

**Endpoint:** `POST /api/admin/payments/refund`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "amount": 1500,
  "reason": "Order cancelled by customer"
}
```

**Parameters:**
- `orderId` (required) - Order ID to refund
- `amount` (optional) - Refund amount (defaults to full payment amount)
- `reason` (optional) - Reason for refund

**Success Response (200):**
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "success": true,
    "refundId": "rfnd_XYZabc123456789",
    "amount": 1500,
    "status": "processed"
  }
}
```

**Error Responses:**
- `400` - Missing order ID
- `404` - No successful payment found for order
- `500` - Refund processing failed

**Side Effects:**
- Creates refund in Razorpay
- Updates payment status to "refunded"
- Updates payment refund details
- Updates order cancellation refund status
- Sets order refund amount

---

## Payment Flow Diagrams

### Online Payment Flow
```
1. Customer completes checkout
   ↓
2. Frontend calls POST /api/payments/create-order
   ↓
3. Backend creates Razorpay order
   ↓
4. Frontend displays Razorpay checkout modal
   ↓
5. Customer completes payment on Razorpay
   ↓
6. Razorpay sends callback to frontend
   ↓
7. Frontend calls POST /api/payments/verify
   ↓
8. Backend verifies signature
   ↓
9. Order status updated to "Processing"
   ↓
10. Customer redirected to success page
```

### COD Payment Flow
```
1. Customer selects COD at checkout
   ↓
2. Frontend calls POST /api/payments/cod
   ↓
3. Backend creates COD payment record
   ↓
4. Order status updated to "Processing"
   ↓
5. Customer redirected to success page
```

### Refund Flow
```
1. Admin initiates refund
   ↓
2. Admin calls POST /api/admin/payments/refund
   ↓
3. Backend calls Razorpay refund API
   ↓
4. Payment status updated to "refunded"
   ↓
5. Order cancellation status updated
   ↓
6. Customer receives refund notification
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Missing or invalid parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side error |

---

## Payment Status Values

| Status | Description |
|--------|-------------|
| `pending` | Payment initiated but not completed |
| `success` | Payment completed successfully |
| `failed` | Payment failed |
| `refunded` | Payment refunded |

---

## Payment Methods

| Method | Description |
|--------|-------------|
| `card` | Credit/Debit card |
| `upi` | UPI payment |
| `netbanking` | Net banking |
| `wallet` | Digital wallet |
| `cod` | Cash on Delivery |

---

## Security Considerations

1. **Signature Verification**: All Razorpay payments are verified using HMAC SHA256 signature
2. **Order Ownership**: Users can only create payments for their own orders
3. **Admin Authorization**: Refunds require admin role
4. **HTTPS**: All payment endpoints should use HTTPS in production
5. **Token Expiry**: JWT tokens expire after 30 days
6. **No Card Storage**: Card details are never stored on the server

---

## Testing with Razorpay Test Mode

Razorpay provides test credentials for development:

**Test Card Details:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Test UPI ID:**
- `success@razorpay`

**Test Credentials:**
- Key ID: `rzp_test_xxxxxxxxxxxxx`
- Key Secret: `xxxxxxxxxxxxxxxxxxxxxxxx`

---

## Environment Variables Required

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
JWT_SECRET=your_jwt_secret
```

---

## Rate Limiting

Currently, no rate limiting is implemented on payment endpoints. Consider adding rate limiting in production to prevent abuse.

---

## Webhooks (Future Enhancement)

Razorpay webhooks can be configured to receive payment status updates automatically. This is recommended for production to handle edge cases where the frontend callback might fail.

**Webhook Events to Handle:**
- `payment.captured`
- `payment.failed`
- `refund.processed`
- `refund.failed`

---

## Support

For issues or questions about the Payment API, contact the development team or refer to:
- Razorpay Documentation: https://razorpay.com/docs/
- Internal API Documentation: This file
