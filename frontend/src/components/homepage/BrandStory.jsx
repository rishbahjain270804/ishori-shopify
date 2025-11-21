import React from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiUsers, FiTrendingUp, FiHeart } from 'react-icons/fi';
import './BrandStory.css';

const BrandStory = () => {
  return (
    <section className="brand-story">
      <div className="container">
        <div className="brand-story-content">
          {/* Text Content */}
          <div className="story-text">
            <span className="story-label">Our Heritage</span>
            <h2 className="story-title">
              Crafting Elegance
              <span className="story-title-accent"> Since 1985</span>
            </h2>
            <p className="story-description">
              For over three decades, Ishori has been synonymous with luxury and tradition. 
              Each saree in our collection is a testament to the timeless artistry of Indian 
              craftsmanship, meticulously handwoven by master artisans who have perfected 
              their craft over generations.
            </p>
            <p className="story-description">
              We believe in preserving heritage while embracing contemporary elegance. 
              Every thread tells a story, every pattern carries meaning, and every saree 
              becomes a cherished heirloom.
            </p>

            <div className="story-features">
              <div className="story-feature">
                <div className="feature-icon">
                  <FiAward />
                </div>
                <div className="feature-content">
                  <h4>Premium Quality</h4>
                  <p>Only the finest silk and materials</p>
                </div>
              </div>

              <div className="story-feature">
                <div className="feature-icon">
                  <FiUsers />
                </div>
                <div className="feature-content">
                  <h4>Master Artisans</h4>
                  <p>Handcrafted by skilled weavers</p>
                </div>
              </div>

              <div className="story-feature">
                <div className="feature-icon">
                  <FiTrendingUp />
                </div>
                <div className="feature-content">
                  <h4>Timeless Design</h4>
                  <p>Traditional meets contemporary</p>
                </div>
              </div>

              <div className="story-feature">
                <div className="feature-icon">
                  <FiHeart />
                </div>
                <div className="feature-content">
                  <h4>Customer Love</h4>
                  <p>Trusted by thousands nationwide</p>
                </div>
              </div>
            </div>

            <Link to="/about" className="story-cta">
              Discover Our Story
            </Link>
          </div>

          {/* Image Content */}
          <div className="story-images">
            <div className="story-image-main">
              <img 
                src="/src/assets/collection1.avif" 
                alt="Artisan crafting saree"
                loading="lazy"
              />
            </div>
            <div className="story-image-accent">
              <img 
                src="/src/assets/collection1.avif" 
                alt="Traditional weaving"
                loading="lazy"
              />
            </div>
            <div className="story-image-overlay">
              <div className="overlay-stat">
                <span className="stat-number">38+</span>
                <span className="stat-label">Years of Excellence</span>
              </div>
              <div className="overlay-stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="overlay-stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Unique Designs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
