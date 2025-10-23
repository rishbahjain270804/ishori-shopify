import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi'
import './Navbar.css'

import logo from '../assets/logo.png'
import { useEffect, useRef } from 'react'

const Navbar = () => {
  const logoRef = useRef(null)
  const navRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (logoRef.current) {
      logoRef.current.classList.add('fade-in-art')
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <nav ref={navRef} className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
            <div ref={logoRef} className="logo-art-container">
              <img src={logo} alt="Ishori Logo" className="logo-img" />
            </div>
        </Link>

        {/* Desktop Menu */}
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {menuItems.map((item) => (
            <li key={item.name} className="nav-item">
              <Link
                to={item.path}
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Search */}
          <button
            className="nav-icon-btn glass-button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <FiSearch />
          </button>

          {/* Cart */}
          <button
            className="nav-icon-btn glass-button cart-btn"
            onClick={() => navigate('/cart')}
            aria-label="Cart"
          >
            <FiShoppingCart />
            <span className="cart-badge">0</span>
          </button>

          {/* User */}
          <button
            className="nav-icon-btn glass-button"
            onClick={() => navigate('/login')}
            aria-label="Account"
          >
            <FiUser />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="nav-icon-btn glass-button mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="search-bar glass-card fade-in">
          <div className="container">
            <input
              type="text"
              placeholder="Search for sarees..."
              className="search-input"
              autoFocus
            />
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
