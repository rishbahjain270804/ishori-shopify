import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './PaymentSuccess.css'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0)
  }, [])

  const handleViewOrder = () => {
    if (orderId) {
      navigate(`/orders/${orderId}`)
    } else {
      navigate('/orders')
    }
  }

  const handleContinueShopping = () => {
    navigate('/collections')
  }

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <div className="success-icon-wrapper">
          <div className="success-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-message">
          Thank you for your order. Your payment has been processed successfully.
        </p>

        {orderId && (
          <div className="order-info">
            <p className="order-id-label">Order ID</p>
            <p className="order-id-value">{orderId}</p>
          </div>
        )}

        <div className="success-details">
          <div className="detail-item">
            <span className="detail-icon">📧</span>
            <p>Order confirmation has been sent to your email</p>
          </div>
          <div className="detail-item">
            <span className="detail-icon">📦</span>
            <p>You can track your order status in the Orders section</p>
          </div>
          <div className="detail-item">
            <span className="detail-icon">🚚</span>
            <p>Your order will be delivered within 5-7 business days</p>
          </div>
        </div>

        <div className="success-actions">
          <button className="btn-primary" onClick={handleViewOrder}>
            View Order Details
          </button>
          <button className="btn-secondary" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
