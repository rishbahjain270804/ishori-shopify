import HeroSection from '../components/homepage/HeroSection'
import FeaturedCollectionsSection from '../components/homepage/FeaturedCollectionsSection'
import ProductShowcaseSection from '../components/homepage/ProductShowcaseSection'
import CategoryNavigationSection from '../components/homepage/CategoryNavigationSection'
import BrandStorySection from '../components/homepage/BrandStorySection'
import TestimonialsSection from '../components/homepage/TestimonialsSection'
import NewsletterSection from '../components/homepage/NewsletterSection'
import './HomeRedesign.css'

// Hero media imports
import heroVideo from '../assets/bgsaree_video.mp4'
import heroPlaceholder from '../assets/collection1.avif'

const HomeRedesign = () => {
  const heroData = {
    heroVideo: heroVideo,
    heroImage: heroPlaceholder, // Fallback/poster image
    tagline: 'Elegance Redefined',
    subtitle: 'Discover premium sarees crafted for modern grace and timeless tradition.',
    primaryCTA: {
      text: 'Shop Collections',
      link: '/collections'
    },
    secondaryCTA: {
      text: 'Explore New Arrivals',
      link: '/collections?filter=new'
    }
  }

  return (
    <main className="home-redesign">
      {/* Hero Section */}
      <HeroSection {...heroData} />

      {/* Featured Collections Section */}
      <FeaturedCollectionsSection />

      {/* Product Showcase Section */}
      <ProductShowcaseSection />

      {/* Category Navigation Section */}
      <CategoryNavigationSection />

      {/* Brand Story Section */}
      <BrandStorySection />

      {/* Customer Testimonials Section */}
      <TestimonialsSection />

      {/* Newsletter Subscription Section */}
      <NewsletterSection />
    </main>
  )
}

export default HomeRedesign
