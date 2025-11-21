import React from 'react'
import { Link } from 'react-router-dom'
import NavbarEnhanced from '../components/NavbarEnhanced'
import FooterUnified from '../components/FooterUnified'
import './AboutUs.css'
import bgVideo from '../assets/bgsaree_video.mp4'
import founderImage from '../assets/collection13.avif'

const AboutUs = () => {
  return (
    <div className="about-us-page-premium">
      <NavbarEnhanced />
      
      {/* Hero Section - PREMIUM */}
      <section className="about-hero-premium">
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
                <path d="M8 1l2 5 5 .5-4 3.5 1 5-4-2.5-4 2.5 1-5-4-3.5 5-.5 2-5z" fill="currentColor"/>
              </svg>
              <span>Since 1985</span>
            </div>
            <h1 className="hero-title-premium">
              <span className="title-line">The Story of</span>
              <span className="title-line title-highlight">Ishori</span>
            </h1>
            <p className="hero-description-premium">
              Where tradition meets timeless elegance,<br/>
              and every thread tells a story of heritage and grace
            </p>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <div className="scroll-ornament"></div>
          <span>Discover Our Journey</span>
        </div>
      </section>

      {/* Brand Introduction - PREMIUM */}
      <section className="brand-intro-premium">
        <div className="intro-ambient-bg">
          <div className="ambient-orb ambient-orb-1"></div>
          <div className="ambient-orb ambient-orb-2"></div>
          <div className="ambient-grid"></div>
        </div>

        <div className="royal-container">
          <div className="intro-header-premium">
            <div className="header-ornament-wrapper">
              <svg className="header-ornament-svg" width="80" height="12" viewBox="0 0 80 12" fill="none">
                <path d="M0 6h30M50 6h30M35 1l5 5-5 5M45 11l-5-5 5-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="section-label-premium">Brand Introduction</span>
            <h2 className="section-title-premium">
              <span className="title-line">Fashion That's Felt,</span>
              <span className="title-line title-highlight">Not Just Worn</span>
            </h2>
          </div>

          <div className="intro-content-premium">
            <p className="intro-paragraph-premium">
              At <span className="brand-highlight">ISHORI</span> by <strong>Rakshit Bansal</strong> and <strong>Gunjan Vig</strong>, 
              we believe that fashion is not just worn — it's felt. Every drape, every weave, and every fold tells a story — 
              of grace, heritage, and timeless beauty.
            </p>
            
            <p className="intro-paragraph-premium">
              Ishori is a saree label where Indian tradition meets modern elegance, creating pieces that celebrate the soul 
              of our culture while embracing the spirit of today's woman.
            </p>
            
            <p className="intro-paragraph-premium">
              Each saree we craft is more than a garment — it is an emotion, a memory woven into threads of tradition. 
              With every collection, we aim to preserve the essence of Indian artistry while redefining how the modern woman 
              experiences it.
            </p>
            
            <p className="intro-paragraph-premium highlight-text">
              At Ishori, we don't just design sarees — we curate moments that make every woman feel confident, beautiful, 
              and connected to her roots. Every piece is made with love, intention, and meaning — a reflection of India's 
              timeless tradition and the woman who wears it with pride.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Message - PREMIUM */}
      <section className="founder-section-premium">
        <div className="founder-ambient-bg">
          <div className="ambient-orb ambient-orb-1"></div>
          <div className="ambient-orb ambient-orb-2"></div>
          <div className="ambient-grid"></div>
        </div>

        <div className="royal-container">
          <div className="founder-layout-premium">
            {/* Founder Image */}
            <div className="founder-visual-premium">
              <div className="visual-frame-premium">
                <div className="frame-glow"></div>
                <img src={founderImage} alt="Rakshit Bansal - Founder" className="frame-image"/>
                <div className="frame-corner frame-corner-tl">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <path d="M0 0L60 0L0 60L0 0Z" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                    <path d="M0 0L30 0M0 0L0 30" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="frame-corner frame-corner-tr">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <path d="M60 0L0 0L60 60L60 0Z" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                    <path d="M60 0L30 0M60 0L60 30" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="frame-corner frame-corner-bl">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <path d="M0 60L60 60L0 0L0 60Z" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                    <path d="M0 60L30 60M0 60L0 30" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="frame-corner frame-corner-br">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <path d="M60 60L0 60L60 0L60 60Z" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                    <path d="M60 60L30 60M60 60L60 30" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <div className="visual-badge">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 18c0-4 3-6 7-6s7 2 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Founder</span>
              </div>
            </div>

            {/* Founder Content */}
            <div className="founder-content-premium">
              <div className="content-header">
                <div className="header-ornament-wrapper">
                  <svg className="header-ornament-svg" width="60" height="12" viewBox="0 0 60 12" fill="none">
                    <path d="M0 6h20M40 6h60M25 1l5 5-5 5M35 11l-5-5 5-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="section-label-premium">A Message from the Founder</span>
                <h2 className="section-title-premium">
                  <span className="title-line">A Dream Woven</span>
                  <span className="title-line title-highlight">with Tradition</span>
                </h2>
              </div>

              <div className="founder-quote-premium">
                <div className="quote-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M12 28c-4 0-7-3-7-7s3-7 7-7c2 0 4 1 5 2V8h-5c-6 0-10 4-10 10v10c0 6 4 10 10 10h5v-10h-5zm24 0c-4 0-7-3-7-7s3-7 7-7c2 0 4 1 5 2V8h-5c-6 0-10 4-10 10v10c0 6 4 10 10 10h5v-10h-5z" fill="currentColor" opacity="0.1"/>
                  </svg>
                </div>

                <p className="quote-text-premium">
                  <span className="brand-highlight">Ishori</span> is more than just a brand to me — 
                  it's a dream woven with threads of tradition, love, and legacy. Having grown up amidst the beauty of sarees, 
                  I've always believed that every drape carries a story, a memory, and a reflection of our culture.
                </p>
                
                <p className="quote-text-premium">
                  With Ishori, my vision is to take this timeless heritage into the hearts and homes of women everywhere, 
                  blending tradition with modern grace.
                </p>
                
                <p className="quote-text-premium">
                  Every saree at Ishori is a promise — of authenticity, quality, and elegance. It is my way of honoring 
                  our artisans, celebrating our culture, and cherishing the women who make sarees come alive with their grace.
                </p>
                
                <p className="quote-text-premium highlight-text">
                  I invite you to be a part of this journey, to celebrate tradition with us, and to experience the beauty 
                  of Ishori in every weave.
                </p>
                
                <div className="founder-signature-premium">
                  <div className="signature-line"></div>
                  <p className="founder-name-premium">Rakshit Bansal</p>
                  <p className="founder-title-premium">Founder, <span className="brand-highlight">Ishori</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - PREMIUM */}
      <section className="values-section-premium">
        <div className="values-ambient-bg">
          <div className="ambient-orb ambient-orb-1"></div>
          <div className="ambient-orb ambient-orb-2"></div>
          <div className="ambient-grid"></div>
        </div>

        <div className="royal-container">
          <div className="values-header-premium">
            <div className="header-ornament-wrapper">
              <svg className="header-ornament-svg" width="80" height="12" viewBox="0 0 80 12" fill="none">
                <path d="M0 6h30M50 6h30M35 1l5 5-5 5M45 11l-5-5 5-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="section-label-premium">Our Values</span>
            <h2 className="section-title-premium">
              <span className="title-line">What We</span>
              <span className="title-line title-highlight">Stand For</span>
            </h2>
          </div>

          <div className="values-grid-premium">
            <div className="value-card-premium">
              <div className="card-decoration card-decoration-tl">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M0 0L40 0L0 40L0 0Z" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                </svg>
              </div>
              <div className="value-icon-wrapper">
                <div className="icon-ring"></div>
                <div className="value-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 4L20 12L28 16L20 20L16 28L12 20L4 16L12 12L16 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                  </svg>
                </div>
              </div>
              <h3 className="value-title-premium">Artisan Excellence</h3>
              <p className="value-description-premium">
                Honoring centuries-old craftsmanship and supporting skilled artisans who bring our designs to life with dedication and mastery.
              </p>
            </div>

            <div className="value-card-premium">
              <div className="card-decoration card-decoration-tl">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M0 0L40 0L0 40L0 0Z" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                </svg>
              </div>
              <div className="value-icon-wrapper">
                <div className="icon-ring"></div>
                <div className="value-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 28c6 0 10-8 10-12 0-4-3-8-8-8s-8 4-8 8c0 4 4 12 6 12z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
              </div>
              <h3 className="value-title-premium">Heritage Preservation</h3>
              <p className="value-description-premium">
                Preserving India's rich textile heritage while adapting it for the contemporary woman who values tradition.
              </p>
            </div>

            <div className="value-card-premium">
              <div className="card-decoration card-decoration-tl">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M0 0L40 0L0 40L0 0Z" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                </svg>
              </div>
              <div className="value-icon-wrapper">
                <div className="icon-ring"></div>
                <div className="value-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 4L19 13L28 16L19 19L16 28L13 19L4 16L13 13L16 4Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
              </div>
              <h3 className="value-title-premium">Quality Promise</h3>
              <p className="value-description-premium">
                Every saree is crafted with meticulous attention to detail, ensuring authenticity, elegance, and lasting beauty.
              </p>
            </div>

            <div className="value-card-premium">
              <div className="card-decoration card-decoration-tl">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M0 0L40 0L0 40L0 0Z" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                </svg>
              </div>
              <div className="value-icon-wrapper">
                <div className="icon-ring"></div>
                <div className="value-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 28l-8-8c-3-3-3-8 0-11s8-3 11 0L16 12l-3-3c-3-3-8-3-11 0s-3 8 0 11L16 28z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
              </div>
              <h3 className="value-title-premium">Emotional Connection</h3>
              <p className="value-description-premium">
                Creating pieces that resonate with emotions, memories, and the spirit of Indian womanhood across generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterUnified />
    </div>
  )
}

export default AboutUs
