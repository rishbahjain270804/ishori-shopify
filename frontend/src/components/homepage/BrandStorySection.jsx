import './BrandStorySection.css'

// Placeholder image - replace with actual craftsmanship image
import storyImage from '../../assets/collection1.avif'

const BrandStorySection = () => {
  return (
    <section className="brand-story-section">
      <div className="section-container">
        <div className="story-layout">
          {/* Story Content */}
          <div className="story-content">
            <h2 className="story-heading">Our Story</h2>
            <p className="story-text">
              At Ishori, we celebrate the timeless elegance of Indian sarees through 
              meticulous craftsmanship and contemporary design. Each piece in our collection 
              is carefully curated to honor traditional weaving techniques while embracing 
              modern aesthetics. Our artisans pour their heritage and skill into every thread, 
              creating sarees that tell stories of culture, grace, and sophistication. 
              We believe in sustainable fashion that empowers local communities and preserves 
              age-old textile traditions for generations to come.
            </p>
            <a href="/about" className="learn-more-button">
              Learn More
            </a>
          </div>

          {/* Story Imagery */}
          <div className="story-imagery">
            <img
              src={storyImage}
              alt="Ishori craftsmanship and artisan work"
              className="story-image"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandStorySection
