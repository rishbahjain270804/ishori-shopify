import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import './CheckoutUnified.css'

const CheckoutUnified = () => {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.firstName + ' ' + user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('online')

  const cartItems = cart?.items || []
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 100
  const total = subtotal + shipping

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      clearCart()
      navigate('/payment-success')
    } catch (error) {
      console.error('Order failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="checkout-auth-required">
          <Card className="auth-card">
            <h2>Please Login to Continue</h2>
            <p>You need to be logged in to complete your purchase</p>
            <Button size="lg" onClick={() => navigate('/login')}>
              Login
            </Button>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="checkout-unified">
        <div className="container">
          <h1 className="page-title">Checkout</h1>

          <div className="checkout-progress">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span>Shipping</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>Payment</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Review</span>
            </div>
          </div>

          <div className="checkout-layout">
            <div className="checkout-main">
              {step === 1 && (
                <Card className="checkout-section animate-fade-in">
                  <h2 className="section-title">Shipping Information</h2>
                  <form onSubmit={handleShippingSubmit} className="shipping-form">
                    <div className="form-row">
                      <Input
                        label="Full Name"
                        required
                        value={shippingInfo.fullName}
                        onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                      />
                      <Input
                        label="Email"
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})}
                      />
                    </div>
                    <Input
                      label="Phone Number"
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    />
                    <Input
                      label="Address"
                      required
                      value={shippingInfo.address}
                      onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                    />
                    <div className="form-row">
                      <Input
                        label="City"
                        required
                        value={shippingInfo.city}
                        onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})}
                      />
                      <Input
                        label="State"
                        required
                        value={shippingInfo.state}
                        onChange={e => setShippingInfo({...shippingInfo, state: e.target.value})}
                      />
                      <Input
                        label="Pincode"
                        required
                        value={shippingInfo.pincode}
                        onChange={e => setShippingInfo({...shippingInfo, pincode: e.target.value})}
                      />
                    </div>
                    <Button type="submit" size="lg" fullWidth>
                      Continue to Payment
                    </Button>
                  </form>
                </Card>
              )}

              {step === 2 && (
                <Card className="checkout-section animate-fade-in">
                  <h2 className="section-title">Payment Method</h2>
                  <div className="payment-methods">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={e => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-content">
                        <div className="payment-title">Online Payment</div>
                        <div className="payment-desc">Pay securely using UPI, Cards, or Net Banking</div>
                      </div>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={e => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-content">
                        <div className="payment-title">Cash on Delivery</div>
                        <div className="payment-desc">Pay when you receive your order</div>
                      </div>
                    </label>
                  </div>
                  <div className="checkout-actions">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button size="lg" onClick={handlePlaceOrder} loading={loading}>
                      Place Order
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            <div className="checkout-sidebar">
              <Card className="order-summary">
                <h3 className="summary-title">Order Summary</h3>
                <div className="summary-items">
                  {cartItems.map((item, index) => (
                    <div key={index} className="summary-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-qty">Qty: {item.quantity}</div>
                      </div>
                      <div className="item-price">₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default CheckoutUnified
