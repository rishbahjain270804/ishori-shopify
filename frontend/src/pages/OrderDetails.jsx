import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import OrderTimeline from '../components/order/OrderTimeline'
import OrderInvoice from '../components/order/OrderInvoice'
import './OrderDetails.css'

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setOrder(response.data.data)
      }
    } catch (err) {
      console.error('Fetch order error:', err)
      setError(err.response?.data?.message || 'Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a cancellation reason')
      return
    }

    try {
      setCancelling(true)
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/${id}/cancel`,
        { reason: cancelReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setOrder(response.data.data)
        setShowCancelModal(false)
        setCancelReason('')
        alert('Order cancelled successfully')
      }
    } catch (err) {
      console.error('Cancel order error:', err)
      alert(err.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  const canCancelOrder = () => {
    return (
      order &&
      ['Pending', 'Processing'].includes(order.orderStatus) &&
      order.orderStatus !== 'Cancelled'
    )
  }

  if (loading) {
    return (
      <div className="order-details-container">
        <div className="loading-spinner">Loading order details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="order-details-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/orders')} className="back-btn">
          Back to Orders
        </button>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="order-details-container">
        <div className="error-message">Order not found</div>
        <button onClick={() => navigate('/orders')} className="back-btn">
          Back to Orders
        </button>
      </div>
    )
  }

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <button onClick={() => navigate('/orders')} className="back-btn">
          ← Back to Orders
        </button>
        <h1>Order Details</h1>
      </div>

      <div className="order-details-content">
        {/* Order Summary Card */}
        <div className="order-summary-card">
          <div className="order-header-info">
            <div>
              <h2>Order #{order._id}</h2>
              <p className="order-date">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className={`order-status-badge ${order.orderStatus.toLowerCase()}`}>
              {order.orderStatus}
            </div>
          </div>

          {/* Cancel Order Button */}
          {canCancelOrder() && (
            <button
              className="cancel-order-btn"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Order
            </button>
          )}

          {/* Cancellation Details */}
          {order.cancellation && (
            <div className="cancellation-details">
              <h3>Cancellation Details</h3>
              <p>
                <strong>Reason:</strong> {order.cancellation.reason}
              </p>
              <p>
                <strong>Cancelled By:</strong> {order.cancellation.cancelledBy}
              </p>
              <p>
                <strong>Cancelled At:</strong>{' '}
                {new Date(order.cancellation.cancelledAt).toLocaleString()}
              </p>
              {order.cancellation.refundStatus && (
                <>
                  <p>
                    <strong>Refund Status:</strong> {order.cancellation.refundStatus}
                  </p>
                  <p>
                    <strong>Refund Amount:</strong> ₹
                    {order.cancellation.refundAmount?.toFixed(2)}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Order Timeline */}
        {order.timeline && order.timeline.length > 0 && (
          <OrderTimeline timeline={order.timeline} orderStatus={order.orderStatus} />
        )}

        {/* Invoice Section */}
        {order.orderStatus !== 'Cancelled' && order.isPaid && (
          <OrderInvoice orderId={order._id} invoice={order.invoice} />
        )}

        {/* Order Items */}
        <div className="order-items-card">
          <h3>Order Items</h3>
          <div className="order-items-list">
            {order.orderItems.map((item, index) => (
              <div key={index} className="order-item">
                <img
                  src={item.image || '/placeholder.jpg'}
                  alt={item.name}
                  className="item-image"
                />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-price">₹{item.price.toFixed(2)} each</p>
                </div>
                <div className="item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="shipping-address-card">
          <h3>Shipping Address</h3>
          <div className="address-content">
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
            <p>
              {order.shippingAddress.zipCode}, {order.shippingAddress.country}
            </p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Payment & Price Summary */}
        <div className="payment-summary-card">
          <h3>Payment Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>₹{order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <span>₹{order.taxPrice.toFixed(2)}</span>
          </div>
          {order.coupon && order.coupon.discount > 0 && (
            <div className="summary-row discount">
              <span>Discount ({order.coupon.code}):</span>
              <span>-₹{order.coupon.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{order.totalPrice.toFixed(2)}</span>
          </div>
          <div className="payment-method">
            <strong>Payment Method:</strong> {order.paymentMethod}
          </div>
          <div className="payment-status">
            <strong>Payment Status:</strong>{' '}
            <span className={order.isPaid ? 'paid' : 'pending'}>
              {order.isPaid ? 'Paid' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Cancel Order</h3>
            <p>Please provide a reason for cancellation:</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
              rows="4"
            />
            <div className="modal-actions">
              <button
                onClick={() => setShowCancelModal(false)}
                className="modal-btn cancel"
                disabled={cancelling}
              >
                Close
              </button>
              <button
                onClick={handleCancelOrder}
                className="modal-btn confirm"
                disabled={cancelling || !cancelReason.trim()}
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
