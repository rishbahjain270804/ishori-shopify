import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import RatingStars from './RatingStars';
import './ReviewList.css';

const ReviewList = ({ productId, currentUserId, onReviewsLoad }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    hasMore: false
  });
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    fetchReviews(1);
  }, [productId]);

  const fetchReviews = async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/product/${productId}?page=${page}&limit=10`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reviews');
      }

      if (page === 1) {
        setReviews(data.reviews);
      } else {
        setReviews(prev => [...prev, ...data.reviews]);
      }

      setPagination(data.pagination);
      setRatingDistribution(data.ratingDistribution || []);
      setAverageRating(data.averageRating || 0);
      setTotalRatings(data.totalRatings || 0);

      if (onReviewsLoad) {
        onReviewsLoad({
          averageRating: data.averageRating,
          totalReviews: data.pagination.totalReviews
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchReviews(pagination.currentPage + 1);
    }
  };

  const handleHelpfulClick = (reviewId, isHelpful) => {
    // Update local state optimistically
    setReviews(prev =>
      prev.map(review =>
        review._id === reviewId
          ? {
              ...review,
              helpfulCount: isHelpful
                ? review.helpfulCount + 1
                : Math.max(0, review.helpfulCount - 1)
            }
          : review
      )
    );
  };

  const getRatingPercentage = (rating) => {
    if (totalRatings === 0) return 0;
    const ratingData = ratingDistribution.find(r => r._id === rating);
    return ratingData ? Math.round((ratingData.count / totalRatings) * 100) : 0;
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="review-list-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="review-list-container">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => fetchReviews(1)} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-list-container">
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        
        {totalRatings > 0 && (
          <div className="reviews-summary">
            <div className="average-rating-section">
              <div className="average-rating-number">{averageRating.toFixed(1)}</div>
              <div className="average-rating-stars">
                <RatingStars rating={averageRating} size="medium" />
                <div className="total-reviews">{totalRatings} review{totalRatings !== 1 ? 's' : ''}</div>
              </div>
            </div>

            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="rating-bar-row">
                  <span className="rating-label">{rating} ★</span>
                  <div className="rating-bar">
                    <div
                      className="rating-bar-fill"
                      style={{ width: `${getRatingPercentage(rating)}%` }}
                    ></div>
                  </div>
                  <span className="rating-percentage">
                    {getRatingPercentage(rating)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <>
          <div className="reviews-list">
            {reviews.map(review => (
              <ReviewCard
                key={review._id}
                review={review}
                currentUserId={currentUserId}
                onHelpfulClick={handleHelpfulClick}
              />
            ))}
          </div>

          {pagination.hasMore && (
            <div className="load-more-section">
              <button
                onClick={handleLoadMore}
                className="load-more-button"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Reviews'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList;
