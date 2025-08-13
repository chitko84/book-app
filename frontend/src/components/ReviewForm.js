import { useState } from 'react';

function ReviewForm({ onSubmit, initialData, onCancel }) {
  const [user, setUser] = useState(initialData?.user || '');
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || '');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user || !rating || !comment) return;
    onSubmit({ user, rating, comment });
    if (!initialData) {
      setUser('');
      setRating(0);
      setComment('');
    }
  };

  return (
    <div className="review-form-container">
      <h3>{initialData ? 'Edit Your Review' : 'Share Your Thoughts'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= (hoverRating || rating) ? 'active' : ''}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                {star <= (hoverRating || rating) ? '★' : '☆'}
              </span>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label>Review</label>
          <textarea
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {initialData ? 'Update Review' : 'Submit Review'}
          </button>
          {initialData && (
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;