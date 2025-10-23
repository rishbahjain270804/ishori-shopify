import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content glass-card">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-section">
              <h2 className="footer-logo text-gradient">Ishori</h2>
              <p className="footer-tagline">Elegance Redefined</p>
              <p className="footer-description">
                Discover the finest collection of traditional and contemporary sarees
                that celebrate the beauty and grace of Indian heritage.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon glass-button">
                  <FiFacebook />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon glass-button">
                  <FiInstagram />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon glass-button">
                  <FiTwitter />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/collections">Collections</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-section">
              <h3 className="footer-title">Customer Service</h3>
              <ul className="footer-links">
                <li><Link to="/shipping">Shipping Policy</Link></li>
                <li><Link to="/returns">Returns & Exchanges</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/size-guide">Size Guide</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h3 className="footer-title">Contact Us</h3>
              <ul className="contact-info">
                <li>
                  <FiMapPin className="contact-icon" />
                  <span>Near old nagar Palika,<br />Kotputli 303108</span>
                </li>
                <li>
                  <FiPhone className="contact-icon" />
                  <div>
                    <a href="tel:+918306038989">+91 8306038989</a><br />
                    <a href="tel:+918107708989">+91 8107708989</a>
                  </div>
                </li>
                <li>
                  <FiMail className="contact-icon" />
                  <a href="mailto:connectishori@gmail.com">connectishori@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="newsletter-section">
            <h3 className="newsletter-title">Subscribe to Our Newsletter</h3>
            <p className="newsletter-description">Get the latest updates on new collections and exclusive offers</p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn glass-button">
                Subscribe
              </button>
            </form>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p className="copyright">
              © {new Date().getFullYear()} Ishori. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="separator">•</span>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
