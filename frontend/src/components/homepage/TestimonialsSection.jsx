import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import TestimonialCard from './TestimonialCard'
import './TestimonialsSection.css'

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const testimonials = [
    {
      id: 1,
      quote: "The quality of the silk saree I purchased is exceptional. The craftsmanship is evident in every detail, and I received so many compliments at the wedding!",
      customerName: "Priya Sharma",
      rating: 5,
      verified: true,
    },
    {
      id: 2,
      quote: "Ishori's collection is stunning! The customer service was excellent, and my saree arrived beautifully packaged. Will definitely shop here again.",
      customerName: "Ananya Reddy",
      rating: 5,
      verified: true,
    },
    {
      id: 3,
      quote: "I love how they blend traditional designs with modern aesthetics. The cotton saree I bought is comfortable and elegant. Highly recommend!",
      customerName: "Meera Patel",
      rating: 5,
      verified: true,
    },
    {
      id: 4,
      quote: "Beautiful sarees with authentic craftsmanship. The colors are vibrant and the fabric quality is top-notch. Worth every penny!",
      customerName: "Kavya Iyer",
      rating: 5,
      verified: true,
    },
    {
      id: 5,
      quote: "Ishori has become my go-to for special occasions. Their designer collection is unique and the attention to detail is remarkable.",
      customerName: "Divya Menon",
      rating: 5,
      verified: true,
    },
  ]

  // Auto-rotation
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused, testimonials.length])

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handleDotClick = (index) => {
    setActiveIndex(index)
  }

  return (
    <section
      className="testimonials-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="section-container">
        <h2 className="section-title">Customer Reviews</h2>

        <div className="testimonials-carousel">
          {/* Navigation Arrows - Desktop */}
          <button
            className="carousel-arrow prev"
            onClick={handlePrevious}
            aria-label="Previous testimonial"
          >
            <FiChevronLeft />
          </button>

          {/* Testimonials Display */}
          <div className="testimonials-display">
            {testimonials.map((testimonial, index) => {
              const position = (index - activeIndex + testimonials.length) % testimonials.length
              return (
                <div
                  key={testimonial.id}
                  className={`testimonial-wrapper ${
                    position === 0 ? 'active' :
                    position === 1 ? 'next' :
                    position === testimonials.length - 1 ? 'prev' :
                    'hidden'
                  }`}
                >
                  <TestimonialCard {...testimonial} />
                </div>
              )
            })}
          </div>

          {/* Navigation Arrows - Desktop */}
          <button
            className="carousel-arrow next"
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <FiChevronRight />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
