import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import NavbarEnhanced from '../components/NavbarEnhanced'
import FooterUnified from '../components/FooterUnified'
import './ContactUs.css'
import bgVideo from '../assets/bgsaree_video.mp4'
import logoWhite from '../assets/logo-white.png'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Thank you for reaching out! We will get back to you soon.')
  }

  return (
    <div className="contact-us-page-premium">
      <NavbarEnhanced />
      
      {/* Hero Section - PREMIUM */}
      <section className="contact-hero-premium">
        <div className="hero-bg">
          <video autoPlay loop muted playsInline className="hero-video">
            <source src={bgVideo} type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
          <div className="hero-pattern"></div>
        </div>

        <div className="royal-container">
          <div className="hero-content-premium">
            <div className="hero-ornament-wrapper">
              <svg className="hero-ornament-svg" width="80" height="12" viewBox="0 0 80 12" fill="none">
                <path d="M0 6h30M50 6h30M35 1l5 5-5 5M45 11l-5-5 5-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="hero-badge-premium">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="4" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M2 5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span>We're Here to Help</span>
            </div>
            <h1 className="hero-title-premium">
              <span className="title-line">Connect with</span>
              <span className="title-line title-highlight">Ishori</span>
            </h1>
            <p className="hero-description-premium">
              Whether you have questions about our collections, need styling advice,<br/>
              or want to explore custom creations — we'd love to hear from you
            </p>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <div className="scroll-ornament"></div>
          <span>Get in Touch</span>
        </div>
      </section>

      {/* Contact Content - PREMIUM */}
      <section className="contact-content-premium">
        <div className="contact-ambient-bg">
          <div className="ambient-orb ambient-orb-1"></div>
          <div className="ambient-orb ambient-orb-2"></div>
          <div className="ambient-grid"></div>
        </div>

        <div className="royal-container">
          <div className="contact-layout-premium">
            {/* Contact Information Cards */}
            <div className="contact-info-premium">
              <div className="info-header">
                <div className="header-ornament-wrapper">
                  <svg className="header-ornament-svg" width="60" height="12" viewBox="0 0 60 12" fill="none">
                    <path d="M0 6h20M40 6h60M25 1l5 5-5 5M35 11l-5-5 5-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 className="info-title">
                  <span className="title-line">Ways to</span>
                  <span className="title-line title-highlight">Reach Us</span>
                </h2>
              </div>

              <div className="info-cards-grid">
                {/* Visit Card */}
                <div className="info-card-premium">
                  <div className="card-decoration card-decoration-tl">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M0 0L40 0L0 40L0 0Z" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                    </svg>
                  </div>
                  <div className="card-icon-wrapper">
                    <div className="icon-ring"></div>
                    <div className="card-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22c5 0 9-6 9-10 0-4-3-7-7-7s-7 3-7 7c0 4 4 10 5 10z" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="card-title">Visit Our Showroom</h3>
                  <p className="card-text">
                    M.I. Road, Jaipur<br/>
                    Rajasthan 302001<br/>
                    India
                  </p>
                  <Link to="/directions" className="card-link">
                    Get Directions
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </Link>
                </div>

                {/* Email Card */}
                <div className="info-card-premium">
                  <div className="card-decoration card-decoration-tl">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M0 0L40 0L0 40L0 0Z" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                    </svg>
                  </div>
                  <div className="card-icon-wrapper">
                    <div className="icon-ring"></div>
                    <div className="card-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M3 8l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="card-title">Email Us</h3>
                  <p className="card-text">
                    <a href="mailto:hello@ishori.in">hello@ishori.in</a><br/>
                    <a href="mailto:support@ishori.in">support@ishori.in</a>
                  </p>
                  <span className="card-note">Response within 24 hours</span>
                </div>

                {/* Phone Card */}
                <div className="info-card-premium">
                  <div className="card-decoration card-decoration-tl">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M0 0L40 0L0 40L0 0Z" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                    </svg>
                  </div>
                  <div className="card-icon-wrapper">
                    <div className="icon-ring"></div>
                    <div className="card-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 4h3l2 5-2 3c2 3 5 5 7 6l3-2 5 2v3c0 2-2 3-3 3-10 0-18-8-18-18 0-1 1-3 3-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="card-title">Call Us</h3>
                  <p className="card-text">
                    <a href="tel:+911234567890">+91 123 456 7890</a>
                  </p>
                  <span className="card-note">Mon-Sat: 10 AM - 7 PM IST</span>
                </div>

                {/* Social Card */}
                <div className="info-card-premium">
                  <div className="card-decoration card-decoration-tl">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M0 0L40 0L0 40L0 0Z" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                    </svg>
                  </div>
                  <div className="card-icon-wrapper">
                    <div className="icon-ring"></div>
                    <div className="card-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="card-title">Follow Us</h3>
                  <div className="social-links-premium">
                    <a href="https://instagram.com/ishori" target="_blank" rel="noopener noreferrer" className="social-link-premium">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="14" cy="4" r="0.5" fill="currentColor"/>
                      </svg>
                      Instagram
                    </a>
                    <a href="https://facebook.com/ishori" target="_blank" rel="noopener noreferrer" className="social-link-premium">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M14 1h-2.5C9.5 1 8 2.5 8 4.5V7H6v3h2v7h3v-7h2.5l.5-3h-3V4.5c0-.5.5-1 1-1H14V1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - PREMIUM */}
            <div className="contact-form-premium">
              <div className="form-card-premium">
                <div className="card-decoration card-decoration-tl">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <path d="M0 0L60 0L0 60L0 0Z" fill="url(#gradient-tl)" opacity="0.1"/>
                    <defs>
                      <linearGradient id="gradient-tl-form" x1="0" y1="0" x2="60" y2="60">
                        <stop offset="0%" stopColor="#D4A574"/>
                        <stop offset="100%" stopColor="transparent"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="card-decoration card-decoration-br">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <path d="M60 60L0 60L60 0L60 60Z" fill="url(#gradient-br)" opacity="0.1"/>
                    <defs>
                      <linearGradient id="gradient-br-form" x1="60" y1="60" x2="0" y2="0">
                        <stop offset="0%" stopColor="#862009"/>
                        <stop offset="100%" stopColor="transparent"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="form-header">
                  <h2 className="form-title-premium">Send Us a Message</h2>
                  <p className="form-subtitle-premium">
                    Fill out the form below and we'll get back to you within 24 hours
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form-premium-form">
                  <div className="form-row">
                    <div className="form-field-premium">
                      <label className="field-label-premium">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="field-input-premium"
                        required
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="form-field-premium">
                      <label className="field-label-premium">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="2" y="4" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M2 5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="field-input-premium"
                        required
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field-premium">
                      <label className="field-label-premium">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 3h2l1 3-1 2c1 2 3 3 4 4l2-1 3 1v2c0 1-1 2-2 2-5 0-10-5-10-10 0-1 1-2 2-2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="field-input-premium"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div className="form-field-premium">
                      <label className="field-label-premium">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 5h12M5 2v3M11 2v3M2 5h12v9H2V5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="field-input-premium"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="product">Product Information</option>
                        <option value="order">Order Status</option>
                        <option value="custom">Custom Order</option>
                        <option value="collaboration">Collaboration</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field-premium">
                    <label className="field-label-premium">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="field-textarea-premium"
                      rows="6"
                      required
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-submit-premium">
                    <span className="btn-text">Send Message</span>
                    <span className="btn-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M18 2L9 11M18 2l-6 16-3-7-7-3 16-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <div className="btn-shine"></div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterUnified />
    </div>
  )
}

export default ContactUs
