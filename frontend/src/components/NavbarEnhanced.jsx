import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './NavbarEnhanced.css'

const NavbarEnhanced = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const { user, isAuthenticated, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [navigate])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className={`navbar-enhanced ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Ishori</span>
          <span className="logo-subtitle">Sarees</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu desktop-only">
          <Link to="/collections" className="nav-link">
            Collections
          </Link>
          <Link to="/about" className="nav-link">
            About Us
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Search */}
          <button
            className="nav-icon-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="8" cy="8" r="6" />
              <path d="M14 14l4 4" />
            </svg>
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="nav-icon-btn" aria-label="Wishlist">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 18.35l-1.45-1.32C3.4 12.36 0 9.28 0 5.5 0 2.42 2.42 0 5.5 0 7.24 0 8.91 0.81 10 2.09 11.09 0.81 12.76 0 14.5 0 17.58 0 20 2.42 20 5.5c0 3.78-3.4 6.86-8.55 11.54L10 18.35z" />
            </svg>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="nav-icon-btn cart-btn" aria-label="Shopping Cart">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 1h3l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L19 6H5" />
              <circle cx="8" cy="18" r="1" />
              <circle cx="16" cy="18" r="1" />
            </svg>
            {cartItemsCount > 0 && (
              <span className="cart-badge animate-scale-in">{cartItemsCount}</span>
            )}
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button
                className="nav-icon-btn user-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="User Menu"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="10" cy="7" r="4" />
                  <path d="M3 20v-2a7 7 0 0114 0v2" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown animate-fade-in-down">
                  <div className="user-dropdown-header">
                    <p className="user-name">{user?.firstName} {user?.lastName}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                  <div className="user-dropdown-divider"></div>
                  <Link to="/profile" className="user-dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <circle cx="10" cy="7" r="4" />
                      <path d="M3 20v-2a7 7 0 0114 0v2" />
                    </svg>
                    My Profile
                  </Link>
                  <Link to="/orders" className="user-dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 3h14v14H3z" />
                    </svg>
                    My Orders
                  </Link>
                  <Link to="/addresses" className="user-dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2l8 8-8 8-8-8z" />
                    </svg>
                    Addresses
                  </Link>
                  {user?.role === 'admin' && (
                    <>
                      <div className="user-dropdown-divider"></div>
                      <Link to="/admin" className="user-dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <rect x="3" y="3" width="6" height="6" />
                          <rect x="11" y="3" width="6" height="6" />
                          <rect x="3" y="11" width="6" height="6" />
                          <rect x="11" y="11" width="6" height="6" />
                        </svg>
                        Admin Panel
                      </Link>
                    </>
                  )}
                  <div className="user-dropdown-divider"></div>
                  <button onClick={handleLogout} className="user-dropdown-item logout-btn">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 3h8v2H5v10h6v2H3z" />
                      <path d="M13 7l4 3-4 3v-2H9V9h4z" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="search-bar animate-fade-in-down">
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="search-icon"
              >
                <circle cx="8" cy="8" r="6" />
                <path d="M14 14l4 4" />
              </svg>
              <input
                type="text"
                placeholder="Search for sarees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="search-close"
              >
                ✕
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="mobile-menu animate-slide-in-right">
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-menu-close"
              >
                ✕
              </button>
            </div>
            <div className="mobile-menu-content">
              <Link to="/collections" className="mobile-menu-item">
                Collections
              </Link>
              <Link to="/about" className="mobile-menu-item">
                About Us
              </Link>
              <Link to="/contact" className="mobile-menu-item">
                Contact
              </Link>
              {isAuthenticated ? (
                <>
                  <div className="mobile-menu-divider"></div>
                  <Link to="/profile" className="mobile-menu-item">
                    My Profile
                  </Link>
                  <Link to="/orders" className="mobile-menu-item">
                    My Orders
                  </Link>
                  <Link to="/addresses" className="mobile-menu-item">
                    Addresses
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="mobile-menu-item">
                      Admin Panel
                    </Link>
                  )}
                  <div className="mobile-menu-divider"></div>
                  <button onClick={handleLogout} className="mobile-menu-item logout-btn">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="mobile-menu-divider"></div>
                  <Link to="/login" className="mobile-menu-item">
                    Login
                  </Link>
                  <Link to="/register" className="mobile-menu-item">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

export default NavbarEnhanced
