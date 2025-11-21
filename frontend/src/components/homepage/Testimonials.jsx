import React from 'react';
import { FiStar, FiCheckCircle } from 'react-icons/fi';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      text: 'The quality of the sarees is exceptional! I bought a Banarasi silk for my wedding and received countless compliments. The craftsmanship is truly remarkable.',
      verified: true
    },
    {
      id: 2,
      name: 'Anjali Patel',
      location: 'Ahmedabad',
      rating: 5,
      text: 'Ishori has become my go-to destination for sarees. The collection is exquisite, and the customer service is outstanding. Highly recommended!',
      verified: true
    },
    {
      id: 3,
      name: 'Meera Reddy',
      location: 'Hyderabad',
      rating: 5,
      text: 'I am in love with my Kanjivaram saree! The colors are vibrant, and the silk quality is premium. Worth every penny!',
      verified: true
    },
    {
      id: 4,
      name: 'Kavita Singh',
      location: 'Delhi',
      rating: 5,
      text: 'Beautiful collection with traditional and modern designs. The packaging was elegant, and delivery was prompt. Will definitely shop again!',
      verified: true
    },
    {
      id: 5,
      name: 'Divya Nair',
      location: 'Bangalore',
      rating: 5,
      text: 'The attention to detail in every saree is amazing. I purchased three sarees for different occasions, and each one exceeded my expectations!',
      verified: true
    },
    {
      id: 6,
      name: 'Lakshmi Iyer',
      location: 'Chennai',
      rating: 5,
      text: 'Absolutely stunning sarees with impeccable finishing. The silk feels luxurious and the colors are even more beautiful in person!',
      verified: true
    }
  ];

  return (
    <section className="testimonials-luxury" aria-labelledby="testimonials-heading">
      <div className="container">
        <header className="section-header">
          <span className="section-subtitle">Customer Love</span>
          <h2 id="testimonials-heading" className="section-title">What Our Customers Say</h2>
          <p className="section-description">
            Hear from women who have experienced the elegance and quality of Ishori sarees
          </p>
        </header>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="testimonial-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="testimonial-content">
                <div className="testimonial-header">
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar key={i} className="star-icon filled" />
                    ))}
                  </div>
                  {testimonial.verified && (
                    <span className="verified-badge">
                      <FiCheckCircle className="verified-icon" />
                      Verified Purchase
                    </span>
                  )}
                </div>

                <div className="quote-icon">"</div>
                <p className="testimonial-text">{testimonial.text}</p>

                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-location">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-footer">
          <a href="/reviews" className="view-all-link">
            Read All Reviews
            <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
