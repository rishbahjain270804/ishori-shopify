import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './HeroSection.css'

const HeroSection = ({ 
  heroVideo, 
  heroImage, 
  tagline, 
  subtitle = '', 
  primaryCTA, 
  secondaryCTA 
}) => {
  const heroVideoRef = useRef(null)

  useEffect(() => {
    let rafId = null

    // Ensure video plays
    if (heroVideoRef.current) {
      heroVideoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error)
      })
    }

    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      // Use requestAnimationFrame for optimized performance
      rafId = requestAnimationFrame(() => {
        if (heroVideoRef.current) {
          const scrollPosition = window.scrollY
          // Apply parallax effect with 0.5 speed multiplier
          const translateY = scrollPosition * 0.5
          heroVideoRef.current.style.transform = `translateY(${translateY}px)`
        }
      })
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup function to remove event listener and cancel animation frame
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <section className="hero-section">
      {/* Hero Video Background */}
      <div className="hero-video-container">
        <video 
          ref={heroVideoRef}
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          poster={heroImage}
        >
          <source src={heroVideo} type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <img 
            src={heroImage} 
            alt="Ishori Sarees Collection" 
            className="hero-image"
          />
        </video>
      </div>

      {/* Hero Content Overlay */}
      <div className="hero-content">
        <div className="hero-content-card glass-card">
          <h1 className="hero-tagline">{tagline}</h1>
          {subtitle && <p className="hero-subtitle">{subtitle}</p>}
          
          {/* CTA Buttons */}
          <div className="hero-cta-buttons">
            <Link to={primaryCTA.link} className="btn btn-primary">
              {primaryCTA.text}
            </Link>
            <Link to={secondaryCTA.link} className="btn btn-secondary">
              {secondaryCTA.text}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-icon">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 5V19M12 19L5 12M12 19L19 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}

HeroSection.propTypes = {
  heroVideo: PropTypes.string.isRequired,
  heroImage: PropTypes.string, // Fallback/poster image
  tagline: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  primaryCTA: PropTypes.shape({
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }).isRequired,
  secondaryCTA: PropTypes.shape({
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }).isRequired,
}

export default HeroSection
