import React, { useState, useEffect } from 'react'
import './Marquee.css'

const Marquee = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > 50) {
        // Scrolling down - hide marquee
        setIsVisible(false)
      } else {
        // At top - show marquee
        setIsVisible(true)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={`marquee-container ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="marquee-content">
        <span className="marquee-text">
          ✨ New Collection Launch • Premium Handcrafted Sarees • Free Shipping on Orders Above ₹5000 • 
          ✨ New Collection Launch • Premium Handcrafted Sarees • Free Shipping on Orders Above ₹5000 • 
          ✨ New Collection Launch • Premium Handcrafted Sarees • Free Shipping on Orders Above ₹5000 • 
        </span>
      </div>
    </div>
  )
}

export default Marquee
