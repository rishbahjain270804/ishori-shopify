import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './PaymentFailed.css'

const PaymentFailed = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const reason = searchParams.get('reason')

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0)
  }, [])

  const handleRetryPayment = () => {
    if (orderId) {
      navigate(`/checkout?orderId=${orderId}`)
    } else {
      navigate('/cart')
    }
  }

  const handleBackToCart = () => {
    navigate('/cart')
  }

  const handleContactSupport = () => {
    navigate('/contact')
  }

  return (
    <div className="payment-failed-container">
      <div className="payment-failed-card">
        <div className="failed-icon-wrapper">
          <div className="failed-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>

        <h1 className="failed-title">Payment Failed</h1>
        <p className="failed-message">
          We couldn't process your payment. Please try again or use a different payment method.
        </p>

        {reason && (
          <div className="failure-reason">
            <p className="reason-label">Reason</p>
            <p className="reason-value">{reason}</p>
          </div>
        )}

        <div className="failed-details">
          <div className="detail-item">
            <span className="detail-icon">💳</span>
            <p>Check if your card has sufficient balance</p>
          </div>
          <div className="detail-item">
            <span className="detail-icon">🔒</span>
            <p>Ensure your card is enabled for online transactions</p>
          </div>
          <div className="detail-item">
            <span className="detail-icon">📞</span>
            <p>Contact your bank if the issue persists</p>
          </div>
        </div>

        <div className="failed-actions">
          <button className="btn-primary" onClick={handleRetryPayment}>
            Retry Payment
          </button>
          <button className="btn-secondary" onClick={handleBackToCart}>
            Back to Cart
          </button>
          <button className="btn-link" onClick={handleContactSupport}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailed
