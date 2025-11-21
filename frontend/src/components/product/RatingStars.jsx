import React, { useState } from 'react';
import './RatingStars.css';

const RatingStars = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 'medium', 
  interactive = false, 
  onChange = null,
  showCount = false,
  count = 0
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  const handleClick = (value) => {
    if (interactive && onChange) {
      setSelectedRating(value);
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = interactive ? (hoverRating || selectedRating) : rating;

  return (
    <div className={`rating-stars ${size} ${interactive ? 'interactive' : ''}`}>
      <div className="stars-container">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          const isPartial = !isFilled && starValue - 0.5 <= displayRating;

          return (
            <span
              key={index}
              className={`star ${isFilled ? 'filled' : ''} ${isPartial ? 'partial' : ''}`}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              role={interactive ? 'button' : 'img'}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
              tabIndex={interactive ? 0 : -1}
            >
              {isPartial ? (
                <span className="star-partial-wrapper">
                  <span className="star-empty">☆</span>
                  <span className="star-half">★</span>
                </span>
              ) : (
                isFilled ? '★' : '☆'
              )}
            </span>
          );
        })}
      </div>
      {showCount && count > 0 && (
        <span className="rating-count">({count})</span>
      )}
      {interactive && displayRating > 0 && (
        <span className="rating-value">{displayRating} / {maxRating}</span>
      )}
    </div>
  );
};

export default RatingStars;
