import React, { useState } from 'react';
import { FiMail, FiCheck } from 'react-icons/fi';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    // Simulate API call - replace with actual API
    setTimeout(() => {
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }, 1000);
  };

  return (
    <section className="newsletter-luxury">
      <div className="newsletter-overlay"></div>
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-icon">
            <FiMail />
          </div>
          <h2 className="newsletter-title">
            Join Our Exclusive Circle
          </h2>
          <p className="newsletter-description">
            Be the first to discover new collections, exclusive offers, and timeless elegance. 
            Subscribe to our newsletter for a world of luxury delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="form-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="newsletter-input"
                disabled={status === 'loading' || status === 'success'}
                required
              />
              <button 
                type="submit" 
                className="newsletter-submit"
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? 'Subscribing...' : 
                 status === 'success' ? <FiCheck /> : 'Subscribe'}
              </button>
            </div>
            
            {message && (
              <p className={`newsletter-message ${status}`}>
                {message}
              </p>
            )}
          </form>

          <p className="newsletter-privacy">
            We respect your privacy. Unsubscribe anytime. No spam, ever.
          </p>

          <div className="newsletter-benefits">
            <div className="benefit-item">
              <span className="benefit-icon">✨</span>
              <span>Exclusive Previews</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🎁</span>
              <span>Special Offers</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📚</span>
              <span>Style Guides</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
