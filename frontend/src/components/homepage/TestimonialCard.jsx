import { FiCheck } from 'react-icons/fi'
import { BsQuote } from 'react-icons/bs'
import './TestimonialCard.css'

const TestimonialCard = ({ quote, customerName, rating, customerPhoto, verified }) => {
  return (
    <div className="testimonial-card">
      {/* Decorative Quote Icon */}
      <div className="quote-icon">
        <BsQuote />
      </div>

      {/* Quote Text */}
      <p className="quote-text">{quote}</p>

      {/* Rating Stars */}
      <div className="rating-stars">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`star ${index < rating ? 'filled' : 'empty'}`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Customer Info */}
      <div className="customer-info">
        {customerPhoto && (
          <img
            src={customerPhoto}
            alt={customerName}
            className="customer-photo"
          />
        )}
        <div className="customer-details">
          <span className="customer-name">{customerName}</span>
          {verified && (
            <span className="verified-badge" title="Verified Purchase">
              <FiCheck />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard
