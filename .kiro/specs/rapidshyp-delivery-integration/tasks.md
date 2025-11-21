# RapidShyp Delivery Integration - Implementation Tasks

## Task List

- [ ] 1. Set up project infrastructure and configuration
  - Create environment variables for RapidShyp API credentials
  - Install required npm packages (axios, bull, ioredis)
  - Set up Redis connection for caching and job queues
  - _Requirements: 12.1, 12.2_

- [ ] 2. Create core data models and schemas
- [ ] 2.1 Create Order model extensions with shipping fields
  - Add shipping object with RapidShyp-specific fields (awbNumber, rapidshypOrderId, courierPartner, etc.)
  - Add tracking history array for status updates
  - Add NDR and RTO nested objects
  - Update order status enum to include shipping statuses
  - _Requirements: 1.3, 5.3, 7.1, 8.1_

- [ ] 2.2 Create ShippingConfig model
  - Define warehouse address schema
  - Create courier preferences configuration
  - Add rate calculation settings
  - Add notification preferences
  - _Requirements: 10.3, 10.4_

- [ ] 2.3 Create ShipmentLog model for audit trail
  - Define schema for logging API calls and webhook events
  - Add indexes for orderId, awbNumber, and timestamp
  - _Requirements: 12.5, 13.4_

- [ ] 2.4 Write database migration scripts
  - Create migration to add shipping fields to existing orders
  - Create indexes for performance optimization
  - _Requirements: 1.3_

- [ ] 3. Implement RapidShyp service layer
- [ ] 3.1 Create base RapidShyp service class
  - Set up axios instance with base URL and authentication headers
  - Implement request/response interceptors for logging
  - Add API key validation
  - _Requirements: 12.1, 12.2, 12.5_

- [ ] 3.2 Implement shipment management methods
  - Create createShipment() method with order data transformation
  - Create cancelShipment() method
  - Create getShipmentStatus() method
  - Add error handling for each method
  - _Requirements: 1.1, 1.2, 9.1, 9.2_

- [ ] 3.3 Implement rate calculation methods
  - Create calculateShippingRates() method with caching
  - Create getServiceability() method to check pincode coverage
  - Implement Redis caching with 15-minute TTL
  - Add fallback to default rates on API failure
  - _Requirements: 2.1, 2.2, 2.5_

- [ ] 3.4 Implement label and pickup methods
  - Create generateShippingLabel() method returning PDF URL
  - Create schedulePickup() method with date/time validation
  - Create cancelPickup() method
  - _Requirements: 3.1, 3.2, 4.1, 4.2_

- [ ] 3.5 Implement tracking methods
  - Create trackShipment() method with caching
  - Create getTrackingHistory() method
  - Parse and normalize tracking status from API response
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 3.6 Implement NDR and RTO methods
  - Create updateNDRAction() method for re-delivery instructions
  - Create getRTODetails() method
  - _Requirements: 7.4, 8.1_

- [ ] 3.7 Implement retry logic with exponential backoff
  - Create retryWithBackoff() utility function
  - Configure retryable status codes and max attempts
  - Add delay calculation with backoff multiplier
  - _Requirements: 13.1, 13.2, 13.3_

- [ ] 3.8 Write unit tests for RapidShyp service
  - Mock API responses for all methods
  - Test error handling and retry logic
  - Test caching behavior
  - _Requirements: 13.1, 13.2_

- [ ] 4. Create shipping rate calculator endpoints
- [ ] 4.1 Create shipping controller with rate calculation endpoint
  - Implement POST /api/shipping/calculate-rates endpoint
  - Validate request parameters (pincode, weight, dimensions)
  - Call RapidShyp service and return courier options
  - Handle errors and return appropriate status codes
  - _Requirements: 2.1, 2.2, 2.4_

- [ ] 4.2 Create serviceability check endpoint
  - Implement GET /api/shipping/serviceability/:pincode endpoint
  - Check if pincode is serviceable
  - Return available courier partners
  - _Requirements: 2.1, 2.4_

- [ ] 4.3 Add rate calculation to checkout flow
  - Integrate rate calculator in cart/checkout API
  - Display shipping options to frontend
  - Allow courier selection during checkout
  - _Requirements: 2.2, 2.3_

- [ ] 4.4 Write integration tests for rate calculator
  - Test with various pincodes and weights
  - Test caching mechanism
  - Test error scenarios
  - _Requirements: 2.1, 2.5_

- [ ] 5. Implement order creation with shipment booking
- [ ] 5.1 Extend order controller to create shipments
  - Modify createOrder() to trigger shipment creation
  - Transform order data to RapidShyp format
  - Store AWB number and order ID in order record
  - Update order status to "processing"
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 5.2 Implement async job for shipment creation
  - Create Bull queue for shipment creation jobs
  - Add job processor to handle shipment creation
  - Implement job retry on failure
  - _Requirements: 1.1, 13.2_

- [ ] 5.3 Add error handling and notifications
  - Log shipment creation errors
  - Send admin notification on failure
  - Update order status appropriately
  - _Requirements: 1.4, 13.3, 13.4_

- [ ] 5.4 Send customer confirmation email
  - Create email template with order and tracking details
  - Trigger email after successful shipment creation
  - Include tracking link in email
  - _Requirements: 1.5, 15.1_

- [ ] 5.5 Write integration tests for order creation flow
  - Test end-to-end order to shipment creation
  - Test error scenarios
  - Test email notifications
  - _Requirements: 1.1, 1.5_

- [ ] 6. Implement shipping label generation
- [ ] 6.1 Create label generation endpoint
  - Implement POST /api/orders/:orderId/generate-label endpoint
  - Call RapidShyp service to get label PDF
  - Store label URL in order record
  - Return label URL to frontend
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 6.2 Add bulk label generation
  - Implement POST /api/orders/bulk/generate-labels endpoint
  - Accept array of order IDs
  - Generate labels for all orders
  - Return combined PDF or array of URLs
  - _Requirements: 3.5, 11.5_

- [ ] 6.3 Update order status after label generation
  - Change status to "ready_for_pickup"
  - Log label generation event
  - _Requirements: 3.4_

- [ ] 6.4 Write tests for label generation
  - Test single label generation
  - Test bulk label generation
  - Test error handling
  - _Requirements: 3.1, 3.5_

- [ ] 7. Implement pickup scheduling
- [ ] 7.1 Create pickup scheduling endpoint
  - Implement POST /api/shipping/schedule-pickup endpoint
  - Validate pickup date and time
  - Call RapidShyp service to schedule pickup
  - Store pickup ID in order records
  - _Requirements: 4.1, 4.2_

- [ ] 7.2 Send pickup confirmation notifications
  - Email warehouse staff with pickup details
  - Display pickup confirmation in admin dashboard
  - _Requirements: 4.3, 4.4_

- [ ] 7.3 Implement pickup retry mechanism
  - Auto-retry failed pickup requests after 30 minutes
  - Maximum 3 retry attempts
  - _Requirements: 4.5_

- [ ] 7.4 Write tests for pickup scheduling
  - Test successful pickup scheduling
  - Test retry mechanism
  - Test notifications
  - _Requirements: 4.1, 4.5_

- [ ] 8. Implement webhook handler for status updates
- [ ] 8.1 Create webhook endpoint and signature validation
  - Implement POST /api/webhooks/rapidshyp endpoint
  - Validate webhook signature using HMAC-SHA256
  - Return 200 OK immediately to acknowledge receipt
  - _Requirements: 6.1, 6.2_

- [ ] 8.2 Process webhook events asynchronously
  - Create Bull queue for webhook processing
  - Parse webhook payload and extract event data
  - Update order status based on event type
  - Add tracking history entry
  - _Requirements: 6.3, 6.6_

- [ ] 8.3 Implement event handlers for each status
  - Handle "picked_up" event
  - Handle "in_transit" event
  - Handle "out_for_delivery" event
  - Handle "delivered" event
  - Handle "ndr" event
  - Handle "rto_initiated" event
  - _Requirements: 6.3, 7.1, 8.1_

- [ ] 8.4 Trigger customer notifications on status changes
  - Send email for "out_for_delivery" status
  - Send SMS for "out_for_delivery" status
  - Send email for "delivered" status
  - _Requirements: 6.4, 15.2, 15.3, 15.4_

- [ ] 8.5 Implement idempotency for webhook processing
  - Check if event already processed using event ID
  - Skip duplicate events
  - _Requirements: 6.6_

- [ ] 8.6 Write tests for webhook handler
  - Test signature validation
  - Test event processing
  - Test idempotency
  - Test notifications
  - _Requirements: 6.2, 6.3, 6.6_

- [ ] 9. Implement shipment tracking
- [ ] 9.1 Create tracking endpoint for customers
  - Implement GET /api/orders/:orderId/track endpoint
  - Fetch latest tracking data from RapidShyp
  - Return tracking timeline and current status
  - _Requirements: 5.1, 5.3_

- [ ] 9.2 Create public tracking page endpoint
  - Implement GET /api/track/:awbNumber endpoint (no auth required)
  - Fetch tracking data using AWB number
  - Return tracking information for public display
  - _Requirements: 5.2, 5.4_

- [ ] 9.3 Implement tracking data caching
  - Cache tracking data in Redis with 2-hour TTL
  - Refresh cache on webhook updates
  - _Requirements: 5.5_

- [ ] 9.4 Add manual tracking refresh
  - Allow users to manually refresh tracking data
  - Bypass cache on manual refresh
  - _Requirements: 5.5_

- [ ] 9.5 Write tests for tracking functionality
  - Test tracking endpoint
  - Test caching behavior
  - Test manual refresh
  - _Requirements: 5.1, 5.5_

- [ ] 10. Implement NDR management
- [ ] 10.1 Create NDR dashboard endpoint
  - Implement GET /api/admin/ndr-cases endpoint
  - Return all orders with NDR status
  - Include customer contact and failure reason
  - _Requirements: 7.2_

- [ ] 10.2 Create NDR action endpoint
  - Implement POST /api/orders/:orderId/ndr-action endpoint
  - Accept updated delivery instructions
  - Call RapidShyp service to update NDR action
  - _Requirements: 7.3, 7.4_

- [ ] 10.3 Send customer notifications for NDR
  - Send automated SMS requesting updated instructions
  - Send email with re-delivery options
  - _Requirements: 7.5_

- [ ] 10.4 Write tests for NDR management
  - Test NDR dashboard
  - Test NDR action submission
  - Test customer notifications
  - _Requirements: 7.2, 7.4, 7.5_

- [ ] 11. Implement RTO processing
- [ ] 11.1 Handle RTO webhook events
  - Process "rto_initiated" webhook
  - Process "rto_delivered" webhook
  - Update order status accordingly
  - _Requirements: 8.1, 8.2_

- [ ] 11.2 Send RTO notifications
  - Notify customer about return initiation
  - Notify admin when RTO is delivered
  - _Requirements: 8.2_

- [ ] 11.3 Trigger refund workflow on RTO delivery
  - Update order status to "returned"
  - Initiate refund process
  - _Requirements: 8.3, 8.4_

- [ ] 11.4 Generate RTO reports
  - Create endpoint for RTO analytics
  - Show return reasons and trends
  - Calculate RTO costs
  - _Requirements: 8.5_

- [ ] 11.5 Write tests for RTO processing
  - Test RTO event handling
  - Test refund trigger
  - Test notifications
  - _Requirements: 8.1, 8.4_

- [ ] 12. Implement shipment cancellation
- [ ] 12.1 Create cancellation endpoint
  - Implement POST /api/orders/:orderId/cancel-shipment endpoint
  - Check if order can be cancelled (not yet picked up)
  - Call RapidShyp cancellation API
  - Update order status to "cancelled"
  - _Requirements: 9.1, 9.2_

- [ ] 12.2 Restore inventory on cancellation
  - Increment product stock quantities
  - _Requirements: 9.5_

- [ ] 12.3 Initiate refund on cancellation
  - Trigger refund workflow
  - Send cancellation confirmation email
  - _Requirements: 9.4_

- [ ] 12.4 Handle post-pickup cancellation attempts
  - Return error if already picked up
  - Provide return instructions instead
  - _Requirements: 9.3_

- [ ]* 12.5 Write tests for cancellation flow
  - Test successful cancellation
  - Test post-pickup cancellation attempt
  - Test inventory restoration
  - _Requirements: 9.1, 9.5_

- [ ] 13. Implement bulk order processing
- [ ] 13.1 Create bulk shipment creation endpoint
  - Implement POST /api/orders/bulk/create-shipments endpoint
  - Accept array of order IDs
  - Process shipments using batch API
  - Return success/failure counts
  - _Requirements: 11.1, 11.2, 11.3_

- [ ] 13.2 Implement bulk processing progress tracking
  - Show real-time progress in admin dashboard
  - Log failed orders separately
  - _Requirements: 11.3, 11.4_

- [ ] 13.3 Add bulk label generation (already covered in task 6.2)
  - Reference task 6.2 for implementation
  - _Requirements: 11.5_

- [ ]* 13.4 Write tests for bulk operations
  - Test bulk shipment creation
  - Test error handling for partial failures
  - Test progress tracking
  - _Requirements: 11.2, 11.4_

- [ ] 14. Implement multi-courier selection
- [ ] 14.1 Create courier preference configuration
  - Add admin endpoint to configure courier preferences
  - Store preferences in ShippingConfig model
  - Define selection rules based on order value, destination, product type
  - _Requirements: 10.2, 10.3_

- [ ] 14.2 Implement automatic courier selection logic
  - Evaluate configured rules for each order
  - Select optimal courier based on cost and delivery time
  - Allow manual override in admin dashboard
  - _Requirements: 10.4, 10.5_

- [ ] 14.3 Display courier options during rate calculation
  - Show available couriers with pricing and delivery estimates
  - Include reliability ratings if available
  - _Requirements: 10.2_

- [ ]* 14.4 Write tests for courier selection
  - Test rule evaluation
  - Test automatic selection
  - Test manual override
  - _Requirements: 10.3, 10.4_

- [ ] 15. Implement reporting and analytics
- [ ] 15.1 Create daily shipping summary report
  - Generate report with total shipments, costs, delivery success rate
  - Schedule daily report generation
  - Email report to admins
  - _Requirements: 14.1_

- [ ] 15.2 Create courier performance comparison report
  - Compare delivery times by courier
  - Show failure rates and costs
  - _Requirements: 14.2_

- [ ] 15.3 Create shipping cost trends report
  - Show cost trends over time
  - Break down by destination zones
  - _Requirements: 14.3_

- [ ] 15.4 Create NDR/RTO analysis report
  - Show common failure reasons
  - Identify patterns and trends
  - _Requirements: 14.4_

- [ ] 15.5 Add CSV export functionality
  - Export shipping data in CSV format
  - Include all relevant fields for analysis
  - _Requirements: 14.5_

- [ ]* 15.6 Write tests for reporting features
  - Test report generation
  - Test data accuracy
  - Test CSV export
  - _Requirements: 14.1, 14.5_

- [ ] 16. Create admin dashboard UI components
- [ ] 16.1 Create shipping management dashboard page
  - Display orders ready for shipment
  - Show pickup schedule
  - Display NDR cases
  - _Requirements: 3.3, 4.4, 7.2_

- [ ] 16.2 Create bulk operations interface
  - Add order selection checkboxes
  - Add bulk action buttons (create shipments, generate labels)
  - Show progress indicators
  - _Requirements: 11.1, 11.3_

- [ ] 16.3 Create shipping configuration page
  - Form to configure warehouse details
  - Courier preference settings
  - Notification preferences
  - _Requirements: 10.3_

- [ ] 16.4 Create reports and analytics page
  - Display shipping metrics and charts
  - Add date range filters
  - Export buttons for reports
  - _Requirements: 14.1, 14.2, 14.3_

- [ ] 17. Create customer-facing UI components
- [ ] 17.1 Add shipping rate display in checkout
  - Show available courier options
  - Display estimated delivery dates
  - Allow courier selection
  - _Requirements: 2.2, 2.3_

- [ ] 17.2 Create order tracking page
  - Display tracking timeline
  - Show current status and location
  - Display estimated delivery date
  - Add manual refresh button
  - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [ ] 17.3 Create public tracking page (no login required)
  - Accept AWB number as URL parameter
  - Display tracking information
  - _Requirements: 5.2_

- [ ] 17.4 Add tracking link in order confirmation email
  - Include tracking URL in email template
  - _Requirements: 15.1_

- [ ] 18. Implement notification system
- [ ] 18.1 Create email templates for shipping notifications
  - Order confirmation with tracking link
  - Dispatch notification
  - Out for delivery notification
  - Delivery confirmation
  - NDR notification
  - Cancellation confirmation
  - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [ ] 18.2 Implement SMS notification service
  - Integrate SMS provider (Twilio or similar)
  - Send SMS for out for delivery status
  - Send SMS for NDR cases
  - _Requirements: 15.3, 7.5_

- [ ] 18.3 Add notification preferences
  - Allow customers to manage notification preferences
  - Provide unsubscribe option
  - Maintain critical alerts regardless of preferences
  - _Requirements: 15.5_

- [ ]* 18.4 Write tests for notification system
  - Test email sending
  - Test SMS sending
  - Test preference handling
  - _Requirements: 15.1, 15.5_

- [ ] 19. Set up monitoring and logging
- [ ] 19.1 Implement structured logging
  - Log all API requests and responses
  - Log webhook events
  - Log errors with context
  - _Requirements: 12.5_

- [ ] 19.2 Set up performance monitoring
  - Track API latency
  - Monitor success/failure rates
  - Track retry counts
  - _Requirements: 13.1_

- [ ] 19.3 Configure alerts
  - Alert on high error rate (> 5%)
  - Alert on webhook processing failures
  - Alert on queue backlog
  - Alert on high NDR rate
  - _Requirements: 13.3_

- [ ] 19.4 Create monitoring dashboard
  - Display key metrics in real-time
  - Show API health status
  - Display queue status
  - _Requirements: 13.1_

- [ ] 20. Documentation and deployment
- [ ] 20.1 Write API documentation
  - Document all shipping endpoints
  - Include request/response examples
  - Document webhook payload format
  - _Requirements: All_

- [ ] 20.2 Create deployment guide
  - Document environment variables
  - Database migration steps
  - Redis setup instructions
  - Webhook registration steps
  - _Requirements: 12.1_

- [ ] 20.3 Create admin user guide
  - Document shipping workflow
  - Explain bulk operations
  - Guide for handling NDR cases
  - _Requirements: 7.2, 11.1_

- [ ] 20.4 Deploy to staging environment
  - Set up staging with sandbox API
  - Test all features end-to-end
  - Fix any issues found
  - _Requirements: All_

- [ ] 20.5 Deploy to production
  - Configure production API credentials
  - Run database migrations
  - Register production webhook
  - Enable for 10% of orders initially
  - Monitor and gradually increase to 100%
  - _Requirements: All_
