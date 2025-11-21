import React, { useState } from 'react'
import './PaymentMethods.css'

const PaymentMethods = ({ selectedMethod, onMethodChange, codCharges = 50 }) => {
  const paymentMethods = [
    {
      id: 'online',
      name: 'Online Payment',
      description: 'Pay securely using Credit/Debit Card, UPI, Net Banking, or Wallets',
      icon: '💳',
      recommended: true,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: `Pay when you receive your order (₹${codCharges} extra charges apply)`,
      icon: '💵',
      recommended: false,
    },
  ]

  return (
    <div className="payment-methods">
      <h3 className="payment-methods-title">Select Payment Method</h3>
      <div className="payment-methods-list">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-method-card ${
              selectedMethod === method.id ? 'selected' : ''
            }`}
            onClick={() => onMethodChange(method.id)}
          >
            <div className="payment-method-radio">
              <input
                type="radio"
                id={method.id}
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => onMethodChange(method.id)}
              />
            </div>
            <div className="payment-method-content">
              <div className="payment-method-header">
                <span className="payment-method-icon">{method.icon}</span>
                <div className="payment-method-info">
                  <h4 className="payment-method-name">
                    {method.name}
                    {method.recommended && (
                      <span className="recommended-badge">Recommended</span>
                    )}
                  </h4>
                  <p className="payment-method-description">
                    {method.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PaymentMethods
