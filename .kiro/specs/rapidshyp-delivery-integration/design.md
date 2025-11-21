# RapidShyp Delivery Integration - Design Document

## Overview

This design document outlines the technical architecture for integrating RapidShyp delivery services into the Ishori e-commerce platform. The integration will provide end-to-end shipping management including order creation, rate calculation, label generation, tracking, and webhook-based status updates.

### Key Design Principles

1. **Asynchronous Processing**: Use job queues for API calls to prevent blocking user requests
2. **Idempotency**: Ensure all operations can be safely retried without side effects
3. **Fault Tolerance**: Implement comprehensive error handling and retry mechanisms
4. **Security**: Secure API credentials and validate all webhook requests
5. **Observability**: Log all API interactions for debugging and audit trails

## Architecture

### System Components

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend API   │
│   (Express.js)  │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────┐
│  Order Service  │  │ RapidShyp    │
│                 │  │ Service      │
└────────┬────────┘  └──────┬───────┘
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────┐
│   MongoDB       │  │ RapidShyp    │
│   Database      │  │ API          │
└─────────────────┘  └──────────────┘
         ▲
         │
┌─────────────────┐
│  Webhook        │
│  Handler        │
└─────────────────┘
```

### Data Flow

1. **Order Creation Flow**:
   - Customer completes checkout → Order created in DB
   - Order service triggers shipment creation job
   - RapidShyp service creates shipment via API
   - AWB number stored in order record
   - Customer receives confirmation email

2. **Tracking Flow**:
   - Customer requests tracking → Backend fetches from RapidShyp
   - Webhook receives status updates → Order status updated
   - Customer notified of significant status changes

3. **Rate Calculator Flow**:
   - Customer enters pincode → Frontend calls backend
   - Backend calls RapidShyp rate API with cached results
   - Available courier options displayed to customer

## Components and Interfaces

### 1. RapidShyp Service Module

**Location**: `backend/services/rapidshyp.service.js`

**Responsibilities**:
- Manage all RapidShyp API communications
- Handle authentication and request signing
- Implement retry logic and error handling
- Cache rate calculations

**Key Methods**:
```javascript
class RapidShypService {
  // Shipment Management
  async createShipment(orderData)
  async cancelShipment(orderId)
  async getShipmentStatus(awbNumber)
  
  // Rate Calculation
  async calculateShippingRates(params)
  async getServiceability(pincode)
  
  // Label & Pickup
  async generateShippingLabel(orderId)
  async schedulePickup(pickupDetails)
  async cancelPickup(pickupId)
  
  // Tracking
  async trackShipment(awbNumber)
  async getTrackingHistory(awbNumber)
  
  // NDR & RTO
  async updateNDRAction(awbNumber, action)
  async getRTODetails(awbNumber)
}
```

### 2. Order Model Extension

**Location**: `backend/models/order.model.js`

**New Fields**:
```javascript
{
  // Existing order fields...
  
  shipping: {
    provider: {
      type: String,
      enum: ['rapidshyp', 'manual'],
      default: 'rapidshyp'
    },
    rapidshypOrderId: String,
    awbNumber: String,
    courierPartner: String,
    trackingUrl: String,
    shippingLabel: String, // URL to label PDF
    
    pickupDetails: {
      pickupId: String,
      scheduledDate: Date,
      pickupStatus: String,
      pickupAddress: Object
    },
    
    trackingHistory: [{
      status: String,
      location: String,
      timestamp: Date,
      remarks: String
    }],
    
    ndr: {
      isNDR: { type: Boolean, default: false },
      reason: String,
      attemptCount: Number,
      lastAttemptDate: Date,
      action: String,
      updatedInstructions: String
    },
    
    rto: {
      isRTO: { type: Boolean, default: false },
      initiatedDate: Date,
      deliveredDate: Date,
      reason: String
    },
    
    estimatedDelivery: Date,
    actualDelivery: Date,
    shippingCost: Number,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  
  status: {
    type: String,
    enum: [
      'pending',
      'processing',
      'ready_for_pickup',
      'picked_up',
      'in_transit',
      'out_for_delivery',
      'delivered',
      'ndr',
      'rto_initiated',
      'rto_delivered',
      'cancelled'
    ],
    default: 'pending'
  }
}
```

### 3. Shipping Configuration Model

**Location**: `backend/models/shippingConfig.model.js`

```javascript
{
  warehouse: {
    name: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    },
    contact: {
      name: String,
      phone: String,
      email: String
    },
    isDefault: Boolean
  },
  
  courierPreferences: [{
    courierCode: String,
    priority: Number,
    enabled: Boolean,
    conditions: {
      minOrderValue: Number,
      maxOrderValue: Number,
      zones: [String],
      productTypes: [String]
    }
  }],
  
  rateCalculation: {
    cacheEnabled: Boolean,
    cacheDuration: Number, // minutes
    fallbackRates: [{
      zone: String,
      baseRate: Number,
      perKgRate: Number
    }]
  },
  
  notifications: {
    adminEmails: [String],
    smsEnabled: Boolean,
    emailEnabled: Boolean
  }
}
```

### 4. Webhook Handler

**Location**: `backend/controllers/rapidshyp.webhook.controller.js`

**Responsibilities**:
- Receive and validate webhook requests
- Process status updates
- Trigger notifications
- Handle NDR and RTO events

**Webhook Events**:
- `shipment.created`
- `shipment.picked_up`
- `shipment.in_transit`
- `shipment.out_for_delivery`
- `shipment.delivered`
- `shipment.ndr`
- `shipment.rto_initiated`
- `shipment.rto_delivered`
- `shipment.cancelled`

### 5. Rate Calculator Controller

**Location**: `backend/controllers/shipping.controller.js`

**Endpoints**:
```javascript
// Calculate shipping rates
POST /api/shipping/calculate-rates
Body: {
  destinationPincode: String,
  weight: Number,
  dimensions: Object,
  declaredValue: Number,
  paymentMode: String
}

// Check serviceability
GET /api/shipping/serviceability/:pincode

// Get courier options
GET /api/shipping/courier-options
```

### 6. Order Controller Extensions

**Location**: `backend/controllers/order.controller.js`

**New Methods**:
```javascript
// Create order with shipment
async createOrderWithShipment(req, res)

// Generate shipping label
async generateLabel(req, res)

// Schedule pickup
async schedulePickup(req, res)

// Track order
async trackOrder(req, res)

// Handle NDR action
async handleNDRAction(req, res)

// Cancel shipment
async cancelShipment(req, res)

// Bulk operations
async bulkCreateShipments(req, res)
async bulkGenerateLabels(req, res)
```

## Data Models

### Order Schema Extension

```javascript
const orderSchema = new mongoose.Schema({
  // ... existing fields
  
  shipping: {
    type: shippingDetailsSchema,
    required: true
  },
  
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    landmark: String
  },
  
  billingAddress: {
    // Same structure as shippingAddress
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ 'shipping.awbNumber': 1 });
orderSchema.index({ 'shipping.rapidshypOrderId': 1 });
orderSchema.index({ status: 1, createdAt: -1 });
```

### Shipment Log Schema

```javascript
const shipmentLogSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  awbNumber: String,
  eventType: {
    type: String,
    enum: ['api_call', 'webhook', 'status_update', 'error'],
    required: true
  },
  action: String,
  request: Object,
  response: Object,
  statusCode: Number,
  error: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

shipmentLogSchema.index({ orderId: 1, timestamp: -1 });
shipmentLogSchema.index({ awbNumber: 1 });
```

## API Integration Details

### RapidShyp API Configuration

**Base URL**: `https://api.rapidshyp.com/v1`

**Authentication**:
```javascript
headers: {
  'Authorization': `Bearer ${process.env.RAPIDSHYP_API_KEY}`,
  'Content-Type': 'application/json'
}
```

### Key API Endpoints

1. **Create Shipment**
   - Endpoint: `POST /shipments`
   - Request: Order details, pickup/delivery addresses, package info
   - Response: Order ID, AWB number, tracking URL

2. **Calculate Rates**
   - Endpoint: `POST /rates/calculate`
   - Request: Origin/destination pincodes, weight, dimensions
   - Response: Available couriers with rates and delivery estimates

3. **Generate Label**
   - Endpoint: `GET /shipments/{orderId}/label`
   - Response: PDF label URL

4. **Track Shipment**
   - Endpoint: `GET /shipments/{awbNumber}/track`
   - Response: Current status, tracking history

5. **Schedule Pickup**
   - Endpoint: `POST /pickups`
   - Request: Pickup address, date, package count
   - Response: Pickup ID, confirmation

6. **Webhook Registration**
   - Endpoint: `POST /webhooks`
   - Request: Webhook URL, events to subscribe
   - Response: Webhook ID, secret

### Request/Response Examples

**Create Shipment Request**:
```json
{
  "order_id": "ORD123456",
  "order_date": "2024-01-15T10:30:00Z",
  "payment_mode": "prepaid",
  "pickup_address": {
    "name": "Ishori Warehouse",
    "phone": "9876543210",
    "address_line_1": "123 Warehouse Street",
    "city": "Jaipur",
    "state": "Rajasthan",
    "pincode": "302001",
    "country": "India"
  },
  "delivery_address": {
    "name": "John Doe",
    "phone": "9876543211",
    "address_line_1": "456 Customer Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "products": [{
    "name": "Silk Saree",
    "sku": "SAR001",
    "quantity": 1,
    "price": 2500,
    "hsn_code": "54071000"
  }],
  "package": {
    "weight": 0.5,
    "length": 30,
    "width": 20,
    "height": 5
  },
  "declared_value": 2500,
  "courier_code": "delhivery"
}
```

**Create Shipment Response**:
```json
{
  "success": true,
  "data": {
    "order_id": "RS123456789",
    "awb_number": "AWB123456789",
    "courier_name": "Delhivery",
    "tracking_url": "https://track.rapidshyp.com/AWB123456789",
    "label_url": "https://labels.rapidshyp.com/RS123456789.pdf",
    "estimated_delivery": "2024-01-18"
  }
}
```

## Error Handling

### Error Categories

1. **Validation Errors** (400)
   - Invalid pincode
   - Missing required fields
   - Invalid package dimensions

2. **Authentication Errors** (401)
   - Invalid API key
   - Expired token

3. **Business Logic Errors** (422)
   - Pincode not serviceable
   - Insufficient balance
   - Order already shipped

4. **Server Errors** (500)
   - API timeout
   - Service unavailable

### Retry Strategy

```javascript
const retryConfig = {
  maxRetries: 5,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504]
};

async function retryWithBackoff(apiCall, config = retryConfig) {
  let lastError;
  let delay = config.initialDelay;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      if (!isRetryable(error, config)) {
        throw error;
      }
      
      if (attempt < config.maxRetries) {
        await sleep(delay);
        delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
      }
    }
  }
  
  throw lastError;
}
```

### Error Logging

```javascript
const logShipmentError = async (orderId, action, error) => {
  await ShipmentLog.create({
    orderId,
    eventType: 'error',
    action,
    error: error.message,
    request: error.config?.data,
    response: error.response?.data,
    statusCode: error.response?.status,
    timestamp: new Date()
  });
  
  // Send alert to admins
  await sendAdminAlert({
    type: 'shipping_error',
    orderId,
    action,
    error: error.message
  });
};
```

## Testing Strategy

### Unit Tests

1. **RapidShyp Service Tests**
   - Test API request formatting
   - Test response parsing
   - Test error handling
   - Mock API responses

2. **Order Model Tests**
   - Test shipping field validation
   - Test status transitions
   - Test data integrity

3. **Webhook Handler Tests**
   - Test signature validation
   - Test event processing
   - Test idempotency

### Integration Tests

1. **End-to-End Order Flow**
   - Create order → Create shipment → Generate label
   - Track shipment → Receive webhook → Update status
   - Handle NDR → Update action → Reattempt delivery

2. **Rate Calculator**
   - Test rate calculation with various inputs
   - Test caching mechanism
   - Test fallback rates

3. **Bulk Operations**
   - Test bulk shipment creation
   - Test bulk label generation
   - Test error handling in bulk operations

### API Testing

Use sandbox environment for testing:
- Base URL: `https://sandbox.rapidshyp.com/v1`
- Test API key: Provided by RapidShyp
- Test pincodes and scenarios

## Security Considerations

### API Key Management

```javascript
// Store in environment variables
RAPIDSHYP_API_KEY=your_api_key_here
RAPIDSHYP_WEBHOOK_SECRET=your_webhook_secret_here
RAPIDSHYP_ENVIRONMENT=sandbox // or production
```

### Webhook Signature Validation

```javascript
const validateWebhookSignature = (payload, signature, secret) => {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};
```

### Rate Limiting

```javascript
const rateLimiter = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // per window
  skipSuccessfulRequests: false
};
```

### Data Encryption

- Encrypt sensitive customer data in logs
- Mask phone numbers and addresses in error messages
- Use HTTPS for all API communications

## Performance Optimization

### Caching Strategy

1. **Rate Calculation Cache**
   - Cache key: `rates:${originPincode}:${destPincode}:${weight}`
   - TTL: 15 minutes
   - Storage: Redis

2. **Serviceability Cache**
   - Cache key: `serviceable:${pincode}`
   - TTL: 24 hours
   - Storage: Redis

3. **Tracking Data Cache**
   - Cache key: `tracking:${awbNumber}`
   - TTL: 2 hours
   - Storage: Redis

### Async Job Processing

Use Bull queue for background jobs:

```javascript
// Job types
- createShipmentJob
- generateLabelJob
- schedulePickupJob
- updateTrackingJob
- sendNotificationJob

// Job priorities
- High: Customer-facing operations (rate calculation, tracking)
- Medium: Order processing (shipment creation, label generation)
- Low: Batch operations (bulk processing, reports)
```

### Database Indexing

```javascript
// Critical indexes
Order: ['shipping.awbNumber', 'shipping.rapidshypOrderId', 'status']
ShipmentLog: ['orderId', 'awbNumber', 'timestamp']
ShippingConfig: ['warehouse.isDefault']
```

## Monitoring and Observability

### Metrics to Track

1. **API Performance**
   - Request latency
   - Success/failure rates
   - Retry counts

2. **Business Metrics**
   - Shipments created per day
   - Average delivery time
   - NDR rate
   - RTO rate
   - Shipping cost per order

3. **System Health**
   - Queue length
   - Failed jobs
   - Cache hit rate

### Logging

```javascript
// Log levels
- ERROR: API failures, webhook processing errors
- WARN: Retry attempts, validation failures
- INFO: Successful operations, status updates
- DEBUG: Request/response details (in development only)

// Log format
{
  timestamp: ISO8601,
  level: string,
  service: 'rapidshyp',
  action: string,
  orderId: string,
  awbNumber: string,
  duration: number,
  success: boolean,
  error: string
}
```

### Alerts

Set up alerts for:
- API error rate > 5%
- Webhook processing failures
- Queue backlog > 100 jobs
- Shipment creation failures
- High NDR rate (> 10%)

## Deployment Considerations

### Environment Variables

```bash
# RapidShyp Configuration
RAPIDSHYP_API_KEY=your_production_api_key
RAPIDSHYP_WEBHOOK_SECRET=your_webhook_secret
RAPIDSHYP_BASE_URL=https://api.rapidshyp.com/v1
RAPIDSHYP_ENVIRONMENT=production

# Webhook Configuration
WEBHOOK_URL=https://yourdomain.com/api/webhooks/rapidshyp

# Redis Configuration (for caching)
REDIS_URL=redis://localhost:6379

# Job Queue Configuration
BULL_REDIS_URL=redis://localhost:6379
```

### Database Migrations

1. Add shipping fields to Order model
2. Create ShipmentLog collection
3. Create ShippingConfig collection
4. Add indexes for performance

### Rollout Strategy

1. **Phase 1**: Deploy to staging, test with sandbox API
2. **Phase 2**: Enable for 10% of orders in production
3. **Phase 3**: Monitor metrics, fix issues
4. **Phase 4**: Gradually increase to 100%
5. **Phase 5**: Deprecate old shipping system

## Future Enhancements

1. **Multi-Warehouse Support**: Route orders to nearest warehouse
2. **Smart Courier Selection**: ML-based courier selection based on performance
3. **Predictive Delivery**: Estimate delivery time using historical data
4. **Customer Preferences**: Allow customers to choose delivery slots
5. **International Shipping**: Extend support for international orders
6. **Returns Management**: Integrate reverse logistics
7. **Insurance**: Automatic shipment insurance for high-value orders
8. **Analytics Dashboard**: Real-time shipping analytics and insights
