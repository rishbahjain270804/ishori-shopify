import React, { useState } from 'react';
import RatingStars from './RatingStars';
import './ReviewCard.css';

const ReviewCard = ({ review, onHelpfulClick, currentUserId }) => {
  const [isHelpful, setIsHelpful] = useState(
    review.helpfulBy?.includes(currentUserId) || false
  );
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleHelpfulClick = async () => {
    if (loading || !currentUserId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/${review._id}/helpful`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsHelpful(data.isHelpful);
        setHelpfulCount(data.helpfulCount);
        if (onHelpfulClick) {
          onHelpfulClick(review._id, data.isHelpful);
        }
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = () => {
    if (review.user?.firstName && review.user?.lastName) {
      return `${review.user.firstName} ${review.user.lastName}`;
    }
    return 'Anonymous User';
  };

  const getUserInitials = () => {
    const name = getUserName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || 'U';
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.user?.avatar?.url ? (
              <img src={review.user.avatar.url} alt={getUserName()} />
            ) : (
              <span className="avatar-initials">{getUserInitials()}</span>
            )}
          </div>
          <div className="reviewer-details">
            <div className="reviewer-name">
              {getUserName()}
              {review.verifiedPurchase && (
                <span className="verified-badge" title="Verified Purchase">
                  ✓ Verified Purchase
                </span>
              )}
            </div>
            <div className="review-date">{formatDate(review.createdAt)}</div>
          </div>
        </div>
        <div className="review-rating">
          <RatingStars rating={review.rating} size="small" />
        </div>
      </div>

      <div className="review-content">
        <h4 className="review-title">{review.title}</h4>
        <p className="review-description">{review.description}</p>
        
        {review.images && review.images.length > 0 && (
          <div className="review-images">
            {review.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`Review image ${index + 1}`}
                className="review-image"
              />
            ))}
          </div>
        )}
      </div>

      <div className="review-footer">
        <button
          className={`helpful-button ${isHelpful ? 'active' : ''}`}
          onClick={handleHelpfulClick}
          disabled={loading || !currentUserId}
          title={currentUserId ? 'Mark as helpful' : 'Login to mark as helpful'}
        >
          <span className="helpful-icon">👍</span>
          <span className="helpful-text">
            {isHelpful ? 'Helpful' : 'Was this helpful?'}
          </span>
          {helpfulCount > 0 && (
            <span className="helpful-count">({helpfulCount})</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
