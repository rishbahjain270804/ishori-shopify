import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import MainLayout from '../layouts/MainLayout'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import './CartUnified.css'

const CartUnified = () => {
  const navigate = useNavigate()
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  const cartItems = cart?.items || []
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 5000 ? 0 : 100
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0
  const total = subtotal + shipping - discount

  const handleApplyCoupon = () => {
    if (couponCode === 'SAVE10') {
      setAppliedCoupon({ code: couponCode, discount: 10 })
    }
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="cart-empty">
          <div className="container">
            <Card className="empty-cart-card">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                <path d="M40 50h40l-5 30H45l-5-30z" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="50" cy="85" r="3" fill="currentColor" />
                <circle cx="70" cy="85" r="3" fill="currentColor" />
              </svg>
              <h2>Your Cart is Empty</h2>
              <p>Looks like you haven't added anything to your cart yet</p>
              <Button size="lg" onClick={() => navigate('/collections')}>
                Start Shopping
              </Button>
            </Card>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="cart-unified">
        <div className="container">
          <div className="cart-header">
            <h1 className="page-title">Shopping Cart</h1>
            <p className="cart-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
          </div>

          <div className="cart-layout">
            <div className="cart-items-section">
              {cartItems.map((item, index) => (
                <Card key={index} className="cart-item animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="item-image">
                    <img src={item.image || '/placeholder.jpg'} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <Link to={`/product/${item.slug}`} className="item-name">{item.name}</Link>
                    <div className="item-meta">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <div className="item-price">₹{item.price.toLocaleString()}</div>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">₹{(item.price * item.quantity).toLocaleString()}</div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 2h8M2 5h16M3 5l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M8 9v6M12 9v6" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="cart-summary-section">
              <Card className="cart-summary">
                <h3 className="summary-title">Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount ({appliedCoupon.discount}%)</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <div className="coupon-section">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                  />
                  <Button size="sm" variant="outline" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>

                <Button size="lg" fullWidth onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>

                <button className="continue-shopping" onClick={() => navigate('/collections')}>
                  Continue Shopping
                </button>
              </Card>

              <div className="trust-badges">
                <div className="trust-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4 6v6c0 5 3 9 8 10 5-1 8-5 8-10V6l-8-4z" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <div className="trust-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 10h18M3 14h18M7 6h10v12H7z" />
                  </svg>
                  <span>Free Shipping over ₹5000</span>
                </div>
                <div className="trust-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
                  </svg>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default CartUnified
