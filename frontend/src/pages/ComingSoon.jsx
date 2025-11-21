import React from 'react'
import { Link } from 'react-router-dom'
import NavbarEnhanced from '../components/NavbarEnhanced'
import FooterUnified from '../components/FooterUnified'
import './ComingSoon.css'

const ComingSoon = ({ pageName = "This Page" }) => {
  return (
    <div className="coming-soon-page">
      <NavbarEnhanced />
      
      <section className="coming-soon-content">
        <div className="coming-soon-container">
          <div className="coming-soon-logo">
            <img src="/src/assets/logo-white.png" alt="Ishori" />
          </div>
          
          <h1 className="coming-soon-title">
            {pageName} <br />
            <span className="highlight">Coming Soon</span>
          </h1>
          
          <p className="coming-soon-text">
            We're crafting something beautiful for you. <br />
            Stay tuned as we weave tradition with elegance.
          </p>
          
          <div className="coming-soon-actions">
            <Link to="/" className="btn-primary">
              Return Home
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
          
          <div className="coming-soon-watermark">
            <img src="/src/assets/logo-white.png" alt="" />
          </div>
        </div>
      </section>
      
      <FooterUnified />
    </div>
  )
}

export default ComingSoon
