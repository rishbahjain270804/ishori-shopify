import React, { useState } from 'react';
import RatingStars from './RatingStars';
import './ReviewForm.css';

const ReviewForm = ({ productId, onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a review title');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a review description');
      return;
    }

    if (formData.description.length < 10) {
      setError('Review description must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          ...formData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      // Reset form
      setFormData({
        rating: 0,
        title: '',
        description: ''
      });

      if (onSubmitSuccess) {
        onSubmitSuccess(data.review);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="review-form">
        {error && (
          <div className="review-form-error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label>Your Rating *</label>
          <RatingStars
            rating={formData.rating}
            interactive={true}
            onChange={handleRatingChange}
            size="large"
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Review Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Summarize your experience"
            maxLength={100}
            required
            disabled={loading}
          />
          <span className="char-count">{formData.title.length}/100</span>
        </div>

        <div className="form-group">
          <label htmlFor="description">Review Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Share your thoughts about this product..."
            rows={5}
            maxLength={1000}
            required
            disabled={loading}
          />
          <span className="char-count">{formData.description.length}/1000</span>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
