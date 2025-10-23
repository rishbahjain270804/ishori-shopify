import { useState } from 'react'
import './NewsletterSection.css'

const NewsletterSection = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous messages
    setError('')
    setSuccess(false)

    // Validate email
    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'homepage',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed')
      }

      // Success
      setSuccess(true)
      setEmail('')
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Newsletter subscription error:', err)
      setError(err.message || 'Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <h2 className="newsletter-heading">Stay Updated</h2>
        <p className="newsletter-subtext">
          Subscribe to receive exclusive updates on new collections, special offers, and styling tips.
        </p>
        
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="newsletter-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            disabled={isSubmitting}
            aria-label="Email address"
            aria-invalid={!!error}
          />
          <button
            type="submit"
            className="newsletter-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        
        {error && <p className="newsletter-error" role="alert">{error}</p>}
        {success && (
          <p className="newsletter-success" role="alert">
            Thank you for subscribing!
          </p>
        )}
        
        <p className="newsletter-privacy">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}

export default NewsletterSection
